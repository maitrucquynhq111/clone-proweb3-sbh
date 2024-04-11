import cx from 'classnames';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import { BsChevronUp } from 'react-icons/bs';
import { ingredientTableConfig } from './config';
import { StaticTable } from '~app/components';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  listIngredient: ItemInventoryDetail[];
  isExport?: boolean;
};

const SkuTable = ({ listIngredient, isExport = false }: Props) => {
  const { t } = useTranslation('purchase-order');
  const [collapse, setCollapse] = useState(false);
  const canUpdateHistoricalCost = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);

  const configs = useMemo(() => {
    return ingredientTableConfig({ t, canViewPrice: canUpdateHistoricalCost, isExport });
  }, [JSON.stringify(listIngredient)]);

  return (
    <div>
      <Button
        appearance="subtle"
        startIcon={
          <BsChevronUp
            size={20}
            className={cx('pw-text-primary-main  pw-transition-all pw-duration-200 pw-ease-in', {
              'pw-rotate-180': collapse,
            })}
          />
        }
        className="!pw-text-primary-main !pw-text-base !pw-font-semibold !pw-mb-2"
        onClick={() => setCollapse(!collapse)}
      >{`${t('ingredient-table.ingredient')} (${listIngredient.length})`}</Button>
      {!collapse && (
        <div className="pw-max-h-84 pw-overflow-auto scrollbar-sm pw-min-w-full">
          <StaticTable columnConfig={configs} data={listIngredient} rowKey="id" />
        </div>
      )}
    </div>
  );
};

export default memo(SkuTable);
