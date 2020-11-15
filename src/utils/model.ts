import dataModel, {DataModel} from './model/data'
import settingsModel, {SettingsModel} from './model/settings'
import parametersModel, {ParametersModel} from './model/parameters'


export interface StoreModel {
  dataModel: DataModel;
  settingsModel: SettingsModel;
  parametersModel: ParametersModel
};

const model: StoreModel = {
  dataModel,
  settingsModel,
  parametersModel
};

export default model;