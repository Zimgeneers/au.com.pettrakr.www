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
  background: 'white' | 'light' | 'dark' | null;
  backgroundImage: string | null;
  parallax: boolean | null;
}

export interface Airline {
  id: number;
  name: string;
  iataCode: string;
  logo: string | null;
  website: string;
  approvalUrl: string | null;
  status: string;
}

export function fileUrl(id: string | null): string | null {
  if (!id) return null;
  return `${DIRECTUS_URL}/assets/${id}`;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return fetchDirectus<SiteSettings>('/items/site_settings/1?fields=*');
}

export async function getNavigation(): Promise<NavItem[]> {
  return fetchDirectus<NavItem[]>('/items/navigation?sort=sort&fields=*');
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const params = new URLSearchParams({ 'filter[slug][_eq]': slug, 'fields': '*', 'limit': '1' });
  const pages = await fetchDirectus<Page[]>(`/items/pages?${params}`);
  if (!pages.length) throw new Error(`Page not found: ${slug}`);
  return pages[0];
}

export async function getSectionsByPage(pageId: number): Promise<Section[]> {
  const params = new URLSearchParams({ 'filter[page][_eq]': String(pageId), 'sort': 'sort', 'fields': '*' });
  return fetchDirectus<Section[]>(`/items/sections?${params}`);
}

export async function getApprovedAirlines(): Promise<Airline[]> {
  const params = new URLSearchParams({ 'filter[status][_eq]': 'approved', 'sort': 'name', 'fields': '*' });
  return fetchDirectus<Airline[]>(`/items/airlines?${params}`);
}
