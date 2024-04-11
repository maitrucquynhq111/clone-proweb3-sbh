import { useRef, useCallback, forwardRef, RefObject } from 'react';
import { Popover, Whisper, Dropdown, IconButton } from 'rsuite';
import { MdMoreVert } from 'react-icons/md';
import { OverlayTriggerHandle } from 'rsuite/esm/Overlay/OverlayTrigger';
import { RenderMenuProps, MenuItemProps, ActionMenuProps, ModalRefObject } from './types';
import Item from './Item';
import ModalConfirm from './ModalConfirm';

const MenuPopover = forwardRef(
  (
    { onSelect, className, data, handleOpenModal, ...rest }: RenderMenuProps,
    ref: ((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null | undefined,
  ) => {
    return (
      <Popover {...rest} ref={ref} className={className} full>
        <Dropdown.Menu onSelect={onSelect}>
          {data.map((item, index) => {
            return <Item key={index} onSelect={onSelect} data={item} openModal={handleOpenModal} />;
          })}
        </Dropdown.Menu>
      </Popover>
    );
  },
);

const ActionMenu = ({ trigger = 'click', data = [], toggleRender }: ActionMenuProps) => {
  const confirmModalRef = useRef<ModalRefObject>(null);
  const whisperRef = useRef<OverlayTriggerHandle>(null);

  const handleOpenModal = useCallback((data: MenuItemProps) => {
    confirmModalRef.current?.handleOpen(data);
  }, []);

  const handleSelectMenu = () => {
    whisperRef?.current?.close();
  };

  return (
    (data.length > 0 && (
      <>
        <Whisper
          ref={whisperRef}
          placement="autoHorizontalEnd"
          trigger={trigger}
          speaker={<MenuPopover data={data} handleOpenModal={handleOpenModal} onSelect={handleSelectMenu} />}
        >
          {toggleRender ? (
            <div>{toggleRender}</div>
          ) : (
            <IconButton size="xs" appearance="subtle" icon={<MdMoreVert size={18} />} />
          )}
        </Whisper>
        <ModalConfirm ref={confirmModalRef} />
      </>
    )) || <></>
  );
};

export default ActionMenu;
