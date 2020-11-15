import DevExpress from 'devextreme/bundles/dx.all';

/**
 * @see https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxTabs/Events/#itemClick
 */
export interface DxTabsItemClickEvent {
  component: DevExpress.ui.dxTabs;
  element: DevExpress.core.dxElement;
  event: DevExpress.event;
  itemData: any;
  itemElement: DevExpress.core.dxElement;
  itemIndex: number;
}
