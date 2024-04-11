import cx from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd } from 'react-icons/md';
import { Tag } from 'rsuite';
import QuantityControl from '~app/components/QuantityControl';
import { useSelectedAddons } from '~app/features/pos/hooks/useSelectedAddons';
import { addToListAddon, removeAddon } from '~app/features/pos/utils';
import { QuantityControlSize } from '~app/utils/constants';
import { formatCurrency } from '~app/utils/helpers';

type Props = {
  className?: string;
  productAddonGroup: ProductAddOnGroup;
  productAddOn: ProductAddOn;
  productAddOnSetting: ProductAddOnGroupSetting;
};

const ProductAddonQuantity = ({ productAddOn, productAddOnSetting, productAddonGroup, className }: Props) => {
  const { t } = useTranslation('pos');
  const [canSelect, setStore] = useSelectedAddons((store) => store.can_select);
  const [selectedList] = useSelectedAddons((store) => store.selected_list);

  const selectedAddon = useMemo(() => {
    return selectedList.find((item) => item.product_add_on_id === productAddOn.id);
  }, [selectedList]);

  const disabled = useMemo(() => {
    if (productAddOn.is_active === false || !canSelect) return true;
    if (productAddOnSetting.is_multiple_options) return false;
    if (
      selectedList.some(
        (item) =>
          productAddonGroup.list_product_add_on.some((addOn) => addOn.id === item.product_add_on_id) &&
          item.product_add_on_id !== productAddOn.id,
      )
    )
      return true;
    return false;
  }, [selectedAddon, productAddOn, productAddOnSetting, productAddonGroup, canSelect, selectedList]);

  const handleChange = (value: string) => {
    if (!selectedAddon) {
      const newAddon = {
        ...productAddOn,
        product_add_on_id: productAddOn.id,
        is_multiple_items: productAddOnSetting.is_multiple_items,
        is_multiple_options: productAddOnSetting.is_multiple_options,
        is_required: productAddOnSetting.is_required,
        quantity: 1,
      } as OrderItemAddOn;
      return setStore((store) => {
        if (!value) return store;
        const newRequiredGroups = [
          ...store.required_groups.filter((item) => item !== newAddon.product_add_on_group_id),
        ];
        return {
          ...store,
          selected_list: addToListAddon(newAddon, store.selected_list, +value),
          required_groups: newRequiredGroups,
        };
      });
    }
    if (!value || value === '0') {
      return handleRemoveOrderItem();
    }
    setStore((store) => {
      if (!value) return store;
      return { ...store, selected_list: addToListAddon(selectedAddon, store.selected_list, +value) };
    });
  };

  const handleRemoveOrderItem = () => {
    setStore((store) => {
      if (!selectedAddon) return store;
      return { ...store, selected_list: removeAddon(selectedAddon, store.selected_list) };
    });
  };

  const handleBlur = (value: string) => {
    if (!value || value === '0') {
      handleRemoveOrderItem();
    }
  };

  return (
    <div className={cx('pw-flex pw-items-center pw-justify-between pw-gap-2', className)}>
      <div className="pw-flex pw-flex-col pw-gap-y-0.5 pw-w-7/12">
        <span className="pw-text-base pw-text-neutral-primary pw-font-normal pw-truncate">{productAddOn.name}</span>
        <span className="pw-text-xs pw-font-semibold pw-text-neutral-placeholder">
          + {formatCurrency(productAddOn.price)}đ
        </span>
      </div>
      {selectedAddon ? (
        <QuantityControl
          size={QuantityControlSize.Xsmall}
          onChange={handleChange}
          onBlur={handleBlur}
          defaultValue={selectedAddon.quantity.toString()}
          disabled={disabled}
          className="!pw-w-5/12"
        />
      ) : productAddOn.is_active ? (
        <button
          className={cx('pw-w-8 pw-h-8 pw-rounded pw-flex pw-justify-center pw-items-center ', {
            'pw-bg-neutral-disable': disabled,
            'pw-bg-green-700': !disabled,
          })}
          disabled={disabled}
          onClick={() => handleChange('1')}
        >
          <MdAdd className="pw-text-white" />
        </button>
      ) : (
        <Tag size="sm" className="pw-w-5/12 pw-text-center">
          {t('out_of_stock')}
        </Tag>
      )}
    </div>
  );
};

export default ProductAddonQuantity;
