'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { COMPANIES, type CompanySlug } from '@/lib/otonom/companies';
import { useCompany } from '@/components/otonom/CompanyProvider';
import {
  EMPLOYEE_RANGE_OPTIONS,
  ENTITY_TYPE_OPTIONS,
  KOBI_STATUS_OPTIONS,
  REVENUE_RANGE_OPTIONS,
  SCALE_CLASS_OPTIONS,
  STRUCTURE_TYPE_OPTIONS,
  suggestTaxIdType,
  validateCompanyProfile,
  type CompanyProfile,
  type EntityType,
} from '@/lib/otonom/companyProfile';
import { cn } from '@/lib/utils';

const fieldClass =
  'h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10';

const textareaClass =
  'w-full resize-none rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 md:p-6">
      <h2 className="font-display text-base font-bold text-[var(--bn-heading)]">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
        {required ? <span className="text-rose-300"> *</span> : null}
      </label>
      {children}
    </div>
  );
}

export default function CompanyProfileForm() {
  const { profile, saveProfile, ready, setCompanySlug } = useCompany();
  const [draft, setDraft] = useState<CompanyProfile>(profile);
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (ready) setDraft(profile);
  }, [ready, profile]);

  const update = (patch: Partial<CompanyProfile>) => {
    setDraft((current) => {
      const next = { ...current, ...patch };
      if (patch.entityType) {
        next.taxIdType = suggestTaxIdType(patch.entityType as EntityType);
      }
      return next;
    });
    setSaved(false);
    setErrors([]);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateCompanyProfile(draft);
    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      setSaved(false);
      return;
    }

    setSaving(true);
    saveProfile(draft);
    setSaving(false);
    setSaved(true);
    setErrors([]);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const selectSector = (slug: CompanySlug) => {
    update({ sectorSlug: slug });
    setCompanySlug(slug);
  };

  const showGroupFields =
    draft.structureType === 'group' ||
    draft.structureType === 'subsidiary' ||
    draft.structureType === 'franchise';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.length > 0 ? (
        <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          <ul className="list-disc space-y-1 pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <Section title="Sektör">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {COMPANIES.map((item) => {
            const selected = draft.sectorSlug === item.slug;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => selectSector(item.slug)}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-colors',
                  selected
                    ? 'border-emerald-400/40 bg-emerald-500/10'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
                )}
              >
                <p className="text-sm font-semibold text-[var(--bn-heading)]">{item.name}</p>
                {selected ? <Check className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden /> : null}
              </button>
            );
          })}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="NACE kodu">
            <input
              value={draft.naceCode}
              onChange={(e) => update({ naceCode: e.target.value })}
              className={fieldClass}
            />
          </Field>
          <Field label="Faaliyet özeti">
            <input
              value={draft.activityDescription}
              onChange={(e) => update({ activityDescription: e.target.value })}
              className={fieldClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Yasal kimlik">
        <Field label="Şirket unvanı" required>
          <input
            value={draft.legalName}
            onChange={(e) => update({ legalName: e.target.value })}
            className={fieldClass}
          />
        </Field>

        <Field label="Ticari unvan">
          <input
            value={draft.tradeName}
            onChange={(e) => update({ tradeName: e.target.value })}
            className={fieldClass}
          />
        </Field>

        <Field label="Şirket türü" required>
          <div className="grid gap-2 md:grid-cols-2">
            {ENTITY_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => update({ entityType: option.value, taxIdType: option.defaultTaxId })}
                className={cn(
                  'rounded-xl border px-3 py-3 text-left text-sm transition-colors',
                  draft.entityType === option.value
                    ? 'border-white/30 bg-white/[0.06] text-white'
                    : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.03]'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label={draft.taxIdType === 'tckn' ? 'TCKN' : 'VKN'} required>
            <div className="flex gap-2">
              <select
                value={draft.taxIdType}
                onChange={(e) =>
                  update({ taxIdType: e.target.value as CompanyProfile['taxIdType'], taxId: '' })
                }
                className="h-11 rounded-xl border border-white/15 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none"
              >
                <option value="vkn">VKN</option>
                <option value="tckn">TCKN</option>
              </select>
              <input
                value={draft.taxId}
                onChange={(e) => update({ taxId: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                className={fieldClass}
                inputMode="numeric"
              />
            </div>
          </Field>

          <Field label="Vergi dairesi" required>
            <input
              value={draft.taxOffice}
              onChange={(e) => update({ taxOffice: e.target.value })}
              className={fieldClass}
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="MERSİS no">
            <input
              value={draft.mersisNo}
              onChange={(e) => update({ mersisNo: e.target.value.replace(/\D/g, '').slice(0, 16) })}
              className={fieldClass}
              inputMode="numeric"
            />
          </Field>

          <Field label="Ticaret sicil no">
            <input
              value={draft.tradeRegistryNo}
              onChange={(e) => update({ tradeRegistryNo: e.target.value })}
              className={fieldClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Ölçek ve yapı">
        <Field label="Şirket yapısı" required>
          <div className="grid gap-2 md:grid-cols-2">
            {STRUCTURE_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => update({ structureType: option.value })}
                className={cn(
                  'rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors',
                  draft.structureType === option.value
                    ? 'border-emerald-400/35 bg-emerald-500/10 text-white'
                    : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.03]'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Field>

        {showGroupFields ? (
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Ana şirket / holding unvanı" required={draft.structureType !== 'franchise'}>
              <input
                value={draft.parentCompanyName}
                onChange={(e) => update({ parentCompanyName: e.target.value })}
                className={fieldClass}
              />
            </Field>
            <Field label="Grup şirket sayısı">
              <input
                value={draft.groupCompanyCount}
                onChange={(e) => update({ groupCompanyCount: e.target.value })}
                className={fieldClass}
              />
            </Field>
          </div>
        ) : null}

        <Field label="İşletme ölçeği" required>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {SCALE_CLASS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => update({ scaleClass: option.value })}
                className={cn(
                  'rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors',
                  draft.scaleClass === option.value
                    ? 'border-white/30 bg-white/[0.06] text-white'
                    : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.03]'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="KOBİ durumu" required>
          <div className="flex flex-wrap gap-2">
            {KOBI_STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => update({ kobiStatus: option.value })}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm transition-colors',
                  draft.kobiStatus === option.value
                    ? 'border-emerald-400/35 bg-emerald-500/10 text-emerald-100'
                    : 'border-white/10 text-zinc-400 hover:bg-white/[0.04]'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Çalışan sayısı" required>
            <select
              value={draft.employeeRange}
              onChange={(e) => update({ employeeRange: e.target.value as CompanyProfile['employeeRange'] })}
              className={fieldClass}
            >
              <option value="" className="bg-zinc-900">
                Seçin
              </option>
              {EMPLOYEE_RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-zinc-900">
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Yıllık net satış">
            <select
              value={draft.revenueRange}
              onChange={(e) => update({ revenueRange: e.target.value as CompanyProfile['revenueRange'] })}
              className={fieldClass}
            >
              <option value="" className="bg-zinc-900">
                Seçin
              </option>
              {REVENUE_RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-zinc-900">
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Kuruluş yılı">
            <input
              value={draft.foundingYear}
              onChange={(e) => update({ foundingYear: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              className={fieldClass}
              inputMode="numeric"
            />
          </Field>
        </div>
      </Section>

      <Section title="Yetkili ve iletişim">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Yetkili ad soyad" required>
            <input
              value={draft.authorizedPersonName}
              onChange={(e) => update({ authorizedPersonName: e.target.value })}
              className={fieldClass}
            />
          </Field>
          <Field label="Yetkili unvan">
            <input
              value={draft.authorizedPersonTitle}
              onChange={(e) => update({ authorizedPersonTitle: e.target.value })}
              className={fieldClass}
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Yetkili e-posta" required>
            <input
              type="email"
              value={draft.authorizedEmail}
              onChange={(e) => update({ authorizedEmail: e.target.value })}
              className={fieldClass}
            />
          </Field>
          <Field label="Yetkili telefon">
            <input
              value={draft.authorizedPhone}
              onChange={(e) => update({ authorizedPhone: e.target.value })}
              className={fieldClass}
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Şirket e-posta">
            <input
              type="email"
              value={draft.companyEmail}
              onChange={(e) => update({ companyEmail: e.target.value })}
              className={fieldClass}
            />
          </Field>
          <Field label="Şirket telefonu">
            <input
              value={draft.companyPhone}
              onChange={(e) => update({ companyPhone: e.target.value })}
              className={fieldClass}
            />
          </Field>
        </div>

        <Field label="Web sitesi">
          <input
            value={draft.website}
            onChange={(e) => update({ website: e.target.value })}
            className={fieldClass}
          />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="İl" required>
            <input
              value={draft.city}
              onChange={(e) => update({ city: e.target.value })}
              className={fieldClass}
            />
          </Field>
          <Field label="İlçe">
            <input
              value={draft.district}
              onChange={(e) => update({ district: e.target.value })}
              className={fieldClass}
            />
          </Field>
        </div>

        <Field label="Açık adres">
          <textarea
            rows={3}
            value={draft.address}
            onChange={(e) => update({ address: e.target.value })}
            className={textareaClass}
          />
        </Field>
      </Section>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Kaydediliyor…
          </>
        ) : saved ? (
          <>
            <Check className="h-4 w-4" aria-hidden />
            Kaydedildi
          </>
        ) : (
          'Kaydet'
        )}
      </button>
    </form>
  );
}
