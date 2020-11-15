import DevExpress from 'devextreme/bundles/dx.all';

/**
 * @see https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxSelectBox/Events/#customItemCreating
 */
export interface DxSelectBoxCustomItemCreatingEvent {
  component: DevExpress.ui.dxSelectBox;
  customItem: any;
  element: DevExpress.core.dxElement;
  text: string;
}
