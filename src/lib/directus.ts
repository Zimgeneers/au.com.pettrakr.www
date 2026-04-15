const DIRECTUS_URL = import.meta.env.PUBLIC_DIRECTUS_URL ?? 'https://admin.pettrakr.io';

async function fetchDirectus<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${DIRECTUS_URL}${path}`);
    if (!res.ok) {
      console.warn(`Directus fetch failed: ${path} (${res.status}) — using fallback`);
      return fallback;
    }
    const json = await res.json();
    return json.data as T;
  } catch (e) {
    console.warn(`Directus fetch error: ${path} — using fallback`);
    return fallback;
  }
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
  url: string | null;
  sort: number;
  parent: number | null;
  openInNewTab: boolean | null;
  page: { slug: string } | null;
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
  subheading: string | null;
  body: string;
  ctaText: string;
  ctaUrl: string;
  image: string | null;
  imagePosition: 'left' | 'right' | null;
  background: 'white' | 'gray' | 'dark' | 'black' | 'pettrakr' | null;
  backgroundImage: string | null;
  parallax: boolean | null;
  columns: 2 | 3 | 4 | null;
  items: SectionItem[];
}

export interface SectionItem {
  id: number;
  type: 'card' | 'quote' | 'feature' | 'logo' | 'faq' | 'pricing';
  heading: string | null;
  body: string | null;
  image: string | null;
  quote: string | null;
  author: string | null;
  link: string | null;
  price: number | null;
  deposit: number | null;
  reservationFee: number | null;
  sort: number;
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

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'PetTrakr',
  tagline: '',
  contactEmail: 'hello@pettrakr.com.au',
  phone: '',
  address: '',
  abn: '',
  facebook: '',
  linkedin: '',
  logo: null,
  favicon: null,
};

export function fileUrl(id: string | null): string | null {
  if (!id) return null;
  return `${DIRECTUS_URL}/assets/${id}`;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return fetchDirectus<SiteSettings>('/items/site_settings/1?fields=*', DEFAULT_SITE_SETTINGS);
}

export async function getNavigation(): Promise<NavItem[]> {
  return fetchDirectus<NavItem[]>('/items/navigation?sort=sort&fields=*,page.slug', []);
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const params = new URLSearchParams({ 'filter[slug][_eq]': slug, 'fields': '*', 'limit': '1' });
  const pages = await fetchDirectus<Page[]>(`/items/pages?${params}`, []);
  return pages[0] ?? null;
}

export async function getSectionsByPage(pageId: number): Promise<Section[]> {
  const fields = 'id,type,sort,heading,subheading,body,ctaText,ctaUrl,image,imagePosition,background,backgroundImage,parallax,columns,items.id,items.type,items.sort,items.heading,items.body,items.image,items.quote,items.author,items.link,items.price,items.deposit,items.reservationFee';
  const params = new URLSearchParams({ 'filter[page][_eq]': String(pageId), 'sort': 'sort', 'fields': fields });
  return fetchDirectus<Section[]>(`/items/sections?${params}`, []);
}

export async function getApprovedAirlines(): Promise<Airline[]> {
  const params = new URLSearchParams({ 'filter[status][_eq]': 'approved', 'sort': 'name', 'fields': '*' });
  return fetchDirectus<Airline[]>(`/items/airlines?${params}`, []);
}
