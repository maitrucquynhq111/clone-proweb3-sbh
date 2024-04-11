import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import { useState } from 'react';
import { ModalTypes, ModalPlacement, ModalSize, ModalRendererInline } from '~app/modals';
import { DebtType } from '~app/utils/constants';
import { useContactDetails } from '~app/features/contacts/hooks/useContactDetails';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize | undefined;
  placement?: ModalPlacement | undefined;
  transaction_type?: DebtType;
} | null;

const HeaderAction = () => {
  const { t } = useTranslation('header-button');
  const [modalData, setModalData] = useState<ModalData>(null);
  const { data } = useContactDetails();

  return (
    <>
      {data?.debt_amount !== 0 ? (
        <Button
          appearance="ghost"
          size="lg"
          className="pw-mr-2"
          onClick={() => {
            setModalData({
              modal: ModalTypes.DebtCreatePayment,
              size: ModalSize.Xsmall,
              placement: ModalPlacement.Right,
            });
          }}
        >
          <span className="pw-font-bold">{t('cashbook-table.debt.payment')}</span>
        </Button>
      ) : null}
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </>
  );
};

export default HeaderAction;
