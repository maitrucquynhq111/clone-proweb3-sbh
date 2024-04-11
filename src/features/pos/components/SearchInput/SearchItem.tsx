import { SkuSearch } from './types';
import PlaceholderImage from '~app/components/PlaceholderImage';
import { numberFormat } from '~app/configs';

type Props = {
  data: SkuSearch;
};

const SearchItem = ({ data }: Props) => {
  return (
    <div className="pw-p-3 pw-flex pw-gap-2">
      <div className="pw-w-14 pw-h-14 pw-rounded pw-relative">
        <PlaceholderImage
          src={data?.media?.[0] || ''}
          alt={data.product_name}
          className="pw-object-cover pw-rounded-lg pw-w-full pw-h-full pw-absolute"
        />
      </div>
      <div className="pw-flex pw-flex-1 pw-gap-4 pw-items-start pw-justify-between">
        <div>
          <div className="pw-font-bold">{data?.product_name}</div>
          <div className="pw-text-gray-600">{data?.sku_code}</div>
          <div className="pw-text-gray-600">{data?.name}</div>
        </div>
        <div className="pw-self-center pw-whitespace-nowrap pw-text-green-700 pw-font-semibold">
          {numberFormat.format(data.selling_price || data.normal_price || 0)} đ
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
