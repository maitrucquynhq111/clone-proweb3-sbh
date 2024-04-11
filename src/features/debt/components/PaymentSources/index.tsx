import cx from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Placeholder } from 'rsuite';
import { InfiniteScroll } from '~app/components';
import { usePaymentSourcesQuery } from '~app/services/queries';
import { CASH_PAYMENT_SOURCE } from '~app/utils/constants';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';

type Props = {
  onChange?(data: Payment): void;
  isContactPayment?: boolean;
  className?: string;
  defaultValue?: string;
  paymentDefault?: boolean;
};

const PaymentSources = ({
  defaultValue,
  className,
  isContactPayment = false,
  paymentDefault = false,
  onChange,
}: Props) => {
  const [list, setList] = useState<Payment[]>([]);
  const [page, setPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue || '');
  const { data, isLoading } = usePaymentSourcesQuery({
    page,
    page_size: 10,
    sort: 'priority asc',
    type: paymentDefault ? 'default' : '',
  });

  const memoizedData = useMemo(() => {
    if (data?.data) return data.data;
    return [] as Array<Payment>;
  }, [data]);

  const total_page = useMemo(() => {
    if (data?.meta) return data.meta.total_pages as number;
    return 0;
  }, [data]);

  const isLastPage = useMemo(() => {
    return page >= total_page;
  }, [total_page, page]);

  const next = useCallback(() => {
    setPage((prevState) => prevState + 1);
  }, []);

  useEffect(() => {
    setList((prevState) => removeDuplicates([...prevState, ...memoizedData], 'id'));
    if (defaultValue) return;
  }, [memoizedData, defaultValue]);

  useEffect(() => {
    if (defaultValue || isContactPayment) return;
    const cashPaymentSource = memoizedData.find((item) => item.name === CASH_PAYMENT_SOURCE);
    if (!cashPaymentSource) return;
    setSelectedValue(cashPaymentSource.id);
    onChange && onChange(cashPaymentSource);
  }, [defaultValue, memoizedData, isContactPayment]);

  return (
    <>
      {isLoading ? (
        <Placeholder.Graph active className="pw-rounded" height={38} />
      ) : (
        <div>
          <InfiniteScroll
            next={next}
            hasMore={!isLastPage}
            className={cx('pw-grid pw-grid-cols-3 pw-gap-4 pw-max-h-80 pw-overflow-auto payment-source', className)}
          >
            {list.map((item) => {
              const isSelected = item.id === selectedValue;
              return (
                <Button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setSelectedValue(item.id);
                    onChange && onChange(item);
                  }}
                  className={cx(' !pw-rounded !pw-border !pw-border-solid', {
                    '!pw-bg-blue-50 !pw-border-blue-700': isSelected,
                    '!pw-bg-neutral-100 !pw-border-transparent': !isSelected,
                  })}
                >
                  <span
                    className={cx('pw-text-sm ', {
                      'pw-text-blue-700 ': isSelected,
                      'pw-text-gray-600': !isSelected,
                    })}
                  >
                    {item.name}
                  </span>
                </Button>
              );
            })}
          </InfiniteScroll>
        </div>
      )}
    </>
  );
};

export default PaymentSources;
