import { memo, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill, BsChevronDown } from 'react-icons/bs';
import { Button, Drawer, Popover, Whisper, Placeholder } from 'rsuite';
import { useNetworkState } from 'react-use';
import { ContactInfo, DebouncedInput } from '~app/components';
import ContactCreate from '~app/features/contacts/create';
import { ModalPlacement, ModalSize } from '~app/modals';
import TextInput from '~app/components/FormControls/Input/TextInput';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
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

const ContactList = ({
  name,
  labelName,
  placeholder,
  query,
  label,
  labelKey,
  valueKey,
  searchKey,
  initStateFunc,
  onChange,
  isRequired,
}: ExpectedAny) => {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const [list, setList] = useState<Contact[]>([]);
  const { online } = useNetworkState();
  const { setValue, control } = useFormContext();
  const selectedValue = useWatch({
    control,
    name,
    defaultValue: '',
  }) as string;
  const [openCreate, setOpenCreate] = useState(false);
  const [search, setSearch] = useState('');

  const { data, total_page, isLoading } = useDataQuery({
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

  const next = useCallback(() => {
    setPage((prevState) => prevState + 1);
  }, []);

  const handleClick = (data: ExpectedAny) => {
    setValue(name, data.value);
    setValue(labelName, data.label);
    onChange && onChange(data);
  };

  useEffect(() => {
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...(data || [])], 'id'));
    } else {
      setList(data || []);
    }
  }, [data, page]);

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ fieldState: { error } }) => (
          <Whisper
            placement="autoVerticalEnd"
            trigger="click"
            onOpen={() => setPage(1)}
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
                      contentRef?.current?.scroll({ top: 0 });
                      setSearch(value);
                    }}
                    placeholder={placeholder}
                  />

                  <div ref={contentRef} className="dynamic-radio-select pw-max-h-96 pw-min-w-full pw-overflow-auto">
                    <InfiniteScroll next={next} hasMore={!isLastPage}>
                      <div className="custom-radio-group pw-flex pw-flex-col">
                        {online && (
                          <Button
                            className="!pw-text-blue-600 !pw-font-bold pw-w-full !pw-justify-start !pw-rounded-none"
                            appearance="subtle"
                            startIcon={<BsPlusCircleFill size={24} />}
                            onClick={() => {
                              onClose();
                              setOpenCreate(true);
                            }}
                          >
                            {`${t('common:create_new')} ${search ? `"${search}"` : ''}`}
                          </Button>
                        )}
                        {list.map((contact) => (
                          <ContactInfo
                            key={contact.id}
                            className="pw-p-3 pw-gap-x-4 pw-cursor-pointer pw-justify-between pw-items-center"
                            avatar={contact.avatar}
                            title={contact.name}
                            titleClassName="pw-text-base pw-font-normal pw-text-black"
                            subTitle={contact.phone_number}
                            subTitleClassName="pw-text-sm pw-font-normal"
                            selected={selectedValue === contact.id}
                            onClick={() => {
                              handleClick(contact);
                              onClose();
                            }}
                          />
                        ))}
                        {list.length === 0 ? (
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
                  {/* <div className="pw-overflow-auto pw-max-h-80"></div> */}
                </Popover>
              );
            }}
          >
            <div className="!pw-max-w-full">
              <TextInput
                name={labelName}
                label={label}
                readOnly
                isRequired={isRequired}
                placeholder={placeholder}
                transparentIcon={true}
                PrefixIcon={<BsChevronDown />}
              />
              {error && <p className="pw-text-error-active pw-text-xs pw-font-semibold pw-pt-1">{error.message}</p>}
            </div>
          </Whisper>
        )}
      />
      {openCreate && (
        <Drawer
          backdrop="static"
          keyboard={false}
          placement={ModalPlacement.Right}
          size={ModalSize.Small}
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          className="pw-h-screen"
        >
          <ContactCreate
            onSuccess={(contact) => {
              handleClick(contact);
            }}
            onClose={() => setOpenCreate(false)}
            contactNameDefault={search}
          />
        </Drawer>
      )}
    </>
  );
};

export default memo(ContactList);

const Skeleton = () => (
  <div className="pw-ml-3 pw-mr-5 pw-mb-2">
    <Placeholder.Graph active className="pw-rounded" height={60} />
    <Placeholder.Graph active className="pw-rounded" height={60} />
    <Placeholder.Graph active className="pw-rounded" height={60} />
    <Placeholder.Graph active className="pw-rounded" height={60} />
  </div>
);
