import { BsPlusLg, BsUpload } from 'react-icons/bs';
import { OverlayTriggerHandle } from 'rsuite/esm/Overlay/OverlayTrigger';
import { MdExpandMore } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useState, useRef } from 'react';
import { ButtonGroup, Button, Whisper, Popover, Dropdown, IconButton } from 'rsuite';
import { MultipleUploadModal } from '~app/components';
import { IngredientPermission, withPermissions } from '~app/utils/shield';
import { MASS_UPLOAD_INGREDIENTS_FILE } from '~app/configs';
import { INGREDIENTS_KEY, useGetMassUploadFailedDetailsQuery, useGetMassUploadFileQuery } from '~app/services/queries';
import { useUploadIngredientsFileMutation } from '~app/services/mutations';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
};

const TableHeaderAction = () => {
  const { t } = useTranslation('header-button');
  const whisperRef = useRef<OverlayTriggerHandle>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const handleClick = () => {
    setModalData({
      modal: ModalTypes.IngredientCreate,
      size: ModalSize.Small,
      placement: ModalPlacement.Right,
    });
  };

  return (
    <>
      <Whisper
        ref={whisperRef}
        placement="bottomEnd"
        trigger="hover"
        enterable
        // speaker={({ onClose, left, top, className }, ref) => {
        //   const handleSelect = () => {
        //     onClose();
        //   };
        //   const handleClick = () => {
        //     setModalData({
        //       modal: ModalTypes.IngredientCreate,
        //       size: ModalSize.Small,
        //       placement: ModalPlacement.Right,
        //     });
        //   };
        //   return (
        //     <Popover ref={ref} className={className} style={{ left, top }} full>
        //       <Dropdown.Menu onSelect={handleSelect}>
        //         <Dropdown.Item
        //           onClick={() => {
        //             handleClick();
        //             handleSelect();
        //           }}
        //           className="!pw-flex pw-items-center pw-gap-2"
        //         >
        //           <BsPlusLg />
        //           <span>{t('ingredients-table.new')}</span>
        //         </Dropdown.Item>
        //         <Dropdown.Item divider />
        //         <Dropdown.Item
        //           onClick={() => {
        //             handleSelect();
        //             setOpen(!open);
        //           }}
        //           className="!pw-flex pw-items-center pw-gap-2"
        //         >
        //           <BsUpload />
        //           <span>{t('ingredients-table.create-multi')}</span>
        //         </Dropdown.Item>
        //       </Dropdown.Menu>
        //     </Popover>
        //   );
        // }}
        speaker={
          <Popover full>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  handleClick();
                  whisperRef?.current?.close();
                }}
                className="!pw-flex pw-items-center pw-gap-2"
              >
                <BsPlusLg />
                <span>{t('ingredients-table.new')}</span>
              </Dropdown.Item>
              <Dropdown.Item divider />
              <Dropdown.Item
                onClick={() => {
                  setOpen(!open);
                  whisperRef?.current?.close();
                }}
                className="!pw-flex pw-items-center pw-gap-2"
              >
                <BsUpload />
                <span>{t('ingredients-table.create-multi')}</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Popover>
        }
      >
        <ButtonGroup
          onClick={() => {
            handleClick();
            whisperRef?.current?.close();
          }}
        >
          <Button appearance="primary" size="lg">
            <span className="pw-font-bold">{t('ingredients-table.create')}</span>
          </Button>

          <IconButton color="green" size="lg" appearance="primary" icon={<MdExpandMore size="22" />} />
        </ButtonGroup>
      </Whisper>
      {open && (
        <MultipleUploadModal
          sampleFile={MASS_UPLOAD_INGREDIENTS_FILE}
          queryKey={INGREDIENTS_KEY}
          open={open}
          historyVariables={{ upload_type: 'create_ingredient' }}
          historyQuery={useGetMassUploadFileQuery}
          mutation={useUploadIngredientsFileMutation}
          detailFailQuery={useGetMassUploadFailedDetailsQuery}
          setOpen={setOpen}
        />
      )}
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </>
  );
};

export default withPermissions(TableHeaderAction, [IngredientPermission.INGREDIENT_CREATE]);
