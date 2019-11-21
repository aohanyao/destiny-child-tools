export const VIEW_SET = 'VIEW_SET'
export const VIEW_GO_BACK = 'VIEW_GO_BACK'
export const VIEW_CHILDS_SET = 'VIEW_CHILDS_SET'
export const VIEW_CHILD_SET = 'VIEW_CHILD_SET'

export const setView = (name, id) => ({
  type: VIEW_SET,
  name,
  id
})

export const setViewChilds = (setting, value) => ({
  type: VIEW_CHILDS_SET,
  setting,
  value
})

export const goBack = () => ({
  type: VIEW_GO_BACK
})