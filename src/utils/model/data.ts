
import { Action, action } from "easy-peasy";


export interface DataModel {
  data: [];
  setData: Action<DataModel, []>;
  valueToTrack: [],
  setValueToTrack: Action<DataModel, []>
  
}

const dataModel: DataModel = {
  data: [],
  setData: action((state, payload) => {
    state.data = payload;
  }),
  valueToTrack: [],
  setValueToTrack: action((state, payload) => {
    state.valueToTrack = payload;
  })
}


export default dataModel;