import { Provide } from "@midwayjs/core";
import WEBPanel from '../model/webPanel.model'
import AdminPanel from '../model/adminPanel.model'

export type PANEL_TYPE = 'web' | 'admin';
type ReturnDocumentTYPE = 'after' | 'before'

@Provide()
export class PanelService {
  /**
   * Get confinguration.
   * @param name confingation's name
   * @param group group that the name belongs to
   * @returns 
   */
  async getConfig(who: PANEL_TYPE, name: string, group?: string) {
    const filter = { name: name, }
    group ? filter['group'] = group : null
    let result
    switch (who) {
      case 'web':
        result = await WEBPanel.model.findOne(filter)
        break
      case 'admin':
        result = await AdminPanel.model.findOne(filter)
        break
    }
    return result ?? null
  }

  /**
   * Set value of the name.
   * @param name 
   * @param value value that the name will be change
   * @param group 
   * @returns 
   */
  async setConfig(who: PANEL_TYPE, name: string, value: any, group?: string) {
    const filter = { name: name }
    group ? filter['group'] = group : null
    const modification = {
      $set: {
        value: value,
        updatetime: Date.now()
      }
    }
    const options = {
      upsert: true,
      returnDocument: 'after' as ReturnDocumentTYPE
    }

    let result
    switch (who) {
      case 'web':
        result = await WEBPanel.model.findOneAndUpdate(filter, modification, options)
        break
      case 'admin':
        result = await AdminPanel.model.findOneAndUpdate(filter, modification, options)
        break
    }
    // console.log(result);
    return result ? true : false
  }

  /**
   * Delete a configuration.
   * @param who 
   * @param name 
   * @param group 
   * @returns 
   */
  async deleteConfig(who: PANEL_TYPE, name: string, group?: string) {
    const filter = { name: name }
    group ? filter['group'] = group : null
    let result
    switch (who) {
      case 'web':
        result = await WEBPanel.model.deleteOne(filter)
        break
      case 'admin':
        result = await AdminPanel.model.deleteOne(filter)
        break
    }
    return result ? true : false
  }

  /**
   * Get all configuration
   * @param who 
   * @returns 
   */
  async getAllConfig(who: PANEL_TYPE) {
    let result
    switch (who) {
      case 'web':
        result = await WEBPanel.model.find()
        break
      case 'admin':
        result = await AdminPanel.model.find()
        break
    }
    return result ? result : false
  }
}