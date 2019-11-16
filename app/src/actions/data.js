export const DATA_SET_CHILDS = 'DATA_SET_CHILDS'
export const DATA_SET_MODS = 'DATA_SET_MODS'

export const setChilds = (childs) => ({
  type: DATA_SET_CHILDS,
  childs
})

export const setMods = (mods) => ({
  type: DATA_SET_MODS,
  mods
})