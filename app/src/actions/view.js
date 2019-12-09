export const VIEW_SET = 'VIEW_SET'
export const VIEW_SET_DRAWER_OPEN = 'VIEW_SET_DRAWER_OPEN'
export const VIEW_GO_BACK = 'VIEW_GO_BACK'
export const VIEW_SET_VIEW_DATA = 'VIEW_SET_VIEW_DATA'
export const VIEW_CHILD_SET = 'VIEW_CHILD_SET'

export const setView = (name, id) => ({
  type: VIEW_SET,
  name,
  id
})

export const setDrawerOpen = drawerOpen => ({
  type: VIEW_SET_DRAWER_OPEN,
  drawerOpen
})

export const setViewData = (view, setting, value) => ({
  type: VIEW_SET_VIEW_DATA,
  view,
  setting,
  value
})

export const goBack = () => ({
  type: VIEW_GO_BACK
})