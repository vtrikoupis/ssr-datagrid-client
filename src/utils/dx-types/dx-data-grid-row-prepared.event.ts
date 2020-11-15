import DevExpress from 'devextreme/bundles/dx.all';
import { dxDataGridRowType } from './dx-data-grid-row.type';

/**
 * @see https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Events/#rowPrepared
 */
export interface DxDataGridRowPreparedEvent {
  columns: DevExpress.ui.dxDataGridColumn[];
  component: DevExpress.ui.dxDataGrid;
  data: any;
  element: DevExpress.core.dxElement;
  groupIndex: number;
  isExpanded: boolean;
  isSelected: boolean;
  key: any;
  rowElement: DevExpress.core.dxElement;
  rowIndex: number;
  rowType: dxDataGridRowType;
  values: any[];
}
