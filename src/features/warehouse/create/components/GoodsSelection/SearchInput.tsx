import { forwardRef, useState } from 'react';
import { useDebounce } from 'react-use';
import { Input, InputGroup } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { useTranslation } from 'react-i18next';

type Props = {
  autoFocus?: boolean;
  onChange(value: string): void;
  onOpen(): void;
};

type Ref = HTMLInputElement;

const SearchInput = forwardRef<Ref, Props>(({ autoFocus = false, onChange, onOpen }, ref) => {
  const { t } = useTranslation('purchase-order');
  const [value, setValue] = useState('');

  useDebounce(
    () => {
      onChange(value);
    },
    300,
    [value],
  );

  return (
    <InputGroup inside>
      <InputGroup.Addon>
        <SearchIcon />
      </InputGroup.Addon>
      <Input
        ref={ref}
        value={value}
        autoFocus={autoFocus}
        onChange={(value) => setValue(value)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen();
        }}
        placeholder={t('placeholder.search_product') || ''}
      />
    </InputGroup>
  );
});

export default SearchInput;
