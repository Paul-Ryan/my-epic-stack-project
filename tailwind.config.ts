import { type Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
import radixPlugin from 'tailwindcss-radix'
import { marketingPreset } from './app/routes/_marketing+/tailwind-preset'
import { extendedTheme } from './app/utils/extended-theme.ts'
const colors = require('tailwindcss/colors')

export default {
	content: ['./app/**/*.{ts,tsx,jsx,js}'],
	darkMode: 'class',
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			black: colors.slate[900],
			white: colors.white,
			gray: {
				DEFAULT: colors.gray[800],
				light: colors.gray[300],
				dark: colors.gray[900],
			},
			emerald: colors.emerald,
			indigo: colors.indigo,
			yellow: colors.yellow,
		},
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		fontSize: {
			sm: '0.8rem',
			base: '1rem',
			lg: '1.25rem',
			xl: '1.563rem',
			'2xl': '1.953rem',
			'3xl': '2.441rem',
			'4xl': '3.052rem',
			'5xl': '3.815rem',
		  },
		extend: extendedTheme,
	},
	presets: [marketingPreset],
	plugins: [animatePlugin, radixPlugin],
} satisfies Config
