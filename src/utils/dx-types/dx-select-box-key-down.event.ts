import DevExpress from 'devextreme/bundles/dx.all';

export interface DxSelectBoxKeyDownEvent {
  component: DevExpress.ui.dxSelectBox;
  element: DevExpress.core.dxElement;
  event: KeyboardEvent;
}
