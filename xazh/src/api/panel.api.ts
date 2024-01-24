import { xazhAxios } from "../axios/xazh.axios";

export type PANEL_TYPE = 'web' | 'admin'

/**
 * Get a configuration.
 * @param type which type of panel
 * @param name confinguration's name
 * @param group configuration's group
 * @returns 
 */
export async function GetPanelConfigAPI(
  type: PANEL_TYPE, name: string, group?: string
) {
  const result = await xazhAxios.post('/Panel/Get/' + type, {
    name: name,
    group: group
  })

  return result.data.code == 0 ? result.data.body : null
}

/**
 * Set a value to a configuration.
 * @param type 
 * @param name 
 * @param value 
 * @param group 
 * @returns 
 */
export async function SetPanelConfigAPI(
  type: PANEL_TYPE, name: string, value: any, group?: string
) {
  const result = await xazhAxios.post('/Panel/Set/' + type, {
    name: name,
    value: value,
    group: group
  })

  return result.data.code == 0 ? true : false
}

/**
 * Get all configuration values.
 * @param type 
 * @returns 
 */
export async function GetAllPanelConfigAPI(type: PANEL_TYPE) {
  const result = await xazhAxios.post('/Panel/GetAll/' + type)

  return result.data.code == 0 ? result.data.data : []
}