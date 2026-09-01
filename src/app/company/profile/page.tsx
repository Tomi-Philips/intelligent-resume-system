'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Company } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  ImageIcon,
  Loader2,
} from 'lucide-react';

const INDUSTRIES = [
  'Technology & Software',
  'Financial Services & Banking',
  'Healthcare & Life Sciences',
  'Education & E-Learning',
  'Retail & E-Commerce',
  'Manufacturing & Engineering',
  'Media, Marketing & Advertising',
  'Legal & Compliance',
  'Real Estate & Construction',
  'Energy & Utilities',
  'Transportation & Logistics',
  'Hospitality & Tourism',
  'Agriculture & Food',
  'Non-Profit & Social Services',
  'Government & Public Sector',
  'Consulting & Professional Services',
  'Telecommunications',
  'Aerospace & Defence',
  'Pharmaceuticals & Biotech',
  'Other',
];

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_LOGO_SIZE_MB = 2;

export default function CompanyProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  // Local object URL for preview before save
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompany() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login?redirect=/company/profile');
          return;
        }

        const { data: company } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (company) {
          const c = company as Company;
          setCompanyId(c.id);
          setName(c.name || '');
          setEmail(c.email || user.email || '');
          setPhone(c.phone || '');
          setWebsite(c.website || '');
          setLocation(c.location || '');
          setIndustry(c.industry || '');
          setDescription(c.description || '');
          setLogoUrl(c.logo_url || '');
        } else {
          setEmail(user.email || '');
        }
      } catch (err: unknown) {
        console.error('Error loading company:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCompany();
  }, [router, supabase]);

  // Clean up local object URL on unmount
  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoError(null);

    // Validate type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setLogoError('Please upload a PNG, JPG, WebP, GIF, or SVG image.');
      return;
    }

    // Validate size
    if (file.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
      setLogoError(`Logo must be under ${MAX_LOGO_SIZE_MB} MB.`);
      return;
    }

    // Show local preview immediately
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(URL.createObjectURL(file));

    // Upload to Supabase Storage
    setIsUploadingLogo(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      const ext = file.name.split('.').pop() ?? 'png';
      const storagePath = `${user.id}/logo_${Date.now()}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        // Bucket may not be provisioned yet — keep local preview, skip persisted URL
        console.warn('Logo upload error (bucket may not exist):', uploadError.message);
        setLogoError(
          `Storage upload failed: ${uploadError.message}. Ensure the "company-logos" bucket exists in your Supabase project.`
        );
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('company-logos')
        .getPublicUrl(uploadData.path);

      setLogoUrl(publicUrlData.publicUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed.';
      setLogoError(msg);
    } finally {
      setIsUploadingLogo(false);
      // Reset file input so re-selecting the same file fires onChange again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    setLogoPreview(null);
    setLogoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const payload: Record<string, unknown> = {
        user_id: user.id,
        name,
        email,
        phone: phone || null,
        website: website || null,
        location: location || null,
        industry: industry || null,
        description,
        logo_url: logoUrl || null,
        updated_at: new Date().toISOString(),
      };

      if (companyId) {
        payload.id = companyId;
      }

      // 1. Ensure profile record exists to satisfy foreign key (companies_user_id_fkey)
      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: user.id,
          email: user.email || email,
          role: 'company',
          full_name: name || 'Company Admin',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

      if (profileError) {
        console.error('Error ensuring profile exists:', profileError);
      }

      // 2. Upsert company record
      const { error } = await supabase
        .from('companies')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Company profile saved successfully!');
        setTimeout(() => {
          router.push('/company/dashboard');
          router.refresh();
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save company profile.';
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // The image to render: prefer persisted URL, fall back to local preview
  const displayLogo = logoUrl || logoPreview;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-xs text-zinc-500">
        Loading company details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/company/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to company dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Company Profile &amp; Branding
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Provide your organization details and branding displayed to candidates across all job vacancies.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <Card className="p-6 sm:p-8 bg-white shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Logo Upload ── */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-2">
              Company Logo
            </label>
            <div className="flex items-start gap-4">
              {/* Preview / Placeholder */}
              <div className="relative shrink-0 w-20 h-20 rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden flex items-center justify-center">
                {displayLogo ? (
                  <>
                    <Image
                      src={displayLogo}
                      alt="Company logo preview"
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-zinc-800/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      title="Remove logo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="w-8 h-8 text-zinc-300" />
                )}
                {isUploadingLogo && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload area */}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  onChange={handleLogoFileChange}
                  className="hidden"
                  id="logo-file-input"
                />
                <label
                  htmlFor="logo-file-input"
                  className={`flex flex-col items-center justify-center w-full min-h-[80px] px-4 py-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors text-center
                    ${isUploadingLogo
                      ? 'border-zinc-200 bg-zinc-50 cursor-not-allowed'
                      : 'border-zinc-200 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100'
                    }`}
                >
                  {isUploadingLogo ? (
                    <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Uploading…
                    </span>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-zinc-400 mb-1" />
                      <span className="text-xs font-medium text-zinc-600">
                        {displayLogo ? 'Replace logo' : 'Upload logo'}
                      </span>
                      <span className="text-[11px] text-zinc-400 mt-0.5">
                        PNG, JPG, WebP, SVG · max {MAX_LOGO_SIZE_MB} MB
                      </span>
                    </>
                  )}
                </label>

                {logoError && (
                  <p className="mt-1.5 text-[11px] text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {logoError}
                  </p>
                )}

                {logoUrl && !logoError && (
                  <p className="mt-1.5 text-[11px] text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    Stored in Supabase Storage
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Basic Info ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Official Company Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Innovations Ltd."
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Company Contact Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recruitment@acme.com"
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 20 7946 0000"
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://company.com"
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400 text-zinc-700"
              >
                <option value="">Select an industry…</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London, UK (or Global)"
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              About Company / Overview *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your organization, mission, team culture, and what makes working at your company special..."
              className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-100">
            <Button type="submit" isLoading={isSaving} disabled={isUploadingLogo}>
              Save Company Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
