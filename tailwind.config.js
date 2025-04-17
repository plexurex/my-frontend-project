module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette
        primary: "#1E3A8A", // Deep Blue
        secondary: "#14B8A6", // Teal
        skyblue: "#60A5FA", // Sky Blue
        
        // Accent colors
        accent: "#F97316", // Sunset Orange
        highlight: "#FACC15", // Soft Yellow
        error: "#EF4444", // Coral Red
        
        // Background & neutral tones
        background: "#F3F4F6", // Light Gray
        surface: "#FAFAFA", // Off White
        text: "#1F2937", // Charcoal
        subdued: "#6B7280", // Gray
        
        // Keep these functional colors
        success: "#10B981",
        warning: "#F59E0B",
        info: "#60A5FA",
      },
      fontFamily: {
        ui: ['Inter', 'sans-serif'],
        heading: ['Merriweather', 'serif']
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
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      borderRadius: {
        'medium': '8px',
        'large': '12px',
        'xl': '16px',
      }
    },
  },
  plugins: [],
}