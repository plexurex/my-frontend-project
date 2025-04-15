import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#059669",
        accent: "#8B5CF6",
        background: "#F9FAFB",
        surface: "#FFFFFF",
        text: "#1F2937",
        subdued: "#6B7280",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        ui: ['Inter', 'sans-serif'],
        heading: ['Merriweather', 'serif'],
      },
      fontSize: {
        h1: '48px',
        h2: '36px',
        h3: '30px',
        h4: '24px',
        h5: '20px',
        body: '16px',
        small: '14px',
        extra: '12px',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
        24: '96px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(0, 0, 0, 0.05)',
        medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        pronounced: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        small: '4px',
        medium: '8px',
        large: '16px',
        circular: '50%',
      },
    },
  },
  plugins: [],
};

export default config;
