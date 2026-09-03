'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  COMPANY_STORAGE_KEY,
  DEFAULT_COMPANY_SLUG,
  getCompany,
  isCompanySlug,
  type CompanyDefinition,
  type CompanySlug,
} from '@/lib/otonom/companies';
import {
  COMPANY_PROFILE_STORAGE_KEY,
  createEmptyCompanyProfile,
  getCompanySidebarHint,
  type CompanyProfile,
} from '@/lib/otonom/companyProfile';

type CompanyContextValue = {
  company: CompanyDefinition;
  companySlug: CompanySlug;
  setCompanySlug: (slug: CompanySlug) => void;
  profile: CompanyProfile;
  updateProfile: (patch: Partial<CompanyProfile>) => void;
  saveProfile: (next: CompanyProfile) => void;
  sidebarHint: string;
  ready: boolean;
};

const CompanyContext = createContext<CompanyContextValue | null>(null);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companySlug, setCompanySlugState] = useState<CompanySlug>(DEFAULT_COMPANY_SLUG);
  const [profile, setProfile] = useState<CompanyProfile>(() => createEmptyCompanyProfile());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const storedSector = window.localStorage.getItem(COMPANY_STORAGE_KEY);
      const storedProfile = window.localStorage.getItem(COMPANY_PROFILE_STORAGE_KEY);

      if (storedSector && isCompanySlug(storedSector)) {
        setCompanySlugState(storedSector);
      }

      if (storedProfile) {
        const parsed = JSON.parse(storedProfile) as Partial<CompanyProfile>;
        setProfile({
          ...createEmptyCompanyProfile(
            storedSector && isCompanySlug(storedSector) ? storedSector : DEFAULT_COMPANY_SLUG
          ),
          ...parsed,
        });
      } else if (storedSector && isCompanySlug(storedSector)) {
        setProfile(createEmptyCompanyProfile(storedSector));
      }
    } catch {
      /* ignore */
    } finally {
      setReady(true);
    }
  }, []);

  const setCompanySlug = useCallback((slug: CompanySlug) => {
    setCompanySlugState(slug);
    setProfile((current) => ({ ...current, sectorSlug: slug }));
    try {
      window.localStorage.setItem(COMPANY_STORAGE_KEY, slug);
      const raw = window.localStorage.getItem(COMPANY_PROFILE_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Partial<CompanyProfile>) : {};
      window.localStorage.setItem(
        COMPANY_PROFILE_STORAGE_KEY,
        JSON.stringify({ ...parsed, sectorSlug: slug })
      );
    } catch {
      /* ignore */
    }
  }, []);

  const updateProfile = useCallback((patch: Partial<CompanyProfile>) => {
    setProfile((current) => {
      const next = { ...current, ...patch };
      if (patch.sectorSlug && patch.sectorSlug !== current.sectorSlug) {
        setCompanySlugState(patch.sectorSlug);
        try {
          window.localStorage.setItem(COMPANY_STORAGE_KEY, patch.sectorSlug);
        } catch {
          /* ignore */
        }
      }
      return next;
    });
  }, []);

  const saveProfile = useCallback((next: CompanyProfile) => {
    setProfile(next);
    setCompanySlugState(next.sectorSlug);
    try {
      window.localStorage.setItem(COMPANY_PROFILE_STORAGE_KEY, JSON.stringify(next));
      window.localStorage.setItem(COMPANY_STORAGE_KEY, next.sectorSlug);
    } catch {
      /* ignore */
    }
  }, []);

  const company = getCompany(companySlug) ?? getCompany(DEFAULT_COMPANY_SLUG)!;
  const sidebarHint = getCompanySidebarHint(profile, company.shortName);

  const value = useMemo(
    () => ({
      company,
      companySlug,
      setCompanySlug,
      profile,
      updateProfile,
      saveProfile,
      sidebarHint,
      ready,
    }),
    [company, companySlug, setCompanySlug, profile, updateProfile, saveProfile, sidebarHint, ready]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider');
  }
  return context;
}
