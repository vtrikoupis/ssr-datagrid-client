import { Action, action } from "easy-peasy";

export interface SettingsModel {
  settings: [];
  setSettings: Action<SettingsModel, []>;
}

const settingsModel: SettingsModel = {
  settings: [],
  setSettings: action((state, payload) => {
    state.settings = payload;
  }),
}

export default settingsModel;

