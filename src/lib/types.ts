export interface Theme {
  background?: string,
  text?: string,
  invertedText?: string
}

export interface LoginConfig {
  social?: any,
  show?: boolean,
  initialized?: boolean,
  loggedInId?: any,
  appName?: string,
  theme?: Theme,
  logo?: string,
  error?: string,
  info?: string,
  tos?: string,
  privacyPolicy?: string,
  isSubmitting?: boolean
}
