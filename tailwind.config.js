/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // GitHub-inspired color palette
        gh: {
          canvas: {
            default: '#ffffff',
            overlay: '#ffffff',
            inset: '#f6f8fa',
            subtle: '#f6f8fa',
          },
          fg: {
            default: '#1f2328',
            muted: '#656d76',
            subtle: '#6e7781',
            onEmphasis: '#ffffff',
          },
          border: {
            default: '#d1d9e0',
            muted: '#d8dee4',
            subtle: 'rgba(175, 184, 193, 0.2)',
          },
          neutral: {
            emphasis: '#6e7781',
            emphasisPlus: '#656d76',
            muted: 'rgba(175, 184, 193, 0.2)',
            subtle: 'rgba(175, 184, 193, 0.1)',
          },
          accent: {
            fg: '#0969da',
            emphasis: '#0969da',
            muted: 'rgba(84, 174, 255, 0.4)',
            subtle: '#ddf4ff',
          },
          success: {
            fg: '#1a7f37',
            emphasis: '#1f883d',
            muted: 'rgba(74, 194, 107, 0.4)',
            subtle: '#dafbe1',
          },
          attention: {
            fg: '#9a6700',
            emphasis: '#bf8700',
            muted: 'rgba(212, 167, 44, 0.4)',
            subtle: '#fff8c5',
          },
          severe: {
            fg: '#bc4c00',
            emphasis: '#fb8500',
            muted: 'rgba(255, 212, 181, 0.4)',
            subtle: '#fff1e5',
          },
          danger: {
            fg: '#d1242f',
            emphasis: '#cf222e',
            muted: 'rgba(255, 129, 130, 0.4)',
            subtle: '#ffebe9',
          },
        },
        // Keep existing shadcn colors for compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // GitHub-inspired radius values
        'gh-sm': '3px',
        'gh-md': '6px',
        'gh-lg': '8px',
        'gh-xl': '12px',
      },
      boxShadow: {
        // GitHub-inspired shadows
        'gh-sm': '0 1px 0 rgba(208, 215, 222, 0.2)',
        'gh-md': '0 3px 6px rgba(140, 149, 159, 0.15)',
        'gh-lg': '0 8px 24px rgba(140, 149, 159, 0.2)',
        'gh-inset': 'inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        'gh-focus': '0 0 0 3px rgba(9, 105, 218, 0.3)',
      },
      spacing: {
        // GitHub's 8px grid system
        'gh-1': '4px',
        'gh-2': '8px',
        'gh-3': '12px',
        'gh-4': '16px',
        'gh-5': '20px',
        'gh-6': '24px',
        'gh-7': '28px',
        'gh-8': '32px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}