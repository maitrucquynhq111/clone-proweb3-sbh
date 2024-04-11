import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { ProductAddonCheckbox, ProductAddonQuantity, ProductAddonRadio } from '~app/features/pos/components';
import { useSelectedAddons } from '~app/features/pos/hooks';

type Props = {
  addonGroup: ProductAddOnGroup;
};

const ProductAddonGroupRenderer = ({ addonGroup }: Props) => {
  const productAddOnSetting = {
    is_multiple_items: addonGroup.is_multiple_items,
    is_multiple_options: addonGroup.is_multiple_options,
    is_required: addonGroup.is_required,
  };
  return (
    <>
      {addonGroup.is_multiple_items ? (
        <div className="-pw-mx-6 -pw-mb-4 pw-grid pw-grid-cols-2">
          {addonGroup.list_product_add_on.map((item, index) => {
            return (
              <ProductAddonQuantity
                key={item.id}
                productAddOn={item}
                productAddonGroup={addonGroup}
                productAddOnSetting={productAddOnSetting}
                className={cx('pw-py-4 pw-px-6 pw-border-b pw-border-solid pw-border-neutral-divider', {
                  'pw-border-l': (index + 1) % 2 === 0,
                })}
              />
            );
          })}
        </div>
      ) : null}
      {!addonGroup.is_multiple_items && addonGroup.is_multiple_options ? (
        <div className="pw-flex pw-gap-4 pw-items-center pw-flex-wrap pw-mt-4">
          {addonGroup.list_product_add_on.map((item) => {
            return (
              <ProductAddonCheckbox
                key={item.id}
                productAddonGroup={addonGroup}
                productAddOn={item}
                productAddOnSetting={productAddOnSetting}
              />
            );
          })}
        </div>
      ) : null}
      {!addonGroup.is_multiple_items && !addonGroup.is_multiple_options ? (
        <div className="pw-flex pw-gap-x-5 pw-gap-y-4 pw-items-center pw-flex-wrap pw-mt-4">
          {addonGroup.list_product_add_on.map((item) => {
            return (
              <ProductAddonRadio
                key={item.id}
                productAddonGroup={addonGroup}
                productAddOn={item}
                productAddOnSetting={productAddOnSetting}
              />
            );
          })}
        </div>
      ) : null}
    </>
  );
};

const ProductAddonGroup = ({ addonGroup }: Props) => {
  const { t } = useTranslation('pos');
  const [requiredGroups] = useSelectedAddons((store) => store.required_groups);
  const isRequired = requiredGroups.includes(addonGroup.id);
  return (
    <div className="pw-px-6 pw-py-4 pw-bg-white pw-mb-1">
      <h4
        className={cx('pw-text-lg pw-font-bold', {
          'pw-text-red-600': isRequired,
          'pw-text-neutral-title': !isRequired,
        })}
      >
        {addonGroup.name}
        {addonGroup.is_required ? <span className="pw-text-red-600 pw-inline-block pw-ml-1">*</span> : null}
      </h4>
      {isRequired ? (
        <p className="pw-text-red-600 pw-inline-block pw-mt-2 pw-text-xs pw-font-semibold">
          {t('error.not_select_add_on')}
        </p>
      ) : null}
      <ProductAddonGroupRenderer addonGroup={addonGroup} />
    </div>
  );
};

export default ProductAddonGroup;
