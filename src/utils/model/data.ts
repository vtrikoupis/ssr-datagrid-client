
import { Action, action } from "easy-peasy";


export interface DataModel {
  gridData: [];
  setGridData: Action<DataModel, []>;
  valueToTrack: [],
  setValueToTrack: Action<DataModel, []>
  
}

const dataModel: DataModel = {
  gridData: [],
  setGridData: action((state, payload) => {
    state.gridData = payload;
  }),
  valueToTrack: [],
  setValueToTrack: action((state, payload) => {
    state.valueToTrack = payload;
  })
}


export default dataModel;