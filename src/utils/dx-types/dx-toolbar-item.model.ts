export interface DxToolbarItemModel {
  disabled?: boolean;
  html?: string;
  location?: 'after' | 'before' | 'center';
  locateInMenu?: 'always' | 'auto' | 'never';
  options?: any;
  template?: any;
  text?: string;
  toolbar?: string;
  visible?: boolean;
  widget?: string;
}
