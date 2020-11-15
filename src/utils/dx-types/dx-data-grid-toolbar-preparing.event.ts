import DevExpress from 'devextreme/bundles/dx.all';

export interface DxDataGridToolbarPreparingEvent {
  component?: DevExpress.ui.dxDataGrid;
  element?: DevExpress.core.dxElement;
  toolbarOptions?: DevExpress.ui.dxToolbarOptions;
}
