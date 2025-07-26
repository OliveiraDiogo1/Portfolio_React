import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import emailjs from 'emailjs-com';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  validateAndSanitizeInput,
  generateIdentifier,
  checkRateLimit,
  validateOrigin,
  logSecurityEvent,
  validateRecaptcha
} from '../utils/security';

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState([]);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const recaptchaRef = useRef(null);

    useEffect(() => {
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        if (publicKey && publicKey !== 'your_emailjs_public_key_here') {
            emailjs.init(publicKey);
        } else {
            logSecurityEvent('EMAILJS_NOT_CONFIGURED', { message: 'EmailJS public key not configured' });
        }
    }, []);

    const handleChange = useCallback((e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError("");
        if (validationErrors.length > 0) setValidationErrors([]);
    }, [error, validationErrors.length]);

    const handleRecaptchaChange = useCallback((token) => {
        setRecaptchaToken(token);
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setValidationErrors([]);

        try {
            if (!validateOrigin()) {
                throw new Error('Request not allowed from this origin');
            }

            const { errors, sanitized } = validateAndSanitizeInput(form);
            if (errors.length > 0) {
                setValidationErrors(errors);
                setIsLoading(false);
                return;
            }

            const identifier = generateIdentifier(sanitized);
            const rateLimitCheck = checkRateLimit(identifier);
            if (!rateLimitCheck.allowed) {
                throw new Error(rateLimitCheck.reason);
            }

            const recaptchaValid = await validateRecaptcha(recaptchaToken);
            if (!recaptchaValid) {
                throw new Error('Please complete the reCAPTCHA verification');
            }

            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            if (!serviceId || !templateId || !publicKey || 
                serviceId === 'your_emailjs_service_id_here' ||
                templateId === 'your_emailjs_template_id_here' ||
                publicKey === 'your_emailjs_public_key_here') {
                throw new Error('Email service not properly configured');
            }

            const templateParams = {
                from_name: sanitized.name,
                from_email: sanitized.email,
                message: sanitized.message,
                to_name: "Diogo Oliveira",
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                origin: window.location.origin
            };

            const response = await emailjs.send(
                serviceId,
                templateId,
                templateParams,
                publicKey
            );

            if (response.status === 200) {
                setSubmitted(true);
                setForm({ name: "", email: "", message: "" });
                setRecaptchaToken(null);
                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                }
                setTimeout(() => setSubmitted(false), 5000);
                
                logSecurityEvent('EMAIL_SENT_SUCCESSFULLY', {
                    from: sanitized.email,
                    timestamp: new Date().toISOString()
                });
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            setError(error.message || "Sorry, there was an error sending your message. Please try again or contact me directly.");
            
            logSecurityEvent('CONTACT_FORM_ERROR', {
                error: error.message,
                formData: { name: form.name, email: form.email },
                timestamp: new Date().toISOString()
            });
        } finally {
            setIsLoading(false);
        }
    }, [form, recaptchaToken]);

    const isRecaptchaEnabled = useMemo(() => 
        import.meta.env.VITE_RECAPTCHA_SITE_KEY && 
        import.meta.env.VITE_RECAPTCHA_SITE_KEY !== 'your_recaptcha_site_key_here', 
    []);

    const isFormDisabled = useMemo(() => 
        isLoading || (!recaptchaToken && isRecaptchaEnabled), 
    [isLoading, recaptchaToken, isRecaptchaEnabled]);

    const inputClassName = useCallback((fieldName) => 
        `w-full rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-zinc-800/50 text-white border-2 outline-none backdrop-blur-sm transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
            focusedField === fieldName || form[fieldName]
                ? "border-yellow-300 ring-2 ring-yellow-200/20 shadow-yellow-300/10"
                : "border-zinc-700 hover:border-zinc-600"
        }`, 
    [focusedField, form]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 relative overflow-hidden py-8 sm:py-0">
            <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-tr from-blue-500/10 via-purple-700/10 to-pink-500/10" />

            <div className="relative z-10 w-full max-w-3xl px-4 sm:px-6">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                        Thanks for taking the time to{" "}
                        <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                            reach out
                        </span>
                    </h1>
                    <h2 className="text-base sm:text-lg md:text-xl text-zinc-300 font-light">
                        How can I help you today?
                    </h2>
                    <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 mx-auto mt-3 sm:mt-4 rounded-full"></div>
                </div>

                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300/20 to-yellow-500/20 rounded-3xl blur-xl opacity-30"></div>

                    <div className="relative bg-zinc-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-zinc-800/50">
                        {submitted ? (
                            <div className="text-center py-6 sm:py-8 animate-fade-in">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-sm sm:text-base text-zinc-300">Thank you for reaching out! I will get back to you soon.</p>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col gap-3 sm:gap-4">
                                <div className="flex flex-col gap-3 sm:gap-4">
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-zinc-300 mb-1 sm:mb-2">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField("name")}
                                                onBlur={() => setFocusedField("")}
                                                required
                                                disabled={isLoading}
                                                placeholder="Your name"
                                                maxLength={50}
                                                className={inputClassName("name")}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-zinc-300 mb-1 sm:mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField("email")}
                                                onBlur={() => setFocusedField("")}
                                                required
                                                disabled={isLoading}
                                                placeholder="you@email.com"
                                                maxLength={254}
                                                className={inputClassName("email")}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1 sm:mb-2">Message</label>
                                        <textarea
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField("message")}
                                            onBlur={() => setFocusedField("")}
                                            required
                                            disabled={isLoading}
                                            rows={4}
                                            maxLength={2000}
                                            placeholder="How can I help you? Tell me about your project, ideas, or questions..."
                                            className={inputClassName("message")}
                                        />
                                    </div>
                                </div>

                                {isRecaptchaEnabled && (
                                    <div className="flex justify-center">
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                            onChange={handleRecaptchaChange}
                                            theme="dark"
                                            size="normal"
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={isFormDisabled}
                                    className="relative mt-2 bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-black font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg transition-all duration-300 text-base sm:text-lg group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                                </button>
                            </div>
                        )}
                    </div>

                    {(!submitted && (error || validationErrors.length > 0)) && (
                        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-80 bg-red-500/90 backdrop-blur-sm rounded-lg p-4 border border-red-400 shadow-xl z-20">
                            {error && (
                                <div className="mb-2">
                                    <p className="text-red-100 text-sm font-medium">{error}</p>
                                </div>
                            )}
                            {validationErrors.length > 0 && (
                                <div>
                                    <p className="text-red-100 text-sm font-medium mb-2">Please fix the following:</p>
                                    <ul className="text-red-100 text-sm list-disc list-inside space-y-1">
                                        {validationErrors.map((err, index) => (
                                            <li key={index}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}