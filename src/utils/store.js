import { createStore, action, thunk } from 'easy-peasy';
import { padEnd } from 'lodash';


const columnModel = {
  initialColumns: null,
  setInitialColumns: action((state, payload) => {
    state.initialColumns = payload
  }),
};

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

const store = createStore({
  columns: columnModel,
  data: dataModel,
  settings: settingsModel
});

export default store