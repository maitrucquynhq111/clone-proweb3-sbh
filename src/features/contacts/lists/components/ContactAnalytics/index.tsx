import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { useRef } from 'react';
import { ContactAnalytic, ContactAnalyticOption } from '~app/utils/constants';
import { useGetContactAnalyticQuery } from '~app/services/queries';
import { formatCurrency } from '~app/utils/helpers';
import { useContactStore } from '~app/features/contacts/hooks';
import { ContactAnalyticFilter } from '~app/features/contacts/lists/config';

type Props = {
  filterValues: ExpectedAny;
  onChange(values: ExpectedAny): void;
};

const ContactAnalytics = ({ filterValues, onChange }: Props) => {
  const { t } = useTranslation('contacts-table');
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [options] = useContactStore((store) => store.analytics_options);
  const { data } = useGetContactAnalyticQuery(options.map((o) => o.value).join(','));

  const renderTitle = (option: ContactAnalyticOption) => {
    if (!data) return null;
    const fontSizeClass = handleScaleFontSize(option);
    switch (option) {
      case ContactAnalyticOption.LAST_CREATE:
        return (
          <div>
            <span className={cx('pw-font-bold', fontSizeClass)}>
              {formatCurrency(data.contact_last_create.total_count)}
            </span>
            <span className="pw-ml-2 pw-text-sm">{t('contact_shorten')}</span>
          </div>
        );
      case ContactAnalyticOption.CONTACT_BACK:
        return (
          <div>
            <span className={cx('pw-font-bold', fontSizeClass)}>{formatCurrency(data.contact_back.total_count)}</span>
            <span className="pw-ml-2 pw-text-sm">{t('contact_shorten')}</span>
          </div>
        );
      case ContactAnalyticOption.AMOUNT_IN:
        return (
          <span className={cx('pw-font-bold', fontSizeClass)}>đ{formatCurrency(data.amount_in.total_amount)}</span>
        );
      case ContactAnalyticOption.AMOUNT_OUT:
        return (
          <span className={cx('pw-font-bold', fontSizeClass)}>đ{formatCurrency(data.amount_out.total_amount)}</span>
        );
      case ContactAnalyticOption.CUSTOMER_POINT:
        return (
          <div>
            <span className={cx('pw-font-bold', fontSizeClass)}>
              {formatCurrency(data.customer_point.total_amount)}
            </span>
            <span className="pw-ml-2 pw-text-sm">
              {`${t('point')} / ${formatCurrency(data.customer_point.total_count)} ${t('contact_shorten')}`}
            </span>
          </div>
        );
      default:
        // ContactAnalyticOption.ORDER
        return (
          <div>
            <span className={cx('pw-font-bold', fontSizeClass)}>đ{formatCurrency(data.order.total_amount)}</span>
            <span className="pw-ml-2 pw-text-sm">
              / {`${formatCurrency(data.order.total_count)} ${t('order_shorten')}`}
            </span>
          </div>
        );
    }
  };

  const getValueAnalytic = (option: ContactAnalyticOption) => {
    if (!data) return 0;
    switch (option) {
      case ContactAnalyticOption.LAST_CREATE:
        return (
          formatCurrency(data.contact_last_create.total_amount).length +
          t('contact_shorten').length +
          `${formatCurrency(data.contact_last_create.total_count)} ${t('order_shorten')}`.length
        );
      case ContactAnalyticOption.CONTACT_BACK:
        return data.contact_last_create.total_count.toString().length;
      case ContactAnalyticOption.AMOUNT_IN:
        return data.contact_last_create.total_amount.toString().length;
      case ContactAnalyticOption.AMOUNT_OUT:
        return data.contact_last_create.total_amount.toString().length;
      case ContactAnalyticOption.CUSTOMER_POINT:
        return data.customer_point.total_amount.toString().length + data.customer_point.total_count.toString().length;
      default:
        return (
          formatCurrency(data.order.total_amount).length +
          `${formatCurrency(data.order.total_count)} ${t('order_shorten')}`.length
        );
    }
  };

  const handleScaleFontSize = (option: ContactAnalyticOption) => {
    const contentWidth = contentRef.current?.clientWidth || 0;
    if (contentWidth >= 290) {
      if (getValueAnalytic(option) <= 20) return 'pw-text-2xl';
      return 'pw-text-xl';
    }
    if (getValueAnalytic(option) <= 18) return 'pw-text-xl';
    return 'pw-text-base';
  };

  return (
    <div className="pw-pb-4 pw-bg-white">
      <div
        className={cx('pw-grid pw-gap-1 pw-items-end sm:pw-grid-cols-1 md:pw-grid-cols-2', {
          'lg:pw-grid-cols-1': options.length === 1,
          'lg:pw-grid-cols-2': options.length === 2,
          'lg:pw-grid-cols-3': options.length === 3,
          'lg:pw-grid-cols-4': options.length === 4,
        })}
      >
        {options.map((option: ContactAnalyticFilter) => (
          <div
            key={option.value}
            ref={contentRef}
            className={cx(
              'pw-px-3 pw-text-white pw-p-2 pw-h-18 pw-cursor-pointer',
              ContactAnalytic[option.value].bgColor,
              {
                'pw-border-black pw-border-opacity-20 pw-border-b-8 pw-h-20':
                  filterValues === ContactAnalytic[option.value].name,
              },
            )}
            onClick={() =>
              onChange(filterValues === ContactAnalytic[option.value].name ? '' : ContactAnalytic[option.value].name)
            }
          >
            {renderTitle(option.value)}
            <div className="pw-text-base">{t(`analytic.${ContactAnalytic[option.value].name}`)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactAnalytics;
