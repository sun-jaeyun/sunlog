import defaultTheme from 'tailwindcss/defaultTheme';
import animate from 'tailwindcss-animate';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  safelist: ['ml-2', 'ml-4', 'ml-6', 'ml-8'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Pretendard', defaultTheme.fontFamily.sans],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [
    animate,
    plugin(({ addComponents }) => {
      addComponents({
        '.post': {
          '& *': {
            'line-height': '2rem',
          },
          '& h2': {
            'margin-top': '4rem',
            'margin-bottom': '2rem',
            'margin-left': '-1rem',
            'font-size': '1.5rem',
            'line-height': '2rem',
            'font-weight': 700,
          },
          '& h3': {
            'margin-top': '3rem',
            'margin-bottom': '1rem',
            'margin-left': '-0.5rem',
            'font-size': '1.25rem',
            'line-height': '1.75rem',
            'font-weight': 700,
          },
          '& h4': {
            'margin-top': '2.5rem',
            'margin-bottom': '1rem',
            'font-weight': 700,
          },
          '& a': {
            color: 'hsl(var(--accent-foreground))',
            'text-decoration-line': 'underline',
          },
          '& a:visited': {
            color: 'hsl(var(--destructive))',
          },
          '& abbr': {
            'text-underline-offset': '2px',
          },
          '& image': {
            padding: '1rem',
          },
          '& ol': {
            'list-style-type': 'decimal',
            'margin-top': '1rem',
            'margin-bottom': '1rem',
          },
          '& ul': {
            'list-style-type': 'disc',
            'margin-top': '1rem',
            'margin-bottom': '1rem',
          },
          '& ul.contains-task-list': {
            'list-style-type': 'none',
            'line-height': '1.5rem',
          },
          '& hr': {
            'margin-top': '2rem',
            'margin-bottom': '2rem',
          },
          '& pre': {
            'padding-top': '0.5rem',
            'padding-bottom': '0.5rem',
            'padding-left': '1rem',
            'padding-right': '1rem',
            'margin-top': '0.5rem',
            'margin-bottom': '0.5rem',
            'border-radius': 'calc(var(--radius) - 4px)',
          },
          '& pre > code': {
            all: 'unset',
          },
          '& code': {
            padding: '0.25rem',
            'border-radius': 'calc(var(--radius) - 4px)',
            'background-color': 'hsl(var(--muted))',
          },
          '& blockquote': {
            'margin-top': '1rem',
            'margin-bottom': '1rem',
            'border-left-width': '4px',
          },
          '& blockquote > p': {
            'padding-left': '0.5rem',
          },
          '& img': {
            'margin-top': '0.5rem',
            'margin-bottom': '0.5rem',
          },
        },
      });
    }),
  ],
};
