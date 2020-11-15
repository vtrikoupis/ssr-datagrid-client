import DevExpress from 'devextreme/bundles/dx.all';

export interface DxDataGridContentReadyEvent {
  component: DevExpress.ui.dxDataGrid;
  element: DevExpress.core.dxElement;
}
