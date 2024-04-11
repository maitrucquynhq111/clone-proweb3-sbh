import cx from 'classnames';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TableTabItem from './TableTabItem';
import { SCROLL_RACE } from '~app/features/pos/constants';
import { useTableZoneQuery } from '~app/services/queries/useTableZoneQuery';
import { useSelectedTableStore } from '~app/features/table/hooks/useSelectedTable';
import { InfiniteScroll } from '~app/components';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';

type Props = {
  className?: string;
};

const TableTabs = ({ className }: Props) => {
  const { t } = useTranslation('common');
  const [page, setPage] = useState(1);
  const [list, setList] = useState<TableZone[]>([]);
  const [{ selectedZoneId }, setStore] = useSelectedTableStore((store) => store);
  const { data } = useTableZoneQuery({ page, pageSize: 20 });

  const isLastPage = useMemo(() => page >= (data?.meta?.total_pages || 1), [data?.meta.total_pages, page]);

  const handleScrollHorizontal = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const mouseWheel = document.getElementById('scroll-horizontal');
    if (mouseWheel) {
      if (e.deltaY > 0)
        // Scroll right
        mouseWheel.scrollLeft += SCROLL_RACE;
      // Scroll left
      else mouseWheel.scrollLeft -= SCROLL_RACE;
    }
  }, []);

  useEffect(() => {
    const mouseWheel = document.getElementById('scroll-horizontal');
    if (mouseWheel) {
      mouseWheel.addEventListener('wheel', handleScrollHorizontal);
      return () => {
        mouseWheel.removeEventListener('wheel', handleScrollHorizontal);
      };
    }
  }, [handleScrollHorizontal]);

  useEffect(() => {
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...(data?.data || [])], 'id'));
    } else {
      setList(data?.data || []);
    }
  }, [data]);

  const handleClick = (id: string) => setStore((store) => ({ ...store, selectedZoneId: id }));

  const next = useCallback(() => setPage((prevState) => prevState + 1), []);

  return (
    <div
      id="scroll-horizontal"
      className={cx(`pw-flex pw-gap-x-2 pw-p-4 pw-w-full pw-overflow-auto scrollbar-sm`, className)}
    >
      <InfiniteScroll
        next={next}
        hasMore={!isLastPage}
        className="pw-flex pw-gap-x-2 pw-max-w-fit pw-whitespace-nowrap"
      >
        <div
          className={cx(
            'pw-flex pw-items-center pw-justify-center pw-w-max pw-px-4 pw-py-3 pw-bg-neutral-divider pw-text-neutral-secondary pw-gap-x-2 pw-rounded pw-cursor-pointer',
            { '!pw-bg-secondary-main-blue !pw-text-white': selectedZoneId === '' },
          )}
          onClick={() => handleClick('')}
        >
          <span className="pw-font-normal pw-text-base">{t('all')}</span>
        </div>
        {list.map((item, index) => {
          const active = selectedZoneId === item.id;
          return <TableTabItem key={index} item={item} active={active} onClick={handleClick} />;
        })}
      </InfiniteScroll>
    </div>
  );
};

export default memo(TableTabs);
