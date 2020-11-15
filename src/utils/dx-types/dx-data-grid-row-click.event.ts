import DevExpress from 'devextreme/bundles/dx.all';
import { dxDataGridRowType } from './dx-data-grid-row.type';

/**
 * @see https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Events/#rowClick
 */
export interface DxDataGridRowClickEvent {
  columns: DevExpress.ui.dxDataGridColumn[];
  component: DevExpress.ui.dxDataGrid;
  data: any;
  element: DevExpress.core.dxElement;
  event: DevExpress.event;
  groupIndex: number;
  handled: boolean;
  isExpanded: boolean;
  isSelected: boolean;
  key: any;
  rowElement: DevExpress.core.dxElement;
  rowIndex: number;
  rowType: dxDataGridRowType;
  values: any[];
}
