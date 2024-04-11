import cx from 'classnames';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import React, { useSyncExternalStore, memo, useEffect, useState, useCallback } from 'react';
import { categoryStore } from '../../stores/categoryStore';
import { useOfflineContext } from '../../context/OfflineContext';
import { filterProductStore, defaultFilterProduct } from '../../stores';
import { RequestType, SCROLL_RACE } from '../../constants';
import CategoryListModal from './CategoryListModal';
import { removeItemString } from '~app/utils/helpers/arrayHelpers';

type Props = {
  className?: string;
};
const CategoryListHorizontal = ({ className }: Props) => {
  const { t } = useTranslation('common');
  const { offlineModeWorker } = useOfflineContext();
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

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
    return () => {
      filterProductStore.setFilter(defaultFilterProduct);
      offlineModeWorker.postMessage({
        action: RequestType.FILTER_PRODUCT,
        value: defaultFilterProduct,
      });
    };
  }, []);

  return (
    <div className={cx('pw-pr-16 pw-relative pw-border-b pw-border-b-neutral-divider', className)}>
      {openCategoryModal && (
        <CategoryListModal
          open={true}
          onClose={() => setOpenCategoryModal(false)}
          categories={categories}
          currentCategories={currentCategories}
        />
      )}

      <div
        id="scroll-horizontal"
        className="pw-flex pw-items-center pw-whitespace-nowrap pw-overflow-auto scrollbar-sm pw-bg-neutral-white pw-w-full pw-h-full"
      >
        <div
          onClick={() => filterProductByCategory('')}
          className={cx('pw-py-3 pw-px-6 pw-cursor-pointer pw-max-w-[13rem]', {
            'pw-font-semibold pw-text-primary-main pw-border-b pw-border-b-primary-main': isAll,
            'pw-font-normal pw-text-neutral-secondary': !isAll,
          })}
        >
          <div className="pw-text-sm pw-text-ellipsis line-clamp-1">{t('all')}</div>
        </div>
        {categories.map((item: ExpectedAny) => {
          const isActive = currentCategories.includes(item.id);
          return (
            <React.Fragment key={item.id}>
              <span className="pw-text-neutral-border">|</span>
              <div
                onClick={() => filterProductByCategory(item.id)}
                className={cx('pw-py-3 pw-px-6 pw-cursor-pointer', {
                  'pw-font-semibold pw-text-primary-main pw-border-b pw-border-b-primary-main': isActive,
                  'pw-font-normal pw-text-neutral-secondary': !isActive,
                })}
              >
                <div className="pw-text-ellipsis line-clamp-1 pw-text-sm">{item.name}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <span
        className="pw-text-neutral-secondary pw-bg-neutral-border pw-cursor-pointer pw-p-2 pw-rounded pw-absolute pw-right-2 pw-top-1"
        onClick={() => setOpenCategoryModal(true)}
      >
        <BsThreeDotsVertical size={20} />
      </span>
    </div>
  );
};

export default memo(CategoryListHorizontal);
