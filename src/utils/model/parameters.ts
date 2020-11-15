import { Action, action } from "easy-peasy";

export interface ParametersModel {
  parameters: [];
  setParameters: Action<ParametersModel, []>;
}

const parametersModel: ParametersModel = {
  parameters: [],
  setParameters: action((state, payload) => {
    state.parameters = payload;
  }),
}

export default parametersModel;

