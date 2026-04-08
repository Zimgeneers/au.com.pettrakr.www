import { fileUrl } from '../../lib/directus';
import type { Section } from '../../lib/directus';

export interface SectionStyle {
  bgClass: string;
  bgStyle: string;
  isDark: boolean;
  proseClass: string;
  headingClass: string;
}

export function getSectionStyle(section: Section): SectionStyle {
  const bg = section.background ?? 'white';
  const bgImgUrl = fileUrl(section.backgroundImage);
  const hasBgImg = !!bgImgUrl;
  const isDark = bg === 'black' || bg === 'dark' || bg === 'pettrakr' || hasBgImg;

  const bgClass = hasBgImg
    ? 'relative text-white'
    : bg === 'black' ? 'bg-black text-white'
    : bg === 'dark' ? 'bg-[#171D1D] text-white'
    : bg === 'pettrakr' ? 'text-white'
    : bg === 'gray' ? 'bg-gray-100 text-gray-900'
    : 'bg-white text-gray-900';

  const bgStyle = hasBgImg
    ? `background-image: url('${bgImgUrl}'); background-size: cover; background-position: center; ${section.parallax ? 'background-attachment: fixed;' : ''}`
    : bg === 'pettrakr'
    ? 'background: linear-gradient(135deg, #171D1D 0%, #2D2B55 100%);'
    : '';

  const headingClass = "text-3xl font-bold font-['Lato',sans-serif] mb-6";
  const proseClass = isDark ? 'prose prose-lg prose-invert max-w-none' : 'prose prose-lg max-w-none';

  return { bgClass, bgStyle, isDark, proseClass, headingClass };
}
