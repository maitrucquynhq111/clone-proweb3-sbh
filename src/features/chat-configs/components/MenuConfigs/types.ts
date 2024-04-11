export type MenuBlockType = {
  title: string;
  childs: MenuItemType[];
  permissions: string | string[];
};
export type MenuItemType = {
  title: string;
  path: string;
  icon: React.ReactNode;
  permissions: string | string[];
};
