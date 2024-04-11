import cx from 'classnames';
import { memo, useSyncExternalStore } from 'react';
import { FixedSizeGrid as Grid, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';
import ProductSelectItem from './ProductSelectItem';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals';
import { productStore } from '~app/features/pos/stores/productStore';
import EmptyState from '~app/components/EmptyState';
import { EmptyStateProduct } from '~app/components/Icons';

const GUTTER_SIZE = 16;

type Props = {
  className?: string;
};
const ProductSelectList = ({ className }: Props) => {
  const { t } = useTranslation('pos');
  const navigate = useNavigate();
  const products = useSyncExternalStore(productStore.subscribe, productStore.getSnapshot);

  const Cell = memo(({ columnIndex, rowIndex, style, colPerRow }: ExpectedAny) => {
    const dataIndex = rowIndex * colPerRow + columnIndex;
    const item = products[dataIndex];
    return (
      (item && (
        <div
          style={{
            ...style,
            left: style.left + GUTTER_SIZE,
            top: style.top + GUTTER_SIZE,
            width: style.width - GUTTER_SIZE,
            height: style.height - GUTTER_SIZE,
          }}
        >
          <ProductSelectItem product={item} className="pw-h-full" />
        </div>
      )) || <></>
    );
  }, areEqual);

  return (
    <div className={cx('', className)}>
      {products.length === 0 ? (
        <EmptyState
          icon={<EmptyStateProduct />}
          description1={t('empty_state.product_1')}
          description2={t('empty_state.product_2') || ''}
          textBtn={t('header-button:products-table.create') || ''}
          onClick={() =>
            navigate({
              pathname: location.pathname,
              search: `?${createSearchParams({
                modal: ModalTypes.ProductCreate,
                placement: ModalPlacement.Top,
                size: ModalSize.Full,
              })}`,
            })
          }
        />
      ) : (
        <AutoSizer>
          {({ width, height }: ExpectedAny) => {
            const newWidth = width - GUTTER_SIZE;
            const colPerRow = width > 720 ? 5 : width > 576 ? 4 : 3;
            return (
              <Grid
                columnCount={colPerRow}
                columnWidth={Math.ceil(newWidth / colPerRow)}
                height={height - GUTTER_SIZE}
                rowCount={Math.ceil(products.length / colPerRow)}
                rowHeight={138 + GUTTER_SIZE}
                width={width}
                className="scrollbar-sm !pw-overflow-x-hidden"
              >
                {(props: ExpectedAny) => <Cell {...props} colPerRow={colPerRow} />}
              </Grid>
            );
          }}
        </AutoSizer>
      )}
    </div>
  );
};

export default memo(ProductSelectList);
