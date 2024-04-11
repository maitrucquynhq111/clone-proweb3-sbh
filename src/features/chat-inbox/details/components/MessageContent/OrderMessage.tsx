import { useTranslation } from 'react-i18next';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';
import { ModalTypes } from '~app/modals';

type Props = {
  orderNumber: string;
  reactionTag?: React.ReactNode;
  isSender?: boolean;
};

const OrderMessage = ({ orderNumber, reactionTag, isSender }: Props) => {
  const { t } = useTranslation(['chat', 'common']);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isSender) return;
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.OrderDetails,
        id: orderNumber,
      })}`,
    });
  };

  return (
    <div className="pw-py-3 pw-px-4">
      <h4 className="pw-font-bold pw-text-sm pw-text-neutral-primary">
        {t('filter.order')} {orderNumber.toUpperCase()}
      </h4>
      {isSender ? (
        <Button block className=" pw-mt-3 pw-button-secondary-outline !pw-py-1.5 !pw-px-6" onClick={handleClick}>
          {t('common:view-detail')}
        </Button>
      ) : null}
      {reactionTag && <div className="pw-mt-1">{reactionTag}</div>}
    </div>
  );
};

export default OrderMessage;
