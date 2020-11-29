import { createStore, action, thunk } from 'easy-peasy';

/**
 * @typedef State
 * @type {{data: Array<Objects>}}
 */
const dataModel = {
  data: null,
  setData: action((state, payload) => {
    state.data = payload;
  })
}

const settingsModel = {
  settings: null,
  setSettings: action((state, payload) => {
    state.settings = payload;
  })
}

const parametersModel = {
  parameters: null,
  setParameters: action((state, payload) => {
    state.parameters = payload;
  })
}

const store = createStore({
  data: dataModel,
  settings: settingsModel,
  parameters: parametersModel
});

export default store