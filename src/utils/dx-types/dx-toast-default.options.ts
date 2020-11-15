import DevExpress from 'devextreme/bundles/dx.all';

export interface DxToastDefaultOptions {
  device?: DevExpress.Device | Array<DevExpress.Device> | Function;
  options: DevExpress.ui.dxToastOptions;
}
