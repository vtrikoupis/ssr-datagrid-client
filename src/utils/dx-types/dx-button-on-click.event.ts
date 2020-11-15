import DevExpress from 'devextreme/bundles/dx.all';

export interface DxButtonOnClickEvent {
  component?: DevExpress.ui.dxButton;
  element?: DevExpress.core.dxElement;
  event?: DevExpress.dxEvent;
  validationGroup?: any;
}
