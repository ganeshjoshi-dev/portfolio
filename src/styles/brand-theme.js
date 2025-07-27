// Brand theme configuration based on ComingSoon page design
const brandTheme = {
  colors: {
    brand: {
      primary: '#06b6d4', // cyan-400 - our main brand color
      hover: 'rgba(6, 182, 212, 0.2)', // cyan-400 with 20% opacity
    },
    accent: {
      success: '#10b981', // emerald-500
      error: '#ef4444', // red-500
      warning: '#f59e0b', // amber-500
    },
    bg: {
      primary: {
        from: '#111827', // gray-900
        via: '#000000', // black
        to: '#1F2937',  // gray-800
      },
      overlay: {
        light: 'rgba(31, 41, 55, 0.5)',  // gray-800 50%
        dark: 'rgba(17, 24, 39, 0.8)',    // gray-900 80%
      }
    },
    text: {
      primary: '#ffffff',      // white
      secondary: '#9CA3AF',    // gray-400
      muted: '#6B7280',       // gray-500
      accent: '#06b6d4',      // cyan-400
    },
    border: {
      primary: 'rgba(75, 85, 99, 0.5)',    // gray-700 50%
      hover: 'rgba(6, 182, 212, 0.5)',     // cyan-400 50%
    }
  },

  // Common component styles from ComingSoon page
  components: {
    // Main container style
    container: {
      base: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
    },

    // Button/Link style
    button: {
      base: 'px-6 py-3 bg-gray-800/80 hover:bg-cyan-400/20 border border-gray-700 hover:border-cyan-400/50 rounded-lg text-white hover:text-cyan-400 transition-all duration-300 hover:scale-105 flex items-center space-x-2',
    },

    // Card style (like countdown timer cards)
    card: {
      base: 'bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105',
    },

    // Gradient backgrounds
    gradients: {
      main: 'bg-gradient-to-br from-gray-900 via-black to-gray-800',
      overlay: 'bg-gradient-to-b from-transparent to-gray-900/50',
    },

    // Text styles
    text: {
      hero: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold',
      title: 'text-xl sm:text-2xl font-bold',
      body: 'text-base sm:text-lg md:text-xl',
      small: 'text-sm sm:text-base',
    },

    // Navigation styles
    nav: {
      link: 'text-gray-300 hover:text-cyan-400 hover:scale-105 transition-all duration-300',
      linkUnderline: 'absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300',
    },

    // Logo styles
    logo: {
      base: 'text-xl sm:text-2xl font-bold',
      brand: 'text-cyan-400',
    },
  },

  // Common spacing
  spacing: {
    section: 'py-8',
    stack: 'space-y-4',
    gap: 'gap-4 sm:gap-6',
  },

  // Common transitions
  transitions: {
    base: 'transition-all duration-300',
    transform: 'hover:scale-105',
  }
};

export default brandTheme;
