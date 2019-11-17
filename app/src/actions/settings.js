export const SETTINGS_SET_SETTING = 'SETTINGS_SET_SETTING'

export const setSetting = (key, value) => ({
  type: SETTINGS_SET_SETTING,
  value
})
