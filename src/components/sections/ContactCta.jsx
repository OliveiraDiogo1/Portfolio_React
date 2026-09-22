import { Link } from 'react-router-dom';
import { profile } from '../../data/profile.js';
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export function ContactCta() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-line bg-accent text-accent-ink">
      <div className="mx-auto grid w-full max-w-container gap-10 px-6 py-20 md:grid-cols-12 md:items-end md:px-10 md:py-24">
        <h2 className="display-2 md:col-span-7">{t(ui.contactCta.title)}</h2>
        <div className="md:col-span-5">
          <p className="text-base font-medium">{t(ui.contactCta.body)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} className="btn-inverse">
              {profile.email}
            </a>
            <Link to="/contact" className="btn-outline-inverse">
              {t(ui.contactCta.formCta)}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
