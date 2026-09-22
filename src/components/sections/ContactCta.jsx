import { Link } from 'react-router-dom';
import { profile } from '../../data/profile.js';
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export function ContactCta() {
  const { t } = useLanguage();

  return (
    <div className="grid gap-8 md:grid-cols-12">
      <h2 className="display-2 text-ink md:col-span-7">{t(ui.contactCta.title)}</h2>
      <div className="md:col-span-5">
        <p className="text-base text-muted">{t(ui.contactCta.body)}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`mailto:${profile.email}`} className="btn-primary">
            {profile.email}
          </a>
          <Link to="/contact" className="btn-outline">
            {t(ui.contactCta.formCta)}
          </Link>
        </div>
      </div>
    </div>
  );
}
