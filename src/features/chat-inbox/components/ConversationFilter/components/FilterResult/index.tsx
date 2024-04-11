import { TagGroup } from 'rsuite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  filterOptions,
  formatFilterDate,
  getSecondaryFilterValues,
} from '~app/features/chat-inbox/components/ConversationFilter/config';
import { formatFilterData } from '~app/components/Filter/utils';
import FilterDataItem from '~app/components/Filter/SecondaryFilter/FilterDataItem';
import { isJsonString } from '~app/utils/helpers';
import { useChatStore } from '~app/features/chat-inbox/hooks';
import { ConversationTabEnum } from '~app/features/chat-inbox/components/ConversationTab';
import { checkTabIncludesFilter } from '~app/features/chat-inbox/utils';

type Props = {
  initValues: ExpectedAny;
};

const FilterResult = ({ initValues }: Props) => {
  const { t } = useTranslation('common');
  const [tab] = useChatStore((store) => store.tab);
  const [filter, setFilter] = useChatStore((store) => store.filter);
  const { secondary } = filterOptions();

  const filterMap = useMemo(
    () => formatFilterData({ filterData: getSecondaryFilterValues(filter), initValues, options: secondary }),
    [filter, initValues],
  );

  const onCloseTag = (data: ExpectedAny, item: ExpectedAny) => {
    const newValue = Array.isArray((filter as ExpectedAny)[data.key])
      ? data.key === 'dateRange'
        ? []
        : data.value.filter((value: ExpectedAny) => value !== item)
      : initValues[data.key];
    const filterData = {
      ...filter,
      [data.key]: newValue,
    };
    setFilter((prevState) => ({ ...prevState, filter: filterData }));
    if (tab !== ConversationTabEnum.ALL) {
      const isContainTabFilter = checkTabIncludesFilter({ tab, filterData });
      if (!isContainTabFilter) setFilter((prevState) => ({ ...prevState, tab: ConversationTabEnum.ALL }));
    }
  };

  const renderFilterData = useMemo(
    () =>
      filterMap.map((item: ExpectedAny) => {
        const itemFilter = item.value.map((value: ExpectedAny, index: number) => {
          const itemData = typeof value === 'string' && isJsonString(value) ? JSON.parse(value) : value;
          if (item.key === 'dateRange') {
            if (index === 1) return null;
            itemData.label = formatFilterDate(item.value);
          }
          return (
            <FilterDataItem
              key={value?.value || value}
              className="!pw-mt-0 !pw-mb-2.5"
              item={item}
              itemData={itemData?.label || value}
              showLabel={false}
              onClose={() => onCloseTag(item, value)}
            />
          );
        });
        return itemFilter;
      }),
    [filterMap],
  );

  return (
    <TagGroup className="pw-flex pw-items-center pw-flex-wrap">
      <span className="pw-ml-3 pw-text-sm pw-mb-2.5">{t('current-filter')}:</span> {renderFilterData}
    </TagGroup>
  );
};

export default FilterResult;
