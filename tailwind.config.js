module.exports = {
  content: [
    '_site/**/*.html',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      display: ['"Fraunces"', 'Georgia', 'ui-serif', 'serif'],
      serif: ['"Fraunces"', 'Georgia', 'ui-serif', 'serif'],
      mono: [
        '"JetBrains Mono"',
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'monospace',
      ],
    },
    extend: {
      fontSize: {
        '2xs': '0.6875rem',
      },
      letterSpacing: {
        'wide-plus': '0.15em',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
      },
    },
  },
  plugins: [
    require('@rvxlab/tailwind-plugin-ios-full-height'),
    require('@tailwindcss/aspect-ratio'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#b34722",
          "primary-content": "#ffffff",
          "secondary": "#1a7a68",
          "secondary-content": "#ffffff",
          "accent": "#c88b2e",
          "accent-content": "#ffffff",
          "neutral": "#4a4440",
          "base-100": "#faf6f0",
          "base-200": "#f0ebe3",
          "base-300": "#ddd6cb",
          "base-content": "#2d2520",
          "info": "#3b82f6",
          "success": "#1a7a68",
          "warning": "#c88b2e",
          "error": "#b34722",
        },
        dark: {
          "primary": "#e07a52",
          "primary-content": "#1a1210",
          "secondary": "#3db8a0",
          "secondary-content": "#0d1f1b",
          "accent": "#e8b84d",
          "accent-content": "#1a1210",
          "neutral": "#6b6460",
          "base-100": "#1e1a17",
          "base-200": "#161210",
          "base-300": "#2c2723",
          "base-content": "#e8e0d6",
          "info": "#60a5fa",
          "success": "#3db8a0",
          "warning": "#e8b84d",
          "error": "#e07a52",
        },
      },
    ],
    darkTheme: "dark",
    logs: false,
  },
}
