import { NativeModules, Platform } from 'react-native'

import { format, parseISO } from 'date-fns'
import { pt } from 'date-fns/locale'

export function formatDateISO (dt, fmt = 'PP pp') {
  const lng =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale
      : NativeModules.I18nManager.localeIdentifier
  return format(parseISO(dt), fmt, {
    locale: pt
  })
}
