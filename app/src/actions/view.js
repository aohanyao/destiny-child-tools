export const VIEW_SET = 'VIEW_SET'
export const VIEW_GO_BACK = 'VIEW_GO_BACK'
export const VIEW_CHILDS_SET_PAGE = 'VIEW_CHILDS_SET_PAGE'

export const setView = (name, id) => ({
  type: VIEW_SET,
  name,
  id
})

export const setViewChildsPage = page => ({
  type: VIEW_CHILDS_SET_PAGE,
  page
})

export const goBack = () => ({
  type: VIEW_GO_BACK
})