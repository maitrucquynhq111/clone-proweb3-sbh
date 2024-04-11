import { useMemo, memo, useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'react-use';
import { Controller, useFormContext } from 'react-hook-form';
import { Placeholder, TagPicker } from 'rsuite';
import { DynamicTagPickerProps } from '~app/components/FormControls/TagPicker/types';
import { queryClient } from '~app/configs/client';
import { removeDuplicates, removeItemString } from '~app/utils/helpers/arrayHelpers';

const useDataQuery = ({ query, mapFunc, initStateFunc }: ExpectedAny) => {
  const { isLoading, data, queryKey, refetch } = query(initStateFunc());

  const memoizedData = useMemo(() => {
    if (data?.data) return data.data.map(mapFunc) as Array<ExpectedAny>;
    return [] as Array<ExpectedAny>;
  }, [data]);

  const total_page = useMemo(() => {
    if (data?.meta) return data.meta.total_pages as number;
    return 0;
  }, [data]);

  return {
    data: memoizedData,
    total_page,
    isLoading,
    queryKey,
    refetch,
  };
};

const DynamicTagPicker = ({
  name,
  query,
  searchKey = '',
  createKey = '',
  initStateFunc,
  mapFunc,
  mutateAsync,
  label,
  renderMenuItem,
  ...props
}: DynamicTagPickerProps) => {
  const { control, setValue, getValues } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [list, setList] = useState<ExpectedAny[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');

  useDebounce(
    () => {
      setDebouncedSearchValue(searchValue);
      setPage(1);
    },
    300,
    [searchValue],
  );

  const { data, queryKey, total_page } = useDataQuery({
    query,
    mapFunc,
    initStateFunc: () => ({
      ...initStateFunc(),
      page,
      [searchKey]: debouncedSearchValue,
    }),
  });

  const handleCreate = async (value: string[]) => {
    try {
      if (!value?.[0] || !createKey) return;
      const response = await mutateAsync({ [createKey]: value[value.length - 1] });
      if (response) {
        setSearchValue('');
        queryClient.invalidateQueries(queryKey);
      }
    } catch (_) {
      //  TO DO
      setSearchValue('');
      // Remove error data
      const newData = removeItemString(getValues(name), value[value.length - 1] || '');
      setValue(name, newData);
    }
  };

  const renderMenu = (menu: ExpectedAny) => {
    return (
      <>
        {menu}
        {loading && <Skeleton />}
      </>
    );
  };

  const isLastPage = useMemo(() => {
    return page >= total_page;
  }, [total_page, page]);

  const handleScroll: EventListener = useCallback(
    (event: ExpectedAny) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      if (scrollTop + clientHeight >= scrollHeight && isLastPage === false) {
        setLoading(true);
        setTimeout(() => {
          setPage((prevState) => prevState + 1);
          setLoading(false);
        }, 1000);
      }
    },
    [isLastPage],
  );

  useEffect(() => {
    if (debouncedSearchValue) {
      setList(data);
    } else {
      setList((prevState) => removeDuplicates([...prevState, ...data], 'value'));
    }
  }, [data]);

  useEffect(() => {
    const ele = document.querySelector('.rs-picker-check-menu') as HTMLDivElement;
    if (!ele) return;
    ele.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      ele.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, data, handleScroll]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TagPicker
          {...field}
          {...props}
          data={list}
          placement="autoVertical"
          placeholder={props.placeholder}
          block
          creatable={props.creatable || false}
          renderMenu={renderMenu}
          renderMenuItem={renderMenuItem}
          onChange={(value) => setValue(name, value)}
          onSearch={(value) => {
            setSearchValue(value);
          }}
          onCreate={(value) => {
            handleCreate(value);
          }}
          onOpen={() => {
            setIsOpen(true);
          }}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      )}
    />
  );
};

export default memo(DynamicTagPicker);

const Skeleton = () => (
  <div className="pw-flex pw-items-center pw-ml-3 pw-mr-5 pw-mb-2">
    <Placeholder.Graph className="pw-rounded pw-mr-2" active width={18} height={18} />
    <Placeholder.Graph active className="pw-rounded" height={18} />
  </div>
);
