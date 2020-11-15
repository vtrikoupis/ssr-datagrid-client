import DevExpress from 'devextreme/bundles/dx.all';

// tslint:disable:ban-types
export interface DxDataGridDefaultOptions {
  device?: DevExpress.Device | Array<DevExpress.Device> | Function;
  options: DevExpress.ui.dxDataGridOptions;
}
