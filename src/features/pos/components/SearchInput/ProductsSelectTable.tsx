import { useSyncExternalStore, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import ProductSelectItem from './ProductSelectItem';
import { NoDataImage } from '~app/components/Icons';
import { productSearchStore } from '~app/features/pos/stores/productSearchStore';

type PropsTable = {
  onOpenCreate(): void;
  handleClickProduct(productItem: Product): void;
};

const ProductsSelectTable = ({ onOpenCreate, handleClickProduct }: PropsTable) => {
  const { t } = useTranslation('pos');
  const products = useSyncExternalStore(productSearchStore.subscribe, productSearchStore.getSnapshot);

  return (
    <div className="pw-p-1 pw-bg-neutral-white pw-w-150">
      <div className="pw-flex pw-items-center pw-justify-between pw-mb-4">
        <button className="pw-flex pw-items-center pw-justify-center pw-gap-x-2" type="button" onClick={onOpenCreate}>
          <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={22} />
          <span className="pw-text-blue-600 pw-text-sm pw-font-bold">{t('action.create_product')}</span>
        </button>
      </div>
      <div className="pw-overflow-auto scrollbar-sm pw-max-h-106">
        {products.length === 0 ? (
          <div className="pw-h-full pw-flex pw-flex-col pw-items-center pw-justify-center">
            <NoDataImage width={120} height={120} />
            <div className="pw-text-base">{t('common:no-data')}</div>
          </div>
        ) : (
          <div>
            {products.map((product: Product) => {
              return <ProductSelectItem key={product.id} product={product} handleClickProduct={handleClickProduct} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ProductsSelectTable);
