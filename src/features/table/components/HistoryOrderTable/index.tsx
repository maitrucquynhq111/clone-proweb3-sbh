import { Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import HistoryItem from './HistoryItem';
import { DrawerBody, DrawerFooter, DrawerHeader } from '~app/components';

type Props = {
  kitchenTickets: KitchenTicket;
  orderNumber: string;
  onSuccess?(): void;
  onClose(): void;
};

const HistoryOrderTable = ({ onClose, kitchenTickets, orderNumber }: Props) => {
  const { t } = useTranslation('pos');

  const handleClose = () => {
    onClose();
  };

  const getOrderHistoryName = () => {
    if (kitchenTickets.sector_name || kitchenTickets.table_name)
      return `${kitchenTickets.sector_name} - ${kitchenTickets.table_name}`;
    return orderNumber;
  };

  return (
    <>
      <DrawerHeader title={`${t('modal-title:history-order')} ${getOrderHistoryName()}`} onClose={handleClose} />
      <DrawerBody className="pw-bg-white !pw-p-0">
        {kitchenTickets.kitchen_ticket.map((ticket: KitchenTicketItem) => {
          return <HistoryItem ticket={ticket} />;
        })}
      </DrawerBody>
      <DrawerFooter>
        <Button onClick={handleClose} className="pw-button-secondary !pw-py-3 !pw-px-6">
          <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{t('common:close')}</span>
        </Button>
      </DrawerFooter>
    </>
  );
};

export default HistoryOrderTable;
