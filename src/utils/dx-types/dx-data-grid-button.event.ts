import DevExpress from 'devextreme/bundles/dx.all';

export interface DxDataGridButtonEvent {
  column: DevExpress.ui.dxDataGridColumn;
  component: DevExpress.ui.dxDataGrid;
  element: DevExpress.core.dxElement;
  event: DevExpress.dxEvent;
  row: DevExpress.ui.dxDataGridRowObject;
}
