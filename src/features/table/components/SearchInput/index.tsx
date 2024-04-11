import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelectedTableStore } from '~app/features/table/hooks/useSelectedTable';
import { DebouncedInput } from '~app/components';

const SearchInput = () => {
  const { t } = useTranslation('table');
  const [searchValue, setStore] = useSelectedTableStore((store) => store.searchValue);

  const handleSearch = (value: string) => setStore((store) => ({ ...store, searchValue: value }));

  return (
    <DebouncedInput
      className="pw-w-72 pw-my-1"
      value={searchValue}
      debounce={300}
      icon="search"
      onChange={handleSearch}
      placeholder={t('search') || ''}
    />
  );
};

export default memo(SearchInput);
