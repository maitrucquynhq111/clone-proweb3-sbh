import { OverlayTriggerType } from 'rsuite/esm/Overlay/OverlayTrigger';

export type RenderMenuProps = {
  className?: string;
  onSelect: () => void;
  data: MenuItemProps[];
  handleOpenModal: (data: MenuItemProps) => void;
};

export type MenuItemProps = {
  title: string | React.ReactNode;
  action: () => void;
  showConfirm?: boolean;
  className?: string;
  icon?: React.ReactNode;
  modalTitle?: string;
  modalContent?: string;
  acceptText?: string;
  cancelText?: string;
};

export type ActionMenuProps = {
  trigger?: OverlayTriggerType | OverlayTriggerType[];
  data: MenuItemProps[];
  toggleRender?: React.ReactNode;
};

export type ModalRefObject = {
  handleClose: () => void;
  handleOpen: (data: MenuItemProps) => void;
};
