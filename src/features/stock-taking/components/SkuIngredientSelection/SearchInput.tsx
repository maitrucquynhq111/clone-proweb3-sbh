import { forwardRef } from 'react';
import { Input, InputGroup } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';

type Props = {
  autoFocus?: boolean;
  value: string;
  onChange(value: string): void;
  onOpen(): void;
  placeholder?: string;
};

type Ref = HTMLInputElement;

const SearchInput = forwardRef<Ref, Props>(({ autoFocus = false, value, placeholder, onChange, onOpen }, ref) => {
  return (
    <InputGroup inside>
      <InputGroup.Addon>
        <SearchIcon />
      </InputGroup.Addon>
      <Input
        ref={ref}
        value={value}
        autoFocus={autoFocus}
        onChange={(value) => onChange(value)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen();
        }}
        placeholder={placeholder}
      />
    </InputGroup>
  );
});

export default SearchInput;
