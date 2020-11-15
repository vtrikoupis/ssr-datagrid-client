import DevExpress from 'devextreme/bundles/dx.all';

export interface DxContextMenuHidingEvent {
  cancel: boolean;
  component: DevExpress.ui.dxContextMenu;
  element: DevExpress.core.dxElement;
}
