import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getCanPickQuantity } from '~app/utils/helpers';

type Props = {
  name: string;
  titleClassName?: string;
  valueClassName?: string;
};

const AdvanceStockBar = ({ name, titleClassName, valueClassName }: Props): JSX.Element => {
  const { t } = useTranslation('products-form');
  const { watch } = useFormContext();

  const po_details = watch(name) as PoDetail;

  return (
    <div>
      <div className="pw-h-3 pw-w-full pw-flex pw-items-center pw-mt-1 pw-mb-2 pw-rounded-lg pw-bg-slate-200">
        <div
          className="pw-h-full pw-bg-blue-500 pw-rounded-tl-lg pw-rounded-bl-lg"
          style={{
            width: ((po_details?.blocked_quantity || 0) / (po_details?.quantity || 0)) * 100 + '%',
          }}
        />
        <div
          className="pw-h-full pw-bg-orange-500"
          style={{
            width: ((po_details?.delivering_quantity || 0) / (po_details?.quantity || 0)) * 100 + '%',
          }}
        />
        <div
          className="pw-h-full pw-bg-green-500 pw-rounded-tr-lg pw-rounded-br-lg"
          style={{
            width:
              getCanPickQuantity(po_details) <= 0
                ? '0px'
                : (getCanPickQuantity(po_details) / (po_details?.quantity || 0)) * 100 + '%',
          }}
        />
      </div>
      <div className="pw-flex pw-items-center pw-justify-between pw-mx-1">
        <div className="pw-flex">
          <div className="pw-w-3 pw-h-3 pw-rounded-full pw-mt-1 pw-mr-2 pw-bg-blue-500" />
          <div>
            <p className={titleClassName}>{t('not_sold')}</p>
            <p className={valueClassName}>{po_details?.blocked_quantity || 0}</p>
          </div>
        </div>
        <div className="pw-flex">
          <div className="pw-w-3 pw-h-3 pw-rounded-full pw-mt-1 pw-mr-2 pw-bg-orange-500" />
          <div>
            <p className={titleClassName}>{t('customer_booked')}</p>
            <p className={valueClassName}>{po_details?.delivering_quantity || 0}</p>
          </div>
        </div>
        <div className="pw-flex">
          <div className="pw-w-3 pw-h-3 pw-rounded-full pw-mt-1 pw-mr-2 pw-bg-green-500" />
          <div>
            <p className={titleClassName}>{t('can_pick')}</p>
            <p className={valueClassName}>{getCanPickQuantity(po_details) || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdvanceStockBar;
