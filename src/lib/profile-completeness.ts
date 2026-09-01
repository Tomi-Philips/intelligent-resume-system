import { Profile, Company } from '@/types/database';

export function isJobSeekerProfileComplete(profile: Profile | null | undefined): boolean {
  if (!profile) return false;
  const hasName = Boolean(profile.full_name && profile.full_name.trim().length > 0);
  const hasHeadline = Boolean(profile.headline && profile.headline.trim().length > 0);
  const hasPhone = Boolean(profile.phone && profile.phone.trim().length > 0);
  const hasSkills = Boolean(profile.skills && profile.skills.length > 0);

  return Boolean(hasName && (hasHeadline || hasPhone || hasSkills));
}

export function isCompanyProfileComplete(company: Company | null | undefined): boolean {
  if (!company) return false;
  const hasName = Boolean(company.name && company.name.trim().length > 0);
  const hasEmail = Boolean(company.email && company.email.trim().length > 0);
  const hasDescription = Boolean(company.description && company.description.trim().length > 10);

  return Boolean(hasName && hasEmail && hasDescription);
}
