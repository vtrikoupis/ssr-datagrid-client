import DevExpress from 'devextreme/bundles/dx.all';

export interface DxContextMenuItemClickEvent {
  component: DevExpress.ui.dxContextMenu;
  element: DevExpress.core.dxElement;
  event: DevExpress.event;
  itemData: any;
  itemElement: DevExpress.core.dxElement;
  itemIndex: number;
}
