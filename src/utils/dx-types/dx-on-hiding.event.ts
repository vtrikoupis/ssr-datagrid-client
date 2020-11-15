import DevExpress from 'devextreme/bundles/dx.all';

/*
 * @see devextreme/bundles/dx.all
 *
 * dxOverlayOptions<T = dxOverlay>.onHiding()
 */
export interface DxOnHidingEvent {
  component?: DevExpress.ui.dxPopup;
  element?: DevExpress.core.dxElement;
  cancel?: boolean;
}
