export const CHILD_VIEW_SET = 'CHILD_VIEW_SET'

export const setChildView = (key, value) => ({
  type: CHILD_VIEW_SET,
  key,
  value
})