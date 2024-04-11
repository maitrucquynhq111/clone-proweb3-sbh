export type SideBarMenuToggleProps = {
  open?: boolean;
  data: SideBarMenuItemProps;
  onClick?: () => void;
  setOpen?: (open: boolean) => void;
  expanded?: boolean;
};

export type SideBarMenuProps = {
  open?: boolean;
  setOpen: (open: boolean) => void;
};

export type SideBarHeaderProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type SideBarMenuItemProps = {
  title: string;
  icon: JSX.Element;
  path: string;
  defaultOpen?: boolean;
  childs?: SideBarMenuItemProps[];
};
