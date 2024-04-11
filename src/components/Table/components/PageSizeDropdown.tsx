import { SyntheticEvent } from 'react';
import { SelectPicker } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { itemsPerPageOptions } from '../constants';

type PageSizeDropdownProps = {
  value: number;
  onChange: (value: number | null, event: SyntheticEvent<Element, Event>) => void;
};

const PageSizeDropdown = (props: PageSizeDropdownProps) => {
  const { value, onChange } = props;
  const { t } = useTranslation('common');
  return (
    <SelectPicker
      size="sm"
      className="pw-w-28 pagination-select"
      menuClassName="pagination-select"
      cleanable={false}
      menuMaxHeight={200}
      searchable={false}
      placement={'topStart'}
      data={itemsPerPageOptions(t)}
      value={value}
      onChange={onChange}
    />
  );
};

export default PageSizeDropdown;
