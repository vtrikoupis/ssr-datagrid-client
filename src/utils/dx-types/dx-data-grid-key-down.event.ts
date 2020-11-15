import DevExpress from 'devextreme/bundles/dx.all';

export interface DxDataGridKeyDownEvent {
  component: DevExpress.ui.dxDataGrid;
  element: DevExpress.core.dxElement;
  event: KeyboardEvent;
  handled: boolean;
}
