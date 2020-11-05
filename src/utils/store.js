import { createStore, action, thunk } from 'easy-peasy';

const columnModel = {
  columns: [{}],
  setColumns: action((state, payload) => {
    console.log("setting columns")
    state.columns = payload
  }),
  setAllColumns: action((state, payload) => {
    state.columns = payload
  }),
  receiveColumns: thunk(async (actions, payload) => {
    await actions.receiveAllColumns()
  }),
  receiveAllColumns: thunk(async (actions, payload, { getState }) => {
    console.log('inside receiveCols')
    const { columns } = getState()

    await actions.setAllColumns(columns)
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