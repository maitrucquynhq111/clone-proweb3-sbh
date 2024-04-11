import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { formatCurrency } from '~app/utils/helpers';

type DeptWithCustomerProps = {
  debtAmount: number;
};

const DeptWithContact = ({ debtAmount }: DeptWithCustomerProps) => {
  const { t } = useTranslation('common');
  return (
    <div className="pw-flex pw-items-center pw-flex-wrap">
      <span className="pw-font-semibold">
        {debtAmount > 0 ? t('debt-analytic.must-receive') : t('debt-analytic.must-pay')}:
      </span>
      <span
        className={cx('pw-font-bold pw-ml-2 pw-text-sm', {
          'pw-text-amber-700': debtAmount > 0,
          'pw-text-green-600': debtAmount <= 0,
        })}
      >
        {formatCurrency(debtAmount)}
      </span>
    </div>
  );
};

export default memo(DeptWithContact);
