const DIRECTUS_URL = import.meta.env.PUBLIC_DIRECTUS_URL ?? 'https://admin.pettrakr.io';

async function fetchDirectus<T>(path: string): Promise<T> {
  const res = await fetch(`${DIRECTUS_URL}${path}`);
  if (!res.ok) throw new Error(`Directus fetch failed: ${path} (${res.status})`);
  const json = await res.json();
  return json.data as T;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  phone: string;
  address: string;
  abn: string;
  facebook: string;
  linkedin: string;
  logo: string | null;
  favicon: string | null;
}

export interface NavItem {
  id: number;
  label: string;
  url: string;
  sort: number;
  parent: number | null;
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  heroHeading: string;
  heroSubheading: string;
  heroCtaText: string;
  heroCtaUrl: string;
  heroImage: string | null;
  seoTitle: string;
  seoDescription: string;
  seoImage: string | null;
}

export interface Section {
  id: number;
  type: string;
  sort: number;
  heading: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  image: string | null;
  imagePosition: string;
}

export interface Airline {
  id: number;
  name: string;
  iataCode: string;
  logo: string | null;
  website: string;
  status: string;
}

export function fileUrl(id: string | null): string | null {
  if (!id) return null;
  return `${DIRECTUS_URL}/assets/${id}`;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return fetchDirectus<SiteSettings>('/items/site_settings/1?fields=siteName,tagline,contactEmail,phone,address,abn,facebook,linkedin,logo,favicon');
}

export async function getNavigation(): Promise<NavItem[]> {
  return fetchDirectus<NavItem[]>('/items/navigation?sort=sort&fields=id,label,url,sort,parent');
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const pages = await fetchDirectus<Page[]>(`/items/pages?filter[slug][_eq]=${slug}&fields=id,slug,title,heroHeading,heroSubheading,heroCtaText,heroCtaUrl,heroImage,seoTitle,seoDescription,seoImage&limit=1`);
  if (!pages.length) throw new Error(`Page not found: ${slug}`);
  return pages[0];
}

export async function getSectionsByPage(pageId: number): Promise<Section[]> {
  return fetchDirectus<Section[]>(`/items/sections?filter[page][_eq]=${pageId}&sort=sort&fields=id,type,sort,heading,body,ctaText,ctaUrl,image,imagePosition`);
}

export async function getApprovedAirlines(): Promise<Airline[]> {
  return fetchDirectus<Airline[]>('/items/airlines?filter[status][_eq]=approved&sort=name&fields=id,name,iataCode,logo,website,status');
}
