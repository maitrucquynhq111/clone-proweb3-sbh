import cx from 'classnames';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsXLg } from 'react-icons/bs';
import { usePosStore } from '~app/features/pos/hooks';
import { WholesalePriceToggle } from '~app/features/pos/components';
import { ProductSelection, ProductSelectionRef } from '~app/features/orders/components';
import { OrderDetail, OrderSummary } from '~app/features/chat-inbox/order-in-chat/components';
import { useChatStore } from '~app/features/chat-inbox/hooks';
import { MessageType } from '~app/utils/constants';
import ProductDrawerContainer from '~app/features/pos/components/ProductDrawer/ProductDrawerContainer';

type Props = {
  className?: string;
  onSendMessage: (value: string, type: MessageType) => void;
};

const OrderInChat = ({ className, onSendMessage }: Props) => {
  const { t } = useTranslation('pos');
  const productSelectionRef = useRef<ProductSelectionRef>(null);
  const [, setPosStore] = usePosStore((store) => store.is_edit_order);
  const [, setChatStore] = useChatStore((store) => store.showOrderInChat);

  const handleOpenProductSelection = useCallback(() => {
    productSelectionRef?.current?.handleOpen();
  }, []);

  useEffect(() => {
    setPosStore((store) => ({ ...store, pending_orders: [], selected_product: null, selected_drawer: null }));
  }, [setPosStore]);

  return (
    <div className={cx('pw-flex', className)}>
      <div className="pw-w-6/12 pw-py-2 pw-flex pw-flex-col">
        <div className="pw-flex pw-justify-between pw-px-6 ">
          <div className="pw-flex pw-items-center pw-gap-x-3">
            <span className="pw-text-base pw-text-neutral-primary pw-font-bold">{t('action.create_order')}</span>
            <WholesalePriceToggle />
          </div>
          <button onClick={() => setChatStore((store) => ({ ...store, showOrderInChat: false }))}>
            <BsXLg size={20} className="pw-text-neutral-secondary" />
          </button>
        </div>
        <div className="pw-flex pw-mt-3 pw-px-6 ">
          <ProductSelection className="pw-flex-1" ref={productSelectionRef} autoFocus={true} />
        </div>
        <OrderDetail
          className="pw-flex pw-flex-col pw-h-[calc(100vh-180px)] pw-overflow-auto pw-mt-3 scrollbar-sm"
          onClick={handleOpenProductSelection}
        />
      </div>
      <div className="pw-w-6/12 pw-flex pw-h-[calc(100vh-56px)] pw-flex-col">
        <OrderSummary onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

const OrderInchatWrapper = ({ className, onSendMessage }: Props) => {
  return (
    <>
      <OrderInChat className={className} onSendMessage={onSendMessage} />
      <ProductDrawerContainer />
    </>
  );
};

export default memo(OrderInchatWrapper);
