import { memo } from 'react';
import { PlaceholderImage } from '~app/components';

type Props = {
  data: SkuInventory;
  className?: string;
  onClick?: () => void;
};

const ItemProduct = ({ data, className = '', onClick }: Props) => {
  return (
    <div onClick={() => onClick?.()} className={`pw-flex pw-px-2 pw-gap-4 pw-w-full ${className}`}>
      <div className="pw-w-10 pw-min-w-fit pw-h-10">
        <PlaceholderImage
          className="pw-bg-cover pw-rounded-md pw-w-10 pw-h-10 pw-object-cover"
          src={data?.media?.[0]}
          alt={data.product_name}
        />
      </div>
      <div className="pw-flex pw-flex-col pw-justify-center">
        <span className="pw-overflow-hidden pw-text-ellipsis pw-text-sm pw-font-bold pw-line-clamp-1">
          {data.product_name}
        </span>
        {data.sku_name && (
          <span className="pw-overflow-hidden pw-text-ellipsis pw-text-sm pw-text-neutral-secondary">
            {data.sku_name}
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(ItemProduct);
