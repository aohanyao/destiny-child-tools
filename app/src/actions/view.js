export const VIEW_SET = 'VIEW_SET'
export const VIEW_GO_BACK = 'VIEW_GO_BACK'

export const setView = (name, id) => ({
  type: VIEW_SET,
  name,
  id
})

export const goBack = () => ({
  type: VIEW_GO_BACK
})