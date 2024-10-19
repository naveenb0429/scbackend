/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#025015",
        softprimary: "#00801F",
        secondary: "#B7755D",
        darksecondary: "#80553E",
        navbarPrimary: "#174E26",
        navbarTextColor: "#FEFEFE",
        navbarHover: 'rgba(255, 255, 255, 0.1)',
        loginButtonHover: '#4CAF50',
      },
      dropShadow: {
        'navbar': '0 1px 2px rgba(36, 44, 38, 0.6)',
      },
      backgroundImage: {
        credBg: 'url(/src/assets/tree_bg.png)'
      },
      content: {
        'dropdown-arrow': '"▾"',
      },
      fontFamily: {
        'poppins': ["Poppins"],
        'lora': ["Lora"],
        'inter': ["Inter"],
        'merriweather': ["Merriweather"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.dropdown-arrow': {
          '&::after': {
            content: 'var(--tw-content)',
            marginLeft: '3px',
            fontSize: '1.2rem',
            transition: 'transform 0.5s ease',
            display: 'inline-flex',
            alignItems: 'center',
          },
          '&:hover::after': {
            transform: 'rotate(180deg)',
          },
        },
      }
      addUtilities(newUtilities, ['hover'])
    },
  ],
};