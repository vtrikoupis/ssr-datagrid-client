import DevExpress from 'devextreme/bundles/dx.all';

export interface DxTreeViewItemContextEvent {
  component: DevExpress.ui.dxTreeView;
  element: DevExpress.core.dxElement;
  event: DevExpress.event;
  itemData: object;
  itemElement: DevExpress.core.dxElement;
  itemIndex: number | object;
  node: DevExpress.ui.dxTreeViewNode;
}
