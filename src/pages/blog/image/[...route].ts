import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const hexToRgbArray = (hex: string) => {
  // HEX 문자열 검증 정규 표현식
  const isValidHex = /^#([0-9A-Fa-f]{6})$/;

  // HEX 문자열이 유효하지 않은 경우 null 반환
  if (!isValidHex.test(hex)) {
    console.error('올바른 HEX 형식이 아닙니다.');
    return null;
  }

  // HEX 값에서 '#'을 제거
  hex = hex.replace(/^#/, '');

  // 각각의 색상 코드(R, G, B)를 파싱
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // 배열로 반환
  return [r, g, b];
};

// 포스트 목록
const posts = await getCollection('blog');

// 카테고리 정보로 배경색 지정
const createEntry = async ({ id, data }: CollectionEntry<'blog'>) => {
  const category = await getEntry(data.category);
  const bgTopColor = (category?.data.bgTopColor && hexToRgbArray(category.data.bgTopColor)) || [
    255, 144, 0,
  ];
  const bgBottomColor = (category?.data.bgBottomColor &&
    hexToRgbArray(category.data.bgBottomColor)) || [255, 255, 144];

  return [id, { ...data, bgTopColor, bgBottomColor }];
};

// pages 생성
const entries = await Promise.all(posts.map(createEntry));
const pages = Object.fromEntries(entries);

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (path, page) => ({
    // logo: {
    //   path: './public/sun-profile.png',
    //   size: [120, 120],
    // },
    title: page.title,
    description: page.description,
    bgGradient: [page.bgTopColor, page.bgBottomColor],
    font: {
      title: { weight: 'Bold', families: ['Pretendard'] },
      description: { families: ['Pretendard'] },
    },
    fonts: [
      'https://api.fontsource.org/v1/fonts/pretendard/latin-400-normal.ttf',
      'https://api.fontsource.org/v1/fonts/pretendard/latin-700-normal.ttf',
    ],
  }),
});
