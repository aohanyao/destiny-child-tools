import {fromJS} from "immutable"

export const DATA_SET = 'DATA_SET'
export const DATA_SET_CLIENT_DATA = 'DATA_SET_CLIENT_DATA'

export const setData = (key, data) => ({
  type: DATA_SET,
  key,
  data
})

export const setClientData = (key, client, data) => ({
  type: DATA_SET_CLIENT_DATA,
  key,
  client,
  data
})