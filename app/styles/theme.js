import {Dimensions, StyleSheet} from 'react-native';
import {windowHeight} from '../utils/Dimensions';

export const COLORS = {
  // base colors
  primary: '#EAB88B',
  secondary: '#FAE9D9',
  tertiary: '#4C3D3C',
  accent: '#E96244',
  background: '#FDFAF6',
  secondaryBackground: '#F8F5EC',
  borderColor: '#BC6A54',
  tagTextColor: '#CB6A4F',
  shadeGreen: '#C8EBDE',
  shadePurple: '#D3E0F4',
  shadeGreenText: '#295C5F',
  shadePurple: '#D3E0F4',
  shadePurpleText: '#221E63',
  disabled: '#D3D3D3',

  // colors
  black: '#000000',
  white: '#FFFFFF',
  whiteFA: '#FAFAFA',
  whiteFB2: '#FFFFFFB2',
  lightGray: '#F5F5F6',
  lightGray1: '#E5E5E6',
  inputGrayBackground: '#F3F3F3',
  inactive: '#B8B8B8',
  darkgray: '#898C95',
  transparent: 'transparent',
  subtitle: '#AAAAAA',
  link: '#2F206E',
  text: '#332726',
  description: '#ACABAA',
  error: '#DA4241',
  blackOpaque: 'rgba(0,0,0,0.6)',
  mapMarker: '#B8462D',
  serviceBackground: '#F6BF9E',
  otherServiceBackground: '#E3E5E8',
  cardBackground: '#FFF5EF',
  darkGreen: '#142B35',
  darkGreen1: '#1A4652',
  subTextColor: '#F2F2F2',
  subTextColor1: '#7D7E82',
  subTextColor2: '#B1B2B4',
  iconSearchColor: '#D8D8D9',
  inputBorderColor: '#9FA5AA',
  darkYellow: '#F8D51D',
  success: '#19802C',
  green: '#07A367',
  limeGreen: '#22AA3A',
  green175: '#175659',
  overlay: 'rgba(255,255,255,0.5)',
  gradientColor: [
    'rgba(255, 163, 142, 0)',
    'rgba(165, 105, 92,0.1)',
    'rgba(203, 106, 79, 0.8)',
  ],
  gradientColorBlack: [
    'rgba(0, 0, 0, 0)',
    'rgba(60, 60, 60, 0.1)',
    'rgba(60, 60, 60, 0.8)',
  ],
  gradientColorOrange: ['rgba(233, 98, 68, 1)', 'rgba(226, 139, 24, 1)'],

  otherTextColor: '#D3D5D8',

  //prompt colors

  grayText: '#B9B9B9',
  grayF9: '#F9F9F9',
  grayF7: '#F7F7F7',
  grayEC: '#ECEEEE',
  grayEC80: '#ECEEEECC',
  red: '#C13F3F',
  red1: '#C3280B',
  red2: '#E86C55',
  yellow: '#F5C114',
  yellowFF9: '#FF9F1C',
  gold: '#E28B18',
  orange: '#FF5411',
  lightOrange: '#FFEBE5',
  brown332: '#332A1E',

  slider: {
    red: '#C13F3F',
    orange: '#E57C40',
    yellow: '#F5C114',
    yellow_green: '#9acd32',
    green: '#07A367',
  },
  //progress bar color
  progressColor: '#F3F3F3',
};

export const SPACING = {
  default: windowHeight * 0.025,
  x_small: windowHeight * 0.0075, //5
  small: windowHeight * 0.015, //10
  medium: windowHeight * 0.0225, //15
  large: windowHeight * 0.03, //20
  x_large: windowHeight * 0.045, //30
  xx_large: windowHeight * 0.075, //50
  xxx_large: windowHeight * 0.105, //70
  xxxx_large: windowHeight * 0.2, //100
};

export const BORDER = {
  roundedImage: 40,
  roundedCornerBox: 8,
  roundedCornerItem: 20,
  roundedCornerSearch: 20,
  roundedCornerCard: 4,
  roundedCornerInput: 12,
  roundedCornerPopupCard: 12,
  roundedCornerTextArea: 12,
  roundedFooterCorderCard: 18,
  circle: 50,
  roundedCornerButton: 50,
};

export const SIZES = {
  _8px: windowHeight * 0.0125,
  _10px: windowHeight * 0.015,
  _12px: windowHeight * 0.0175,
  _14px: windowHeight * 0.02,
  _16px: windowHeight * 0.0225,
  _18px: windowHeight * 0.025,
  _20px: windowHeight * 0.0275,
  _22px: windowHeight * 0.03,
  _24px: windowHeight * 0.0325,
  _26px: windowHeight * 0.035,
  _28px: windowHeight * 0.0375,
  _30px: windowHeight * 0.04,
  _32px: windowHeight * 0.0425,
  _34px: windowHeight * 0.045,

  regular: windowHeight * 0.019, //13 = 40 px
  x_small: windowHeight * 0.016, //11 = 32 px
  small: windowHeight * 0.022, //15
  medium: windowHeight * 0.025, //17
  large: windowHeight * 0.0275, //19

  iconSize: {
    x_small: windowHeight * 0.022, //15,
    small: windowHeight * 0.025, //20
    medium: windowHeight * 0.033, //25
    xl: windowHeight * 0.06, //25
  },
};

export const FONTS = {
  textlink: {
    fontFamily: 'HKGrotesk-Regular',
    fontSize: SIZES._14px,
    color: COLORS.link,
  },
  textlinkUnderline: {
    fontFamily: 'HKGrotesk-Regular',
    fontSize: SIZES._14px,
    color: COLORS.link,
    textDecorationLine: 'underline',
  },
  regular: {
    fontFamily: 'HKGrotesk-Regular',
    fontSize: SIZES._14px,
    color: COLORS.black,
  },
  medium: {
    fontFamily: 'HKGrotesk-Medium',
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  semiBold: {
    fontFamily: 'HKGrotesk-SemiBold',
    fontSize: SIZES._14px,
    color: COLORS.black,
  },
  bold: {
    fontFamily: 'HKGrotesk-Bold',
    fontSize: SIZES._14px,
    color: COLORS.black,
  },
  italic: {
    fontFamily: 'HKGrotesk-Italic',
    fontSize: SIZES._14px,
    color: COLORS.black,
  },
  body: {
    fontFamily: 'HKGrotesk-Regular',
    // fontSize: SIZES.body,
    lineHeight: 20,
  },
  pageTitle: {
    fontFamily: 'HKGrotesk-Bold',
    fontSize: 15,
  },

  h1: {fontFamily: 'HKGrotesk-Bold', fontSize: 30, lineHeight: 36},
  h2: {fontFamily: 'HKGrotesk-Bold', fontSize: 22, lineHeight: 30},
  h3: {fontFamily: 'HKGrotesk-Bold', fontSize: 20, lineHeight: 22},
  h4: {fontFamily: 'HKGrotesk-Bold', fontSize: 18, lineHeight: 22},
};

export const GlobalStyle = StyleSheet.create({
  sectionDivider: {
    padding: SPACING.small,
  },
  sectionTitle: {
    ...FONTS.bold,
    color: COLORS.tertiary,
    marginBottom: SPACING.small,
  },
  sectionLabel: {
    ...FONTS.bold,
    fontSize: SIZES._14px,
    color: COLORS.darkGreen,
  },
  sectionSubLabel: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
  },
  tagText: {
    ...FONTS.regular,
    color: COLORS.tertiary,
    fontSize: windowHeight * 0.011,
  },
  errorText: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.error,
  },
});

const theme = {SPACING, BORDER, COLORS, SIZES, FONTS, GlobalStyle};

export default theme;
