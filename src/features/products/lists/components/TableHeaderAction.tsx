import { useTranslation } from 'react-i18next';
import { useState, memo, useRef } from 'react';
import { ButtonGroup, Button, Whisper, Popover, Dropdown, IconButton } from 'rsuite';
import { OverlayTriggerHandle } from 'rsuite/esm/Overlay/OverlayTrigger';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { BsPlusLg, BsUpload, BsDownload } from 'react-icons/bs';
import { MdExpandMore } from 'react-icons/md';
import { useUploadProductsFileMutation } from '~app/services/mutations';
import { MASS_UPLOAD_PRODUCT_FILE } from '~app/configs';
import { PRODUCTS_KEY, useGetMassUploadFailedDetailsQuery, useGetMassUploadFileQuery } from '~app/services/queries';
import { ModalTypes } from '~app/modals/types';
import { TableColumnsControl, MultipleUploadModal } from '~app/components';
import { ButtonActionData, ExportDataType, ExportType } from '~app/components/ButtonActionData';
import { PRODUCTCOLUMNS } from '~app/features/products/utils';
import { TableColumnsKey } from '~app/utils/constants';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

const TableHeaderAction = () => {
  const { t } = useTranslation('header-button');
  const whisperRef = useRef<OverlayTriggerHandle>(null);
  const [open, setOpen] = useState<boolean>(false);
  const canCreateProduct = useHasPermissions([ProductPermission.PRODUCT_PRODUCTLIST_CREATE]);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (name: string) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: name,
      })}`,
    });
    whisperRef?.current?.close();
  };

  return (
    <div className="pw-gap-4 pw-flex">
      {canCreateProduct && (
        <Whisper
          ref={whisperRef}
          placement="bottomEnd"
          trigger="hover"
          enterable
          speaker={
            <Popover full>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
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
                    setOpen(!open);
                  }}
                  className="!pw-flex pw-items-center pw-gap-2"
                >
                  <BsUpload />
                  <span>{t('products-table.create-multi')}</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Popover>
          }
        >
          <ButtonGroup
            onClick={() => {
              handleClick(ModalTypes.ProductCreate);
            }}
          >
            <Button appearance="primary" size="lg">
              <span className="pw-font-bold">{t('products-table.create')}</span>
            </Button>
            <IconButton color="green" size="lg" appearance="primary" icon={<MdExpandMore size="22" />} />
          </ButtonGroup>
        </Whisper>
      )}
      <Whisper
        placement="bottomEnd"
        trigger="hover"
        enterable
        speaker={
          <Popover full>
            <Dropdown.Menu>
              <Dropdown.Item className="!pw-flex pw-items-center pw-gap-2">
                <ButtonActionData<{ search?: string }>
                  dataType={ExportDataType.PRODUCT}
                  type={ExportType.VIEW}
                  title={t('export-data.view-online') || ''}
                  className="!pw-bg-transparent"
                />
              </Dropdown.Item>
              <Dropdown.Item divider />
              <Dropdown.Item className="!pw-flex pw-items-center pw-gap-2">
                <ButtonActionData<{ search?: string }>
                  dataType={ExportDataType.PRODUCT}
                  type={ExportType.DOWNLOAD}
                  title={t('export-data.download-excel') || ''}
                  className="!pw-bg-transparent"
                />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Popover>
        }
      >
        <Button
          appearance="primary"
          size="lg"
          startIcon={<BsDownload size="20" />}
          endIcon={<MdExpandMore size="20" />}
        >
          <span className="pw-font-bold">{t('export-data.export-file')}</span>
        </Button>
      </Whisper>
      <TableColumnsControl tableKey={TableColumnsKey.PRODUCT_LIST} defaultColumns={PRODUCTCOLUMNS} />
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

export default memo(TableHeaderAction);
