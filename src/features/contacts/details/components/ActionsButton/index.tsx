import { BsDashCircle, BsPencilFill, BsPlus, BsPlusCircle } from 'react-icons/bs';
import cx from 'classnames';
import { MdExpandMore } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonGroup, Button, Whisper, Popover, Dropdown, IconButton } from 'rsuite';
import { MainRouteKeys } from '~app/routes/enums';
import { useContactDetails } from '~app/features/contacts/hooks/useContactDetails';
import CustomerPointModal from '~app/features/contacts/details/components/CustomerPoint/CustomerPointModal';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { DebtType } from '~app/utils/constants';
import { CustomerPermission, OrderPermission, OtherPermision, useHasPermissions } from '~app/utils/shield';

enum ACTIONS {
  CREATE_ORDER = 'create_order',
  CREATE_DEBT_GAVE = 'create_debt_gave',
  CREATE_DEBT_PAID = 'create_debt_paid',
  UPDATE_POINT = 'update_point',
}

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize | undefined;
  placement?: ModalPlacement | undefined;
  transaction_type?: DebtType;
} | null;

const BUTTONS = [
  {
    title: 'action.create_order',
    action: ACTIONS.CREATE_ORDER,
    icon: <BsPlus size={28} className="pw-text-primary-main" />,
  },
  {
    title: 'action.create_debt_gave',
    action: ACTIONS.CREATE_DEBT_GAVE,
    icon: <BsDashCircle size={28} className="pw-text-secondary-main" />,
  },
  {
    title: 'action.create_debt_paid',
    action: ACTIONS.CREATE_DEBT_PAID,
    icon: <BsPlusCircle size={28} className="pw-text-primary-main" />,
  },
  {
    title: 'action.update_point',
    action: ACTIONS.UPDATE_POINT,
    icon: <BsPencilFill size={28} className="pw-text-primary-main" />,
  },
];

const ActionsButton = () => {
  const { t } = useTranslation('contact-details');
  const [open, setOpen] = useState('');
  const [modalData, setModalData] = useState<ModalData>(null);
  const { data } = useContactDetails();
  const {
    setting: { bussiness },
  } = useOfflineContext();
  const canCreateOrder = useHasPermissions([OrderPermission.ORDER_CART_CREATE]);
  const canEditPoint = useHasPermissions([CustomerPermission.CUSTOMER_LOYALTY_UPDATE]);
  const canCreateDebt = useHasPermissions([OtherPermision.DEBT_LIST_ALL_VIEW]);

  const filterAction = (btn: ExpectedAny) => {
    if (!canCreateOrder && btn.action === ACTIONS.CREATE_ORDER) return false;
    if ((!bussiness?.is_customer_point || !canEditPoint) && btn.action === ACTIONS.UPDATE_POINT) return false;
    if (!canCreateDebt && (btn.action === ACTIONS.CREATE_DEBT_GAVE || btn.action === ACTIONS.CREATE_DEBT_PAID))
      return false;
    return true;
  };

  const actions = BUTTONS.filter(filterAction);

  return (
    <>
      {actions.length > 0 ? (
        <Whisper
          placement="bottomEnd"
          trigger="click"
          speaker={({ onClose, left, top, className }, ref) => {
            const navigate = useNavigate();
            const handleSelect = () => {
              onClose();
            };
            const handleClick = (action: ACTIONS) => {
              if (!data) return;
              switch (action) {
                case ACTIONS.CREATE_ORDER:
                  navigate(MainRouteKeys.Pos, { state: { contactId: data.id } });
                  break;
                case ACTIONS.UPDATE_POINT:
                  setOpen('update_point');
                  break;
                case ACTIONS.CREATE_DEBT_GAVE:
                  setModalData({
                    modal: ModalTypes.DebtCreate,
                    size: ModalSize.Xsmall,
                    placement: ModalPlacement.Right,
                    transaction_type: DebtType.IN,
                  });
                  break;
                case ACTIONS.CREATE_DEBT_PAID:
                  setModalData({
                    modal: ModalTypes.DebtCreate,
                    size: ModalSize.Xsmall,
                    placement: ModalPlacement.Right,
                    transaction_type: DebtType.OUT,
                  });
                  break;
                default:
                  break;
              }
            };
            return (
              <Popover ref={ref} className={className} style={{ left, top }} full>
                <Dropdown.Menu className="!pw-py-0" onSelect={handleSelect}>
                  {actions.map((button, index) => {
                    return (
                      <Dropdown.Item
                        key={button.action}
                        className={cx(
                          '!pw-flex pw-items-center pw-gap-2 !pw-py-3.5 pw-border-b pw-border-b-neutral-divider',
                          {
                            'pw-border-none': index + 1 === BUTTONS.length,
                          },
                        )}
                        onClick={() => {
                          handleSelect();
                          handleClick(button.action);
                        }}
                      >
                        {button.icon}
                        <span>{t(button.title)}</span>
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Popover>
            );
          }}
        >
          <ButtonGroup className="!pw-absolute pw-top-3 pw-right-6">
            <Button appearance="primary" size="lg">
              <span className="pw-font-bold">{t('action.create_transaction')}</span>
            </Button>
            <IconButton color="green" size="lg" appearance="primary" icon={<MdExpandMore size="22" />} />
          </ButtonGroup>
        </Whisper>
      ) : null}
      {open === 'update_point' && data && <CustomerPointModal detail={data} onClose={() => setOpen('')} />}
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </>
  );
};

export default ActionsButton;
