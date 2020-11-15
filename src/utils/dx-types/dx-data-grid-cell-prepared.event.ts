// tslint:disable:ban-types
import DevExpress from 'devextreme/bundles/dx.all';
import { dxDataGridRowType } from './dx-data-grid-row.type';

/**
 * @see: https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#onCellPrepared
 */
export interface DxDataGridCellPreparedEvent {
  cellElement?: DevExpress.core.dxElement;
  column?: DevExpress.ui.dxDataGridColumn;
  columnIndex?: number;
  component?: DevExpress.ui.dxDataGrid;
  data?: object;
  displayValue?: any;
  element?: DevExpress.core.dxElement;
  isExpanded?: boolean;
  isSelected?: boolean;
  key?: any;
  oldValue?: any;
  row?: DevExpress.ui.dxDataGridRowObject;
  rowType?: dxDataGridRowType;
  text?: string;
  value?: any;
  watch: Function;
}
