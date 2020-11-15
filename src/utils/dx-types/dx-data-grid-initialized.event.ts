import DevExpress from 'devextreme/bundles/dx.all';

export interface DxDataGridInitializedEvent {
  component: DevExpress.ui.dxDataGrid;
  element: DevExpress.core.dxElement;
}
