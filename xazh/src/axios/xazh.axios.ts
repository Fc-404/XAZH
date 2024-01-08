import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";

export const xazhAxios:AxiosInstance = axios.create()

export function setXazhAxios(options: CreateAxiosDefaults<any>) {
  Object.assign(xazhAxios.defaults, options)
}