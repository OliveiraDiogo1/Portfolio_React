import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import ReCAPTCHA from 'react-google-recaptcha';
import { profile } from '../data/profile.js';
import { ui } from '../i18n/ui.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';
import {
  validateAndSanitizeInput,
  generateIdentifier,
  checkRateLimit,
  validateOrigin,
  logSecurityEvent,
  validateRecaptcha,
} from '../utils/security.js';

function codedError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

export default function Contact() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || profile.email;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.__EMAILJS_INIT_DONE) return;
    if (typeof window !== 'undefined') window.__EMAILJS_INIT_DONE = true;

    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey && publicKey !== 'your_emailjs_public_key_here') {
      emailjs.init(publicKey);
    } else {
      logSecurityEvent('EMAILJS_NOT_CONFIGURED', { message: 'EmailJS public key not configured' });
    }
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrorCode(null);
    setValidationErrors([]);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);
      setErrorCode(null);
      setValidationErrors([]);

      try {
        if (!validateOrigin()) {
          throw codedError('origin');
        }

        const { errors, sanitized } = validateAndSanitizeInput(form);
        if (errors.length > 0) {
          setValidationErrors(errors);
          return;
        }

        const identifier = generateIdentifier(sanitized);
        const rateLimitCheck = checkRateLimit(identifier);
        if (!rateLimitCheck.allowed) {
          throw codedError(rateLimitCheck.code ?? 'rateLimited');
        }

        const recaptchaValid = await validateRecaptcha(recaptchaToken);
        if (!recaptchaValid) {
          throw codedError('captcha');
        }

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        const emailServiceConfigured =
          !!serviceId &&
          !!templateId &&
          !!publicKey &&
          serviceId !== 'your_emailjs_service_id_here' &&
          templateId !== 'your_emailjs_template_id_here' &&
          publicKey !== 'your_emailjs_public_key_here';

        if (!emailServiceConfigured) {
          const subject = encodeURIComponent('Portfolio contact');
          const body = encodeURIComponent(
            `Name: ${sanitized.name}\nEmail: ${sanitized.email}\n\n${sanitized.message}`
          );
          window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
          setSubmitted(true);
          setForm({ name: '', email: '', message: '' });
          return;
        }

        const response = await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: sanitized.name,
            from_email: sanitized.email,
            message: sanitized.message,
            to_name: profile.name,
            timestamp: new Date().toISOString(),
            origin: window.location.origin,
          },
          publicKey
        );

        if (response.status !== 200) {
          throw codedError('sendFailed');
        }

        setSubmitted(true);
        setForm({ name: '', email: '', message: '' });
        setRecaptchaToken(null);
        recaptchaRef.current?.reset();
        logSecurityEvent('EMAIL_SENT_SUCCESSFULLY', { from: sanitized.email });
      } catch (error) {
        const code = error?.code ?? 'sendFailed';
        setErrorCode(code);
        logSecurityEvent('CONTACT_FORM_ERROR', { code, formData: { name: form.name, email: form.email } });
      } finally {
        setIsLoading(false);
      }
    },
    [contactEmail, form, recaptchaToken]
  );

  const isRecaptchaEnabled = useMemo(
    () =>
      Boolean(import.meta.env.VITE_RECAPTCHA_SITE_KEY) &&
      import.meta.env.VITE_RECAPTCHA_SITE_KEY !== 'your_recaptcha_site_key_here',
    []
  );

  const isFormDisabled = isLoading || (isRecaptchaEnabled && !recaptchaToken);

  const inputClass =
    'w-full rounded-xs border border-line bg-surface px-3 py-3 text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-ink';

  return (
    <div className="mx-auto w-full max-w-container px-6 py-20 md:px-10 md:py-28">
      <h1 className="display-2 max-w-3xl text-ink">{t(ui.contact.title)}</h1>
      <p className="mt-4 text-base text-muted">{t(ui.contact.subtitle)}</p>

      <div className="mt-12 max-w-3xl border border-line bg-surface p-6 md:p-10">
        {submitted ? (
          <div role="status" className="flex flex-col items-start gap-4">
            <span className="inline-flex h-12 w-12 items-center justify-center border border-accent text-ink">✓</span>
            <p className="text-base text-ink">{t(ui.contact.success)}</p>
          </div>
        ) : (
          <form className="grid gap-6" onSubmit={handleSubmit} autoComplete="off" noValidate>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="label mb-2 block">
                  {t(ui.contact.name)}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  maxLength={50}
                  placeholder={t(ui.contact.namePlaceholder)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="label mb-2 block">
                  {t(ui.contact.email)}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  maxLength={254}
                  placeholder={t(ui.contact.emailPlaceholder)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="label mb-2 block">
                {t(ui.contact.message)}
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows={6}
                maxLength={2000}
                placeholder={t(ui.contact.messagePlaceholder)}
                className={`${inputClass} resize-none`}
              />
            </div>

            {isRecaptchaEnabled ? (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={setRecaptchaToken}
                theme={theme}
              />
            ) : null}

            <button type="submit" disabled={isFormDisabled} className="btn-primary w-full md:w-auto">
              {isLoading ? t(ui.contact.sending) : t(ui.contact.send)}
            </button>

            {errorCode || validationErrors.length > 0 ? (
              <div
                role="alert"
                className="border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-700 dark:text-red-300"
              >
                {errorCode ? (
                  <p>{t(ui.validation[errorCode] ?? ui.validation.sendFailed, { email: contactEmail })}</p>
                ) : (
                  <ul className="list-inside list-disc space-y-1">
                    {validationErrors.map((error) => (
                      <li key={`${error.field}-${error.code}`}>{t(ui.validation[error.code])}</li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </form>
        )}
      </div>

      <p className="mt-6 text-sm text-muted">
        {t(ui.contact.fallbackNote)}{' '}
        <a href={`mailto:${contactEmail}`} className="link-quiet font-semibold text-ink">
          {contactEmail}
        </a>
      </p>
    </div>
  );
}
