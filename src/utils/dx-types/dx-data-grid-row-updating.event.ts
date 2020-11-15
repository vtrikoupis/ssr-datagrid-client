import DevExpress from 'devextreme/bundles/dx.all';

/**
 * @see https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#onRowUpdating
 */
export interface DxDataGridRowUpdatingEvent {
  component: DevExpress.ui.dxDataGrid;
  element: DevExpress.core.dxElement;
  oldData: any;
  newData: any;
  key: any;
  cancel: boolean | Promise<void>;
}
