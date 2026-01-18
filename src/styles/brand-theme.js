// Brand theme configuration aligned with portfolio design system
const brandTheme = {
  colors: {
    brand: {
      primary: '#00D9FF',
      hover: 'rgba(0, 217, 255, 0.2)',
    },
    accent: {
      secondary: '#3B82F6',
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
    },
    bg: {
      primary: {
        from: '#0a0e27',
        via: '#1a1f3a',
        to: '#252d47',
      },
      surface: '#1a1f3a',
      surfaceHover: '#252d47',
      overlay: {
        light: 'rgba(26, 31, 58, 0.6)',
        dark: 'rgba(10, 14, 39, 0.8)',
      },
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0aec0',
      muted: '#718096',
      accent: '#00D9FF',
    },
    border: {
      primary: '#2d3748',
      hover: 'rgba(0, 217, 255, 0.5)',
    },
  },

  // Common component styles from ComingSoon page
  components: {
    // Main container style
    container: {
      base: 'max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    },

    // Button/Link style
    button: {
      base: 'inline-flex items-center justify-center font-semibold rounded-lg cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
      // Variants
      primary: 'bg-cyan-400 text-slate-900 hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(0,217,255,0.3)]',
      secondary: 'border border-cyan-400/60 text-cyan-200 hover:bg-cyan-400/10 hover:text-white hover:border-cyan-400',
      ghost: 'bg-slate-900/70 hover:bg-cyan-400/15 border border-slate-700/70 hover:border-cyan-400/60 text-white hover:text-cyan-300',
      // Sizes
      sizes: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      },
    },

    // Form input styles
    input: {
      base: 'w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700/50 text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50',
      error: 'border-red-500/70 focus:border-red-500 focus:ring-red-500/50',
      label: 'block text-sm font-medium text-gray-300 mb-1',
      errorText: 'text-sm text-red-400 mt-1',
      helperText: 'text-sm text-gray-500 mt-1',
    },

    // Select styles
    select: {
      base: 'w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700/50 text-white transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 appearance-none cursor-pointer',
      error: 'border-red-500/70 focus:border-red-500 focus:ring-red-500/50',
    },

    // Textarea styles
    textarea: {
      base: 'w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700/50 text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 resize-none',
      error: 'border-red-500/70 focus:border-red-500 focus:ring-red-500/50',
    },

    // Card style (like countdown timer cards)
    card: {
      base: 'bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/60 p-6 hover:border-cyan-400/50 transition-all duration-300 hover:translate-y-[-4px]',
    },

    // Gradient backgrounds
    gradients: {
      main: 'bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#252d47]',
      overlay: 'bg-gradient-to-b from-transparent to-[#0a0e27]/60',
      accent: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    },

    // Text styles
    text: {
      hero: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold',
      title: 'text-2xl sm:text-3xl font-bold',
      body: 'text-base sm:text-lg md:text-xl',
      small: 'text-sm sm:text-base',
    },

    // Navigation styles
    nav: {
      link: 'text-gray-300 hover:text-cyan-300 hover:scale-105 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-md',
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
    section: 'py-12 sm:py-16 lg:py-20',
    stack: 'space-y-6',
    gap: 'gap-4 sm:gap-6 lg:gap-8',
  },

  // Common transitions
  transitions: {
    base: 'transition-all duration-300',
    transform: 'hover:scale-105',
  },
};

export default brandTheme;
