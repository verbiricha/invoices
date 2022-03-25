import { extendTheme } from '@chakra-ui/react'

const colors = {
  brand: {
    50: '#101300',
    100: '#273300',
    200: '#4C6600',
    300: '#709900',
    400: '#A9E000',
    500: '#CCFF00',
    600: '#E0FF33',
    700: '#E8FF52',
    800: '#EEFD86',
    900: '#F2FDAF',
  },
  gray: {
    50: '#0E0E0E',
    100: '#1A1A1A',
    200: '#333333',
    300: '#4D4D4D',
    400: '#666666',
    500: '#808080',
    600: '#999999',
    700: '#B3B3B3',
    800: '#CCCCCC',
    900: '#E5E5E5',
  },
  green: {
    50: '#041206',
    100: '#072C0C',
    200: '#0E5816',
    300: '#148522',
    400: '#23BE36',
    500: '#2AD544',
    600: '#4EE469',
    700: '#66EB7F',
    800: '#92F1A4',
    900: '#B8F4C4',
    950: '#E5FAE8',
  },
  red: {
    50: '#160809',
    100: '#320C0B',
    200: '#561110',
    300: '#841915',
    400: '#D01811',
    500: '#FF3529',
    600: '#FF6053',
    700: '#FF847A',
    800: '#FFAAA3',
    900: '#FFCECC',
    950: '#FFEBEC',
  },
  orange: {
    50: '#1D0C02',
    100: '#311902',
    200: '#633403',
    300: '#944F05',
    400: '#DA7A06',
    500: '#FF9B00',
    600: '#FFBB33',
    700: '#FFC852',
    800: '#FFD685',
    900: '#FFDDAD',
  },
}

const styles = {
  global: {
    body: {
      bg: 'black',
      color: 'white',
    },
  },
}

const fonts = {
  heading: 'Montserrat, sans-serif',
  body: 'Montserrat, sans-serif',
  monospace: 'Fira Code, monospace',
}

const components = {
  Modal: {
    baseStyle: (props: any) => {
      return { dialog: { background: 'black' } }
    },
  },
  Button: {
    baseStyle: {
      _focus: { boxShadow: 'none' }
    }
  },
}

const overrides = { colors, styles, fonts, components }

export const theme = extendTheme(overrides)
