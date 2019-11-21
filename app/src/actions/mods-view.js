export const MODS_VIEW_SET = 'MODS_VIEW_SET'

export const setModsView = (key, value) => ({
  type: MODS_VIEW_SET,
  key,
  value
})