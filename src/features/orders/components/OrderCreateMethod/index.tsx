import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsGlobe2 } from 'react-icons/bs';
import { DesktopCircle } from '~app/components/Icons';
import { OrderCreateMethod as OrderCreateMethodType } from '~app/utils/constants';

type Props = {
  createMethod: OrderCreateMethodType;
  showText?: boolean;
};

const RenderIcon = ({ createMethod }: { createMethod: OrderCreateMethodType }) => {
  if (createMethod === OrderCreateMethodType.SELLER) {
    return <DesktopCircle />;
  }
  return <BsGlobe2 size={20} className="pw-fill-secondary-main-blue" />;
};

const RenderText = ({ createMethod }: { createMethod: OrderCreateMethodType }) => {
  const { t } = useTranslation(['orders-form', 'common']);
  if (createMethod === OrderCreateMethodType.SELLER) {
    return (
      <>
        <span>{t('common:from')}&nbsp;</span>
        <span className="pw-font-bold"> {t('pos')}</span>
      </>
    );
  }
  return (
    <>
      <span>{t('common:from')}&nbsp;</span>
      <span className="pw-font-bold"> {t('web')}</span>
    </>
  );
};

const OrderCreateMethod = ({ createMethod, showText = true }: Props) => {
  return (
    <div className="pw-flex pw-gap-x-2">
      <RenderIcon createMethod={createMethod} />
      {showText ? (
        <div className="pw-flex">
          <RenderText createMethod={createMethod} />
        </div>
      ) : null}
    </div>
  );
};

export default memo(OrderCreateMethod);
