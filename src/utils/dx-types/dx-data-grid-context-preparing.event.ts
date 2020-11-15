import DevExpress from 'devextreme/bundles/dx.all';

export interface DxDataGridContextPreparingEvent {
  column: DevExpress.ui.dxDataGridColumn;
  columnIndex: number;
  component: DevExpress.ui.dxDataGrid;
  element: HTMLElement;
  event: Event;
  items: Array<any>;
  row: DevExpress.ui.dxDataGridRowObject;
  rowIndex: number;
  target: string;
  targetElement: HTMLElement;
}
