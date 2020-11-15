import DevExpress from 'devextreme/bundles/dx.all';

/**
 * @see https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#onRowRemoving
 */
export interface DxDataGridRowRemovingEvent {
  component: DevExpress.ui.dxDataGrid;
  element: DevExpress.core.dxElement;
  data: any;
  key: any;
  cancel: boolean | Promise<void>;
}
