import DevExpress from 'devextreme/bundles/dx.all';

/**
 * @see https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#onInitNewRow
 */
export interface DxDataGridInitRowEvent {
  component: DevExpress.ui.dxDataGrid;
  element: DevExpress.core.dxElement;
  data: any;
}
