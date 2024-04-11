import { useMemo, memo, useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import { Controller, useFormContext } from 'react-hook-form';
import { SelectPicker } from 'rsuite';
import { DynamicSelectPickerProps } from '~app/components/FormControls/SelectPicker/types';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';

const useDataQuery = ({ query, mapFunc, initStateFunc }: ExpectedAny) => {
  const { isLoading, data, queryKey, refetch } = query(initStateFunc());

  const memoizedData = useMemo(() => {
    if (data?.data) return data?.data.map(mapFunc) as Array<ExpectedAny>;
    return [] as Array<ExpectedAny>;
  }, [data]);

  return {
    data: memoizedData,
    isLoading,
    queryKey,
    refetch,
  };
};

const DynamicSelectPicker = ({
  name,
  query,
  searchKey = '',
  initStateFunc,
  mapFunc,
  mutateAsync,
  ...props
}: DynamicSelectPickerProps) => {
  const { control } = useFormContext();
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [list, setList] = useState<ExpectedAny[]>([]);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');

  useDebounce(
    () => {
      setDebouncedSearchValue(searchValue);
      setPage(1);
    },
    300,
    [searchValue],
  );

  const { data, isLoading } = useDataQuery({
    query,
    mapFunc,
    initStateFunc: () => ({
      ...initStateFunc(),
      page,
      [searchKey]: debouncedSearchValue,
    }),
  });

  useEffect(() => {
    setList((prevState) => removeDuplicates([...prevState, ...data], 'value'));
  }, [data]);

  const loadMore = () => {
    if (data.length > 0) {
      setPage(page + 1);
    }
  };

  const onItemsRendered = (props: ExpectedAny) => {
    if (props.visibleStopIndex >= list.length - 1) {
      loadMore();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <SelectPicker
          {...field}
          {...props}
          loading={isLoading}
          data={list}
          block
          ref={props._ref}
          virtualized
          listProps={{ onItemsRendered }}
          // onChange={(value) => setValue(name, value)}
          onSearch={(value) => {
            setSearchValue(value);
          }}
        />
      )}
    />
  );
};

export default memo(DynamicSelectPicker);
