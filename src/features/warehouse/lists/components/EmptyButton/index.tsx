import { BsPlusLg, BsUpload } from 'react-icons/bs';
import { MdExpandMore } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { ButtonGroup, Button, Whisper, Popover, Dropdown, IconButton } from 'rsuite';
import { ModalTypes } from '~app/modals/types';
import { MultipleUploadModal } from '~app/components';
import { withPermissions, ProductPermission } from '~app/utils/shield';
import { MASS_UPLOAD_PRODUCT_FILE } from '~app/configs';
import { PRODUCTS_KEY, useGetMassUploadFailedDetailsQuery, useGetMassUploadFileQuery } from '~app/services/queries';
import { useUploadProductsFileMutation } from '~app/services/mutations';

const EmptyButton = () => {
  const { t } = useTranslation('header-button');
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <Whisper
        placement="bottomEnd"
        trigger="click"
        speaker={({ onClose, left, top, className }, ref) => {
          const location = useLocation();
          const navigate = useNavigate();
          const handleSelect = () => {
            onClose();
          };
          const handleClick = (name: string) => {
            navigate({
              pathname: location.pathname,
              search: `?${createSearchParams({
                modal: name,
              })}`,
            });
          };
          return (
            <Popover ref={ref} className={className} style={{ left, top }} full>
              <Dropdown.Menu onSelect={handleSelect}>
                <Dropdown.Item
                  onClick={() => {
                    handleSelect();
                    handleClick(ModalTypes.ProductCreate);
                  }}
                  className="!pw-flex pw-items-center pw-gap-2"
                >
                  <BsPlusLg />
                  <span>{t('products-table.create')}</span>
                </Dropdown.Item>
                <Dropdown.Item divider />

                <Dropdown.Item
                  onClick={() => {
                    handleSelect();
                    setOpen(!open);
                  }}
                  className="!pw-flex pw-items-center pw-gap-2"
                >
                  <BsUpload />
                  <span>{t('products-table.create-multi')}</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Popover>
          );
        }}
      >
        <ButtonGroup>
          <Button appearance="primary" size="lg">
            <span className="pw-font-bold">{t('products-table.create')}</span>
          </Button>

          <IconButton color="green" size="lg" appearance="primary" icon={<MdExpandMore size="22" />} />
        </ButtonGroup>
      </Whisper>
      {open && (
        <MultipleUploadModal
          sampleFile={MASS_UPLOAD_PRODUCT_FILE}
          queryKey={PRODUCTS_KEY}
          open={open}
          historyVariables={{ upload_type: 'create_product' }}
          historyQuery={useGetMassUploadFileQuery}
          mutation={useUploadProductsFileMutation}
          detailFailQuery={useGetMassUploadFailedDetailsQuery}
          setOpen={setOpen}
        />
      )}
    </div>
  );
};

export default withPermissions(EmptyButton, [ProductPermission.PRODUCT_PRODUCTLIST_CREATE]);
