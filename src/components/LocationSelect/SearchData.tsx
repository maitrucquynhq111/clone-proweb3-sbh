import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InfiniteScroll } from '~app/components';

type Props = {
  data: AddressLocation[];
  page: number;
  totalPages: number;
  onClick(value: AddressLocation): void;
  setPage(): void;
};
function SearchData({ data, page, totalPages, onClick, setPage }: Props) {
  const { t } = useTranslation('pos');
  const next = useCallback(() => setPage(), []);
  const isLastPage = useMemo(() => page >= (totalPages || 1), [totalPages, page]);

  return (
    <div className="pw-overflow-auto pw-max-h-80 scrollbar-sm">
      <InfiniteScroll next={next} hasMore={!isLastPage}>
        {(data?.length > 0 &&
          data.map((item: AddressLocation) => {
            return (
              <div
                key={item.id}
                className="pw-p-3 pw-cursor-pointer pw-text-sm pw-border-b"
                onClick={() => onClick(item)}
              >
                {item?.full_name}
              </div>
            );
          })) || <div className="pw-p-3 pw-text-sm">{t('error.no_search_location')}</div>}
      </InfiniteScroll>
    </div>
  );
}

export default SearchData;
