import { useCallback, useEffect, useMemo, useState, Fragment } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BsPlus } from 'react-icons/bs';
import { Button, Placeholder } from 'rsuite';
import RadioPickerItem from './RadioPickerItem';
import { DynamicRadioSelectProps } from './type';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
import DebouncedInput from '~app/components/FormControls/Input/DebouncedInput';
import { NoDataImage } from '~app/components/Icons';
import InfiniteScroll from '~app/components/InfiniteScroll';

const useDataQuery = ({ query, labelKey, valueKey, initStateFunc }: ExpectedAny) => {
  const { isLoading, isFetching, data, queryKey, refetch } = query(initStateFunc());

  const memoizedData = useMemo(() => {
    if (data?.data)
      return data.data.map((item: ExpectedAny) => ({
        ...item,
        label: item[labelKey] || '',
        value: item[valueKey] || '',
      })) as Array<ExpectedAny>;
    return [] as Array<ExpectedAny>;
  }, [data]);

  const total_page = useMemo(() => {
    if (data?.meta) return data.meta.total_pages as number;
    return 0;
  }, [data]);

  return {
    data: memoizedData,
    total_page,
    isFetching,
    isLoading,
    queryKey,
    refetch,
  };
};

const DynamicRadioPicker = ({
  name,
  query,
  labelKey,
  valueKey,
  initStateFunc,
  createText,
  labelName,
  searchKey = '',
  searchable = false,
  creatable = false,
  placeholder,
  onClose,
  onChange,
  createComponent,
  createButton,
  customRadioItem,
}: DynamicRadioSelectProps) => {
  const { t } = useTranslation('common');
  const { setValue, control } = useFormContext();
  const selectedValue = useWatch({
    control,
    name,
    defaultValue: '',
  }) as string;

  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [page, setPage] = useState(1);
  const [list, setList] = useState<ExpectedAny[]>([]);
  const [search, setSearch] = useState('');

  const { data, queryKey, total_page, isLoading } = useDataQuery({
    query,
    labelKey,
    valueKey,
    initStateFunc: () => ({
      ...initStateFunc(),
      page,
      [searchKey]: search,
    }),
  });

  const isLastPage = useMemo(() => {
    return page >= total_page;
  }, [total_page, page]);

  const handleChange = (data: ExpectedAny) => {
    setValue(name, data.value);
    setValue(labelName, data.label);
    onChange && onChange(data);
    onClose && onClose();
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const next = useCallback(() => {
    setPage((prevState) => prevState + 1);
  }, []);

  useEffect(() => {
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...data], 'value'));
    } else {
      setList(data);
    }
  }, [data]);

  const CreateComponent = createComponent ? createComponent : null;
  const CreateButton = createButton ? createButton : null;
  const CustomRadioItem = customRadioItem ? customRadioItem : null;

  return (
    <>
      {openCreatePopup && CreateComponent ? (
        <CreateComponent
          queryKey={queryKey}
          onClose={() => {
            setOpenCreatePopup(false);
          }}
        />
      ) : (
        <>
          {searchable ? (
            <div className="custom-radio pw-flex pw-px-4 pw-py-3 pw-items-center pw-justify-between">
              <DebouncedInput
                value={search}
                icon="search"
                placeholder={placeholder}
                className="pw-w-full"
                onChange={handleSearchChange}
              />
            </div>
          ) : null}
          <div className="dynamic-radio-select pw-max-h-96 pw-min-w-full pw-overflow-auto">
            <InfiniteScroll next={next} hasMore={!isLastPage}>
              <div className="custom-radio-group pw-flex pw-flex-col">
                {creatable ? (
                  <>
                    {CreateButton ? (
                      <>
                        {list.length === 0 && (
                          <div className="pw-px-4">
                            <CreateButton search={search} onChange={onChange} onClose={onClose} />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="custom-radio pw-flex pw-px-4 pw-py-3 pw-items-center pw-justify-between">
                        <Button
                          appearance="ghost"
                          type="button"
                          block
                          size="sm"
                          className="!pw-flex !pw-items-center !pw-gap-x-2 !pw-justify-center"
                          onClick={() => {
                            if (!creatable || !CreateComponent) return;
                            setOpenCreatePopup(true);
                          }}
                        >
                          <BsPlus className="pw-w-5 pw-h-5" />
                          <span className="pw-font-bold pw-text-sm">{createText || ''}</span>
                        </Button>
                      </div>
                    )}
                  </>
                ) : null}
                {list.map((item) => {
                  const checked = selectedValue === item.value;
                  return (
                    <Fragment key={item.value}>
                      {CustomRadioItem ? (
                        <CustomRadioItem item={item} checked={checked} onChange={handleChange} />
                      ) : (
                        <RadioPickerItem item={item} checked={checked} onChange={handleChange} />
                      )}
                    </Fragment>
                  );
                })}
                {list.length === 0 && !isLoading ? (
                  <>
                    <div className="pw-py-3 pw-flex pw-flex-col pw-items-center pw-justify-center">
                      <NoDataImage />
                      <div className="pw-text-base">{t('common:no-data')}</div>
                    </div>
                  </>
                ) : null}
                {isLoading ? <Skeleton /> : null}
              </div>
            </InfiniteScroll>
          </div>
        </>
      )}
    </>
  );
};

export default DynamicRadioPicker;

const Skeleton = () => (
  <div className="pw-ml-3 pw-mr-5 pw-mb-2">
    <Placeholder.Graph active className="pw-rounded" height={60} />
    <Placeholder.Graph active className="pw-rounded" height={60} />
    <Placeholder.Graph active className="pw-rounded" height={60} />
    <Placeholder.Graph active className="pw-rounded" height={60} />
  </div>
);
