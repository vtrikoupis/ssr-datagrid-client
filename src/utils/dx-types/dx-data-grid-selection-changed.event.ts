import DevExpress from 'devextreme/bundles/dx.all';

export interface DxDataGridSelectionChangedEvent {
  component: DevExpress.ui.dxDataGrid;
  currentDeselectedRowKeys: Array<any>;
  currentSelectedRowKeys: Array<any>;
  element: DevExpress.core.dxElement;
  selectedRowKeys: Array<any>;
  selectedRowsData: Array<object>;
}
