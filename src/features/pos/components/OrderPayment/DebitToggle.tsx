import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Toggle } from 'rsuite';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { formatCurrency } from '~app/utils/helpers';

type Props = {
  className?: string;
  amount: number;
};

const DebitToggle = ({ className, amount }: Props) => {
  const { t } = useTranslation('cashbook-form');
  const [isDebit, setStore] = useSelectedOrderStore((store) => store.debit.is_debit);

  const handleChange = (checked: boolean) => {
    setStore((store) => {
      const newDebit = { ...store.debit };
      newDebit.is_debit = checked;
      return { ...store, debit: newDebit };
    });
  };

  return (
    <div className={cx('pw-flex pw-py-1 pw-justify-between pw-items-center', className)}>
      <div className="pw-flex pw-items-center pw-gap-x-3">
        <span className="pw-text-base pw-text-neutral-primary">{t('debit')}</span>
        <div className="blue-toggle">
          <Toggle checked={isDebit} onChange={handleChange} className="blue-toggle" />
        </div>
      </div>
      <div className="pw-text-base pw-font-semibold pw-text-neutral-primary">{formatCurrency(Math.abs(amount))}</div>
    </div>
  );
};

export default DebitToggle;
