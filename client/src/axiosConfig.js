import axios from 'axios'

export const apiBaseUrl = axios.create({ baseURL: `http://${window.location.hostname}:8800` })

export const setAxiosHeaders = (token) => {
  if (token) {
    apiBaseUrl.defaults.headers.common['Authorization'] = 'Bearer ' + token
  } else {
    apiBaseUrl.defaults.headers.common['Authorization'] = null
  }
}