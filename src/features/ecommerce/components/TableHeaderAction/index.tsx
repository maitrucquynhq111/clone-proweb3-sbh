import { MdExpandMore } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ButtonGroup, Button, Whisper, Popover, Dropdown, IconButton } from 'rsuite';
import { HeaderButton, MultipleUploadModal } from '~app/components';
import { MASS_UPLOAD_PRODUCT_FILE } from '~app/configs';
import { PRODUCTS_KEY, useGetMassUploadFailedDetailsQuery, useGetMassUploadFileQuery } from '~app/services/queries';
import { useUploadProductsFileMutation } from '~app/services/mutations';
import { IconLazada, IconShopeeWhite, IconTiktokNoName } from '~app/components/Icons';
import { PlatformKey } from '~app/features/ecommerce/index';

type Props = {
  setPlatform(value: string): void;
};

const TableHeaderAction = ({ setPlatform }: Props) => {
  const { t } = useTranslation('header-button');
  const [open, setOpen] = useState<boolean>(false);

  return (
    <HeaderButton>
      <Whisper
        placement="bottomEnd"
        trigger="click"
        speaker={({ onClose, left, top, className }, ref) => {
          return (
            <Popover ref={ref} className={className} style={{ left, top }} full>
              <Dropdown.Menu onSelect={() => onClose()}>
                <Dropdown.Item
                  onClick={() => {
                    onClose();
                    setPlatform(PlatformKey.SHOPEE);
                  }}
                  className="!pw-flex pw-items-center pw-gap-2"
                >
                  <IconShopeeWhite />
                  <span>{t('ecommerce.shopee')}</span>
                </Dropdown.Item>
                <Dropdown.Item divider />
                <Dropdown.Item
                  onClick={() => {
                    onClose();
                    setPlatform(PlatformKey.LAZADA);
                  }}
                  className="!pw-flex pw-items-center pw-gap-2"
                >
                  <IconLazada />
                  <span>{t('ecommerce.lazada')}</span>
                </Dropdown.Item>
                <Dropdown.Item divider />
                <Dropdown.Item
                  onClick={() => {
                    onClose();
                    setPlatform(PlatformKey.TIKTOK);
                  }}
                  className="!pw-flex pw-items-center pw-gap-2"
                >
                  <IconTiktokNoName />
                  <span>{t('ecommerce.tiktok_shop')}</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Popover>
          );
        }}
      >
        <ButtonGroup>
          <Button appearance="primary" size="lg">
            <span className="pw-font-bold">{t('ecommerce.add')}</span>
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
    </HeaderButton>
  );
};

export default TableHeaderAction;
