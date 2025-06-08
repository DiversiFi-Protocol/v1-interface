/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

function oklchify(colorHexVar) {
  return `oklch(from var(${colorHexVar}) l c h / <alpha-value>)`;
}

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    fontFamily: {
      mono: ['JetBrains Mono', 'monospace'],
      roboto: ['Roboto', 'sans-serif'],
    },
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
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
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      animation: {
        'loading-dots': 'loading-dots 1s infinite alternate',
      },
      keyframes: {
        'loading-dots': {
          '0%': { width: '60px', aspectRatio: '4' },
          '100%': { width: '25px', aspectRatio: '1' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, addComponents }) {
      addUtilities({});
      addComponents({
        '.row': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        },
        '.column': {
          display: 'grid',
          gridAutoFlow: 'row',
          gridTemplateColumns: 'minmax(0, 1fr)',
        },
        '.inlineRow': {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5ch',
          minWidth: 'max-content',
        },
        '.spacedRow': {
          display: 'grid',
          gridAutoFlow: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        '.flexColumn': {
          display: 'flex',
          flexDirection: 'column',
          minWidth: '0',
        },
        '.stack': {
          display: 'grid',
          gridTemplateAreas: `'stack'`,
          '> *, &:before, &:after': {
            gridArea: 'stack',
          },
        },
        '.flexCenter': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        '.widgetDefault': {
          height: '100%',
          width: '100%',
          padding: '0.5rem',
          overflow: 'scroll',
        },
        '.outlineAuto': {
          outline: 'auto',
        },
      });
    }),
    require('tailwindcss-animate'),
  ],
};
