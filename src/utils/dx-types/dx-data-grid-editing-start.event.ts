import DevExpress from 'devextreme/bundles/dx.all';

/**
 * @see https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#onEditingStart
 */
export interface DxDataGridEditingStartEvent {
  component: DevExpress.ui.dxDataGrid;
  column: DevExpress.ui.dxDataGridColumn;
  element: DevExpress.core.dxElement;
  data: any;
  key: any;
  cancel?: boolean;
}
