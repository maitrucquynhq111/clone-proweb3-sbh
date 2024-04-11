import cx from 'classnames';
import { useMemo } from 'react';
// import { Radio } from 'rsuite';
import { useSelectedAddons } from '~app/features/pos/hooks/useSelectedAddons';
import { addToListAddon, removeAddon } from '~app/features/pos/utils';
import { formatCurrency } from '~app/utils/helpers';

type Props = {
  className?: string;
  productAddonGroup: ProductAddOnGroup;
  productAddOn: ProductAddOn;
  productAddOnSetting: ProductAddOnGroupSetting;
};

const ProductAddonRadio = ({ productAddOn, productAddOnSetting, productAddonGroup, className }: Props) => {
  const [canSelect, setStore] = useSelectedAddons((store) => store.can_select);
  const [selectedList] = useSelectedAddons((store) => store.selected_list);

  const selectedAddon = useMemo(() => {
    return selectedList.find((item) => item.product_add_on_id === productAddOn.id);
  }, [selectedList]);

  const checked = useMemo(() => {
    return selectedList.some((item) => item.product_add_on_id === productAddOn.id);
  }, [productAddOn, selectedList]);

  const disabled = useMemo(() => {
    if (productAddOn.is_active === false || !canSelect) return true;
    if (productAddOnSetting.is_multiple_options) return false;
    return false;
  }, [productAddOn, productAddOnSetting, canSelect, selectedList, productAddonGroup]);

  const handleClick = () => {
    if (checked && selectedAddon) {
      setStore((store) => {
        return { ...store, selected_list: removeAddon(selectedAddon, store.selected_list) };
      });
    } else {
      const newAddon = {
        ...productAddOn,
        product_add_on_id: productAddOn.id,
        is_multiple_items: productAddOnSetting.is_multiple_items,
        is_multiple_options: productAddOnSetting.is_multiple_options,
        is_required: productAddOnSetting.is_required,
        quantity: 1,
      } as OrderItemAddOn;
      return setStore((store) => {
        const newRequiredGroups = [
          ...store.required_groups.filter((item) => item !== newAddon.product_add_on_group_id),
        ];
        return {
          ...store,
          selected_list: addToListAddon(newAddon, store.selected_list, 1).filter(
            (item) =>
              !(
                productAddonGroup.list_product_add_on.some((addOn) => addOn.id === item.product_add_on_id) &&
                item.product_add_on_id !== newAddon.product_add_on_id
              ),
          ),
          required_groups: newRequiredGroups,
        };
      });
    }
  };
  return (
    <button
      className={cx(
        'pw-flex pw-flex-col pw-gap-x-2',
        {
          'pw-opacity-40': disabled,
          'pw-opacity-100': !disabled,
        },
        className,
      )}
      disabled={disabled}
      onClick={handleClick}
    >
      <div className="pw-flex pw-items-center">
        <div className="pw-wrapper-custom-radio_green">
          <span className="pw-text-base pw-text-neutral-primary pw-font-normal">{productAddOn.name}</span>
          <input checked={checked} type="radio" />
          <span className="pw-checkmark-custom-radio_green"></span>
        </div>
      </div>
      {productAddOn.is_active ? (
        <div className="pw-text-xs pw-font-semibold pw-text-neutral-placeholder">
          + {formatCurrency(productAddOn.price)}đ
        </div>
      ) : null}
    </button>
  );
};

export default ProductAddonRadio;
