import {fromJS} from "immutable"

export const DATA_SET = 'DATA_SET'


export const setData = (key, data) => ({
  type: DATA_SET,
  key,
  data: typeof data.toJS == 'function' ? data : fromJS(data)
})