import DevExpress from 'devextreme/bundles/dx.all';

export interface DxTreeViewItemRenderedEvent {
  component: DevExpress.ui.dxTreeView;
  element: DevExpress.core.dxElement;
  itemData: any;
  itemElement: DevExpress.core.dxElement;
  itemIndex: number;
  node: DevExpress.ui.dxTreeViewNode;
}
