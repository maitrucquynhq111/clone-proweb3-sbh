import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'react-use';
import { SelectPicker } from 'rsuite';
import { MdLabel } from 'react-icons/md';
import { Controller, useFormContext } from 'react-hook-form';
import { useGetLabelMessageQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';

type Props = {
  name: string;
  className?: string;
  excludedLabels?: ExpectedAny;
};

const LabelPicker = ({ name, excludedLabels, className }: Props) => {
  const { t } = useTranslation('chat');
  const { control, setValue, clearErrors } = useFormContext();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setSebouncedSearch] = useState('');
  const [originLabels, setOriginLabels] = useState<Label[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);

  const { data } = useGetLabelMessageQuery({
    page,
    pageSize: 10,
    search: debouncedSearch,
  });

  const loadMore = () => {
    if (data?.data && data?.data?.length > 0) setPage((prevState) => prevState + 1);
  };

  const onItemsRendered = (props: ExpectedAny) => {
    if (props.visibleStopIndex >= labels.length - 1) loadMore();
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleSelect = (value: ExpectedAny) => {
    const label = labels.find((item) => item.id === value);
    setValue(name, label || null);
    if (label) clearErrors(name);
  };

  useDebounce(
    () => {
      setSebouncedSearch(search);
      setPage(1);
    },
    300,
    [search],
  );

  useEffect(() => {
    if (data?.data) {
      setOriginLabels((prevState) => removeDuplicates([...prevState, ...data.data], 'id'));
    }
  }, [data]);

  useEffect(() => {
    const labels = originLabels.filter(
      (item) => !excludedLabels?.some((excludedLabel: ExpectedAny) => excludedLabel?.label?.id === item?.id),
    );
    setLabels(labels);
  }, [originLabels, excludedLabels]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cx('!pw-max-w-full', className)}>
          <SelectPicker
            block
            virtualized
            data={labels}
            value={field?.value?.id || null}
            labelKey="name"
            valueKey="id"
            onSearch={handleSearch}
            onChange={handleSelect}
            listProps={{ onItemsRendered }}
            placeholder={t('placeholder.unselect_label')}
            locale={{
              searchPlaceholder: t('placeholder.label') || '',
            }}
            renderMenuItem={(label, item) => {
              return (
                <div className="pw-flex pw-items-center pw-justify-between ">
                  <div className="pw-flex pw-items-center pw-gap-x-2">
                    <div className="pw-min-w-fit">
                      <MdLabel size={24} color={item.color} />
                    </div>
                    <span className="pw-text-base line-clamp-1">{label}</span>
                  </div>
                  <div className="pw-wrapper-custom-radio_green">
                    <input checked={item.id === field?.value?.id} type="radio" readOnly />
                    <span className="pw-checkmark-custom-radio_green"></span>
                  </div>
                </div>
              );
            }}
            renderValue={() => {
              return (
                <div className="pw-flex pw-items-center pw-gap-x-2 pw-py-0.5 pw-px-2 pw-bg-neutral-divider pw-w-max pw-rounded">
                  <div className="pw-min-w-fit">
                    <MdLabel size={20} color={field?.value?.color} />
                  </div>
                  <span className="pw-text-sm pw-text-neutral-primary line-clamp-1">{field?.value?.name}</span>
                </div>
              );
            }}
          />
          {error && <p className="pw-text-error-active pw-text-xs pw-font-semibold pw-pt-1">{error.message}</p>}
        </div>
      )}
    />
  );
};

export default LabelPicker;
