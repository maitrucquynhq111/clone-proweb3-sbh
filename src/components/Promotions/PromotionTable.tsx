import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'react-use';
import { promotionColumnsConfig } from './config';
import StaticTable from '~app/components/EditableTable/StaticTable';

type Props = {
  data: Promotion[];
  selectedPromotion: Promotion | null;
  setSelectedPromotion(value: Promotion | null): void;
};

const PromotionTable = ({ data, selectedPromotion, setSelectedPromotion }: Props) => {
  const { t } = useTranslation('pos');
  const [configs, setConfigs] = useState<ExpectedAny>(null);

  const handleChange = useCallback(
    (value: Promotion) => {
      setSelectedPromotion(selectedPromotion?.promotion_code === value.promotion_code ? null : value);
    },
    [selectedPromotion],
  );

  useDebounce(
    () => {
      setConfigs(
        promotionColumnsConfig({
          t,
          onChange: handleChange,
        }),
      );
    },
    100,
    [handleChange],
  );

  return <>{configs ? <StaticTable columnConfig={configs} data={data} className="pw-rounded" /> : null}</>;
};

export default memo(PromotionTable);
