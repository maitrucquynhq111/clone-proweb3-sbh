import { Trans, useTranslation } from 'react-i18next';
import { BsXCircle } from 'react-icons/bs';
import { Button, Modal } from 'rsuite';

type Props = {
  contactName: string;
  open: boolean;
  setOpen(value: boolean): void;
};

const DuplicateContactModal = ({ contactName, open, setOpen }: Props) => {
  const { t } = useTranslation('chat');

  return (
    <Modal
      open={open}
      keyboard={false}
      size="xs"
      className="!pw-flex !pw-absolute !-pw-translate-x-1/2 xl:-pw-translate-y-1/2 xl:pw-top-1/2 pw-left-1/2
        pw-items-center pw-justify-center xl:!pw-my-0 center-modal"
    >
      <div className="pw-w-full pw-p-1">
        <div className="pw-flex pw-justify-center pw-items-center">
          <BsXCircle className="pw-text-error-active" size={80} />
        </div>
        <div className="pw-py-6 pw-px-3 pw-text-lg pw-font-bold pw-text-neutral-title pw-text-center">
          {t('existed_phone_number')}
        </div>
        <div className="pw-text-center">
          <Trans
            t={t}
            i18nKey="existed_phone_number_desc"
            values={{
              name: contactName,
            }}
            components={{
              strong: <strong />,
            }}
          />
        </div>
        <div className="pw-flex pw-justify-end pw-items-center pw-gap-x-3 pw-mt-6">
          <Button onClick={() => setOpen(false)} className="pw-button-primary !pw-py-3 !pw-px-4">
            <span className="pw-text-base pw-font-bold pw-text-neutral-white">{t('common:understood')}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DuplicateContactModal;
