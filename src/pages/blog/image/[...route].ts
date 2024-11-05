import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import pretendard400 from '@fontsource/pretendard/files/pretendard-latin-400-normal.woff2';
import pretendard700 from '@fontsource/pretendard/files/pretendard-latin-700-normal.woff2';

const posts = await getCollection('blog');

const pages = Object.fromEntries(posts.map(({ id, data }) => [id, data]));

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
    bgGradient: [
      [255, 144, 0],
      [255, 255, 144],
    ],
    // border: {
    //   color: [255, 255, 255],
    //   width: 50,
    //   side: 'inline-end'
    // },
    font: {
      title: { weight: 'Bold', families: ['Pretendard'] },
      description: { families: ['Pretendard'] },
    },
    fonts: [
      // 'https://api.fontsource.org/v1/fonts/pretendard/latin-400-normal.ttf',
      `.${pretendard400}`,
      `.${pretendard700}`,
    ],
  }),
});
