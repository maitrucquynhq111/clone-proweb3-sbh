import SearchItem from './SearchItem';
import { useTranslation } from 'react-i18next';
import { SkuSearch } from './types';

function SearchData({ data }: ExpectedAny) {
  const { t } = useTranslation('pos');
  const skus = data
    .map((item: Product) =>
      item.list_sku.map((sku) => ({
        ...sku,
        product_id: item.id,
        product_name: item.name,
        sold_quantity: item.sold_quantity,
        product_images: item.images,
        product_type: item.product_type,
        list_product_add_on_group: item.list_product_add_on_group,
        uom: sku.uom || item.uom,
      })),
    )
    .reduce((a: SkuSearch[], b: SkuSearch[]) => a.concat(b), []);

  const isEmpty = skus?.length === 0;

  return (
    <div className="pw-divide-y pw-rounded-sm pw-z-20 pw-mt-2 pw-w-106 pw-shadow pw-absolute pw-bg-white pw-max-h-80 pw-overflow-auto">
      {isEmpty ? (
        <div className="pw-h-40 pw-items-center pw-justify-center pw-flex">
          <p className="pw-font-bold pw-text-gray-400">{t('not-found-product')}</p>
        </div>
      ) : (
        skus.map((item: SkuSearch) => {
          return <SearchItem data={item} />;
        })
      )}
    </div>
  );
}

export default SearchData;
