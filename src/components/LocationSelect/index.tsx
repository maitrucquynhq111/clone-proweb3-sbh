import { memo, useState, useMemo, useEffect } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Popover, Whisper } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import SearchData from './SearchData';
import { DebouncedInput, TextInput } from '~app/components';
import { formatSelectLocation, initialLocation } from '~app/features/pos/utils';
import { generateFullLocation } from '~app/utils/helpers';
import { useGetLocationTreeBySearch } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';

type Props = {
  value?: ExpectedAny;
  onChange?(value: PendingAddressLocation): void;
};

const LocationSelect = ({ value, onChange }: Props) => {
  const { t } = useTranslation('pos');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [list, setList] = useState<AddressLocation[]>([]);

  const { data } = useGetLocationTreeBySearch({ name: search, page, pageSize: 20 });
  const fullLocation = useMemo(() => generateFullLocation({ location: value, showAddress: false }), [value]);

  useEffect(() => {
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...(data?.data || [])], 'id'));
    } else {
      setList(data?.data || []);
    }
  }, [data]);

  const handleClick = (newLocation: AddressLocation) => {
    const location = formatSelectLocation(newLocation);
    const newAddressInfo = { ...(location || initialLocation()), address: value?.address || '' };
    onChange?.(newAddressInfo);
  };

  const handleChange = (newValue: string) => {
    const newAddressInfo = { ...(value || initialLocation()), address: newValue };
    onChange?.(newAddressInfo);
  };

  return (
    <div>
      <Whisper
        placement="autoVerticalEnd"
        trigger="click"
        speaker={({ onClose, left, top, className }, ref) => {
          return (
            <Popover
              ref={ref}
              className={cx('!pw-rounded-none pw-w-96', className)}
              style={{ left, top }}
              arrow={false}
              full
            >
              <DebouncedInput
                className="pw-m-4 pw-mb-1"
                value=""
                icon="search"
                onChange={(value) => {
                  page > 1 && setPage(1);
                  setSearch(value);
                }}
                placeholder={t('placeholder.input_location') || ''}
              />
              <SearchData
                data={list}
                page={page}
                totalPages={data?.meta?.total_pages || 1}
                onClick={(newLocation) => {
                  handleClick(newLocation);
                  onClose();
                }}
                setPage={() => setPage((prevState) => prevState + 1)}
              />
            </Popover>
          );
        }}
      >
        <div className="pw-flex pw-items-center pw-border pw-neutral-border pw-rounded-md pw-py-1.5 pw-px-3 pw-cursor-pointer">
          <SearchIcon className="pw-mr-3" />
          <div className={cx('', { 'pw-truncate pw-text-neutral-placeholder': !fullLocation })}>
            {fullLocation || t('placeholder.select_location')}
          </div>
        </div>
      </Whisper>
      <div className="pw-mt-2">
        <TextInput
          name="address"
          value={value?.address || ''}
          onChange={handleChange}
          isForm={false}
          placeholder={t('pos:address_detail') || ''}
        />
      </div>
    </div>
  );
};

export default memo(LocationSelect);
