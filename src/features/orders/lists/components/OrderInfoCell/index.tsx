import { BsGlobe2 } from 'react-icons/bs';
import { Divider } from 'rsuite';
import { DesktopCircle } from '~app/components/Icons';
import { OrderCreateMethod } from '~app/utils/constants';
import { DeliveryMethodType } from '~app/features/pos/utils';

type Props = {
  rowData: Order;
};

const OrderInfoCell = ({ rowData }: Props) => {
  const renderIcon = (createMethod: string) => {
    switch (createMethod) {
      case OrderCreateMethod.SELLER:
        return <DesktopCircle />;

      default:
        return <BsGlobe2 size={20} />;
    }
  };

  return (
    <div className="pw-w-full pw-px-2">
      {rowData.delivery_method === DeliveryMethodType.TABLE ? (
        <div>
          <div className="pw-text-sm pw-font-semibold pw-mb-1">
            {rowData.reservation_meta?.table_name} - {rowData.reservation_meta?.sector_name}
          </div>
          <div className="pw-flex pw-items-center">
            <div className="pw-text-2sm pw-max-w-[50%] line-clamp-1">{rowData.buyer_info.name}</div>
            <Divider vertical className="!pw-mx-2" />
            <div className="pw-text-[#3370CC]">{renderIcon(rowData.create_method)}</div>
            <div className="pw-ml-1 pw-text-neutral-secondary pw-text-2sm">{rowData.order_number}</div>
          </div>
        </div>
      ) : (
        <>
          <div className="pw-font-semibold pw-text-sm pw-mb-1">{rowData.buyer_info.name}</div>
          <div className="pw-flex pw-items-center">
            <div className="pw-text-[#3370CC]">{renderIcon(rowData.create_method)}</div>
            <div className="pw-ml-1 pw-text-neutral-secondary pw-text-2sm">{rowData.order_number}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderInfoCell;
