import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSyncExternalStore, memo, useEffect } from 'react';
import { categoryStore } from '../../stores/categoryStore';
import { useOfflineContext } from '../../context/OfflineContext';
import { filterProductStore, defaultFilterProduct } from '../../stores';
import { RequestType } from '../../constants';
import { removeItemString } from '~app/utils/helpers/arrayHelpers';

type Props = {
  className?: string;
};

const CategorySelectList = ({ className }: Props) => {
  const { t } = useTranslation('common');
  const { offlineModeWorker } = useOfflineContext();

  const categories = useSyncExternalStore(categoryStore.subscribe, categoryStore.getSnapshot);
  const filter = useSyncExternalStore(filterProductStore.subscribe, filterProductStore.getSnapshot);
  const currentCategories = filter?.category || [];
  const isAll = currentCategories.length === 0;

  const filterProductByCategory = (id: string) => {
    let newCategories = [...currentCategories];
    if (!id) newCategories = [];
    else if (currentCategories.includes(id)) {
      newCategories = removeItemString(currentCategories, id);
    } else {
      newCategories.push(id);
    }

    filterProductStore.setFilter({
      category: newCategories,
    });
    offlineModeWorker.postMessage({
      action: RequestType.FILTER_PRODUCT,
      value: { ...filter, category: newCategories },
    });
  };

  useEffect(() => {
    return () => {
      filterProductStore.setFilter(defaultFilterProduct);
      offlineModeWorker.postMessage({
        action: RequestType.FILTER_PRODUCT,
        value: defaultFilterProduct,
      });
    };
  }, []);

  return (
    <div className={cx('pw-h-full pw-overflow-auto pw-bg-neutral-white scrollbar-sm', className)}>
      <div className="pw-flex pw-flex-col">
        <div
          onClick={() => filterProductByCategory('')}
          className={cx('pw-p-3 pw-pl-6 pw-cursor-pointer pw-text-neutral-primary ', {
            'pw-bg-neutral-background pw-font-bold': isAll,
            'pw-bg-neutral-white pw-font-normal': !isAll,
          })}
        >
          <div className="pw-overflow-hidden pw-text-base pw-text-ellipsis line-clamp-1">{t('all')}</div>
        </div>
        {categories.map((item: ExpectedAny) => {
          const isActive = currentCategories.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => filterProductByCategory(item.id)}
              className={cx('pw-p-3 pw-pl-6 pw-cursor-pointer pw-text-neutral-primary ', {
                'pw-bg-neutral-background pw-font-bold': isActive,
                'pw-bg-neutral-white pw-font-normal': !isActive,
              })}
            >
              <div className="pw-overflow-hidden pw-text-ellipsis line-clamp-1 pw-text-base">{item.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(CategorySelectList);
