import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import cx from 'classnames';
import { Timeline, Button } from 'rsuite';
import { useSearchParams } from 'react-router-dom';
import { InfiniteScroll } from '~app/components';
import { formatCurrency, formatDateToString } from '~app/utils/helpers';
import { useCustomerPointHistoryQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';

type Props = {
  onClickOrderNumber?: (orderNumber: string) => void;
};

const CustomerPointHistory = ({ onClickOrderNumber }: Props) => {
  const { t } = useTranslation('contact-details');
  const [page, setPage] = useState(1);
  const [list, setList] = useState<CustomerPointHistory[]>([]);
  const [searchParams] = useSearchParams();
  const contact_id = searchParams.get('id') as string;
  const { data } = useCustomerPointHistoryQuery({
    page: page,
    page_size: 10,
    contact_id: contact_id || '',
  });

  const memoizedData = useMemo(() => {
    if (data?.data) return data.data;
    return [];
  }, [data]);

  useEffect(() => {
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...memoizedData], 'id'));
    } else {
      setList(memoizedData);
    }
  }, [memoizedData, page]);

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

  const isPositivePoint = (pointItem: CustomerPointHistory) => pointItem.type === 'in';

  const renderContent = (pointItem: CustomerPointHistory) => {
    if (pointItem.source === 'order') {
      return (
        <span className="pw-text-neutral-secondary pw-text-sm">
          {t('details-tab.order')}
          <Button
            className="!pw-p-1 !pw-text-neutral-secondary !pw-text-sm"
            onClick={() => onClickOrderNumber?.(pointItem.order_number)}
            appearance="subtle"
          >
            #{pointItem.order_number}
          </Button>
        </span>
      );
    }
    return <span className="pw-text-neutral-secondary pw-text-sm">{t('edit_point')}</span>;
  };

  return (
    <div className="pw-py-4 pw-bg-white">
      <span className="pw-text-lg pw-font-bold">{t('edit_point_history')}</span>
      <div className="gray-timeline pw-grid pw-grid-cols-2 pw-space-x-1 pw-items-end pw-mt-4">
        <InfiniteScroll next={next} hasMore={!isLastPage}>
          <Timeline>
            {(list || []).map((pointItem: CustomerPointHistory) => {
              return (
                <Timeline.Item className="pw-pb-4" key={pointItem.id}>
                  <div className="pw-grid pw-grid-cols-4">
                    <span className="pw-text-neutral-secondary pw-font-semibold pw-text-sm">
                      {formatDateToString(pointItem.created_at || new Date(), 'dd/MM HH:mm')}
                    </span>
                    {renderContent(pointItem)}
                    <span
                      className={cx('pw-text-center pw-font-semibold pw-text-sm', {
                        'pw-text-primary-main': isPositivePoint(pointItem),
                        'pw-text-secondary-main': !isPositivePoint(pointItem),
                      })}
                    >
                      {isPositivePoint(pointItem) ? '+' : '-'}
                      {formatCurrency(pointItem.point)}
                    </span>
                    {pointItem?.staff_info && (
                      <span className="pw-text-right pw-text-neutral-secondary pw-text-sm">
                        {t('created_by')}: {pointItem?.staff_info?.staff_name || ''}
                      </span>
                    )}
                  </div>
                </Timeline.Item>
              );
            })}
          </Timeline>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default memo(CustomerPointHistory);
