import { skillGroups } from '../../data/skills.js';
import { ui } from '../../i18n/ui.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { Chip } from '../ui/Chip.jsx';

export function Skills() {
  const { t } = useLanguage();

  return (
    <>
      <p className="measure mb-10 text-base text-muted">{t(ui.skills.note)}</p>
      <dl className="border-t border-line">
        {skillGroups.map((group) => (
          <div key={group.id} className="grid gap-4 border-b border-line py-6 md:grid-cols-12 md:gap-8">
            <dt className="label md:col-span-3">{t(group.label)}</dt>
            <dd className="flex flex-wrap gap-2 md:col-span-9">
              {group.items.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
