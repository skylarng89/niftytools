/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "../../packages/ui-components/src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: '#6366f1',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          purple: '#8b5cf6',
          indigo: '#4f46e5', 
          violet: '#a855f7',
        },
        // Text Colors
        text: {
          primary: '#1e293b',
          secondary: '#475569',
          muted: '#64748b',
        },
        // Neutral Colors
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Background Colors
        background: {
          page: '#f8fafc',
          card: '#ffffff',
          input: '#f1f5f9',
        },
        // Border Colors
        border: {
          DEFAULT: '#e5e7eb',
          light: '#f3f4f6',
          dark: '#d1d5db',
        }
      },
      spacing: {
        'xs': '0.25rem',    // 4px
        'sm': '0.5rem',     // 8px
        'md': '0.75rem',    // 12px
        'lg': '1rem',       // 16px
        'xl': '1.25rem',    // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '2rem',      // 32px
        '4xl': '2.5rem',    // 40px
        '5xl': '3rem',      // 48px
        '6xl': '4rem',      // 64px
      },
      maxWidth: {
        'container': '1200px',
      },
      gap: {
        'grid': '1.5rem', // 24px
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px', 
        'lg': '16px',
      },
      fontWeight: {
        'light': '300',
        'normal': '400', 
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      }
    },
  },
  plugins: [],
}