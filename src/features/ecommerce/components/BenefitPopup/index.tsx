import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { Button, IconButton, Modal } from 'rsuite';
import { MdClose } from 'react-icons/md';
import { IconLazada, IconShopeeWhite, IconTiktokNoName } from '~app/components/Icons';
import { PlatformKey } from '~app/features/ecommerce/index';

type Props = {
  open: boolean;
  setPlatform(value: string): void;
  onClose(): void;
};

const ECOMMERCE_BANNER =
  'https://d3hr4eej8cfgwy.cloudfront.net/finan-prd/20962f85-88f9-49d9-938b-964e83ba11c3/image/09a75a18-5384-4166-9000-6b0bacf2ffea.png';

const DESCRIPTIONS = ['des_1', 'des_2', 'des_3', 'des_4', 'des_5'];

const BenefitsPopup = ({ open, setPlatform, onClose }: Props) => {
  const { t } = useTranslation('ecommerce');

  return (
    <Modal
      open={open}
      keyboard={true}
      className="!pw-flex !pw-absolute !-pw-translate-x-1/2 !-pw-translate-y-1/2 pw-top-1/2 pw-left-1/2
        pw-items-center pw-justify-center !pw-my-0 center-modal"
      backdropClassName="!pw-z-[1050]"
      size="md"
    >
      <Modal.Header closeButton={false} className="pw-relative !pw-pr-0 !-pw-m-5 !pw-mb-0">
        <img src={ECOMMERCE_BANNER} alt="Header image" className="pw-rounded-tl-md pw-rounded-tr-md" />
        <IconButton
          size="md"
          className="!pw-absolute pw-top-2 pw-right-2 !pw-bg-transparent !pw-p-2"
          icon={<MdClose size={24} className="!pw-text-white" />}
          onClick={onClose}
        />
      </Modal.Header>
      <Modal.Body className="pw-p-6 !pw-mt-0">
        <h6 className="pw-mb-6 pw-text-lg">{t('modal.title')}</h6>
        <div className="pw-text-base">
          {DESCRIPTIONS.map((description, index) => (
            <div
              key={description}
              className={cx('pw-flex pw-items-center pw-mb-3', {
                '!pw-mb-0': index + 1 === DESCRIPTIONS.length,
              })}
            >
              <div className="pw-bg-primary-main pw-text-white pw-font-semibold pw-text-sm pw-rounded-full pw-flex pw-items-center pw-justify-center pw-w-5 pw-h-5">
                {index + 1}
              </div>
              <span className="pw-ml-2 pw-text-neutral-secondary">{t(`modal.${description}`)}</span>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="pw-flex pw-justify-around">
        <Button
          appearance="primary"
          className="!pw-font-bold !pw-text-base pw-w-full !pw-py-3 !pw-bg-shopee"
          endIcon={<IconShopeeWhite />}
          onClick={() => setPlatform(PlatformKey.SHOPEE)}
        >
          {t('action.connect_shopee')}
        </Button>
        <Button
          appearance="primary"
          className="!pw-font-bold !pw-text-base pw-w-full !pw-py-3 !pw-bg-lazada"
          endIcon={<IconLazada />}
          onClick={() => setPlatform(PlatformKey.LAZADA)}
        >
          {t('action.connect_lazada')}
        </Button>
        <Button
          appearance="primary"
          className="!pw-font-bold !pw-text-base pw-w-full !pw-py-3 !pw-bg-black"
          endIcon={<IconTiktokNoName />}
          onClick={() => setPlatform(PlatformKey.TIKTOK)}
        >
          {t('action.connect_tiktok')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BenefitsPopup;
