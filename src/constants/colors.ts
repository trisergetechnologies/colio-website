export const colors = {
  // Primary Background Gradients
  background: {
    start: '#8900ae',
    end: '#5d0076',
  },
  
  // Button Gradients
  button: {
    start: '#d946ef',
    end: '#a21caf',
  },
  
  // Additional Purple/Magenta Shades
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },
  
  // Magenta/Fuchsia Accents
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef', // Main button color
    600: '#c026d3',
    700: '#a21caf', // Button end color
    800: '#86198f',
    900: '#701a75',
  },
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  
  // Grays for text and borders
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  
  // Semantic colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
} as const;

// Gradient strings for Tailwind
export const gradients = {
  background: `bg-gradient-to-br from-[${colors.background.start}] to-[${colors.background.end}]`,
  button: `bg-gradient-to-r from-[${colors.button.start}] to-[${colors.button.end}]`,
  text: `bg-gradient-to-r from-[${colors.button.start}] to-[${colors.accent[700]}]`,
} as const;

// CSS-in-JS gradient styles
export const gradientStyles = {
  background: {
    background: `linear-gradient(135deg, ${colors.background.start} 0%, ${colors.background.end} 100%)`,
  },
  button: {
    background: `linear-gradient(90deg, ${colors.button.start} 0%, ${colors.button.end} 100%)`,
  },
  textGradient: {
    background: `linear-gradient(90deg, ${colors.button.start} 0%, ${colors.accent[700]} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
} as const;

export default colors;