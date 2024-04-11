import cx from 'classnames';
import { IconButton, Button, Whisper, TagGroup } from 'rsuite';
import { TypeAttributes } from 'rsuite/esm/@types/common';
import { BsFunnel, BsChevronDown } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useImperativeHandle, useEffect, useMemo, useRef, forwardRef } from 'react';
import { Result } from '../Result';
import FilterDataItem from './FilterDataItem';
import { isJsonString } from '~app/utils/helpers';
import FormProvider from '~app/components/HookForm/FormProvider';
import FormLayout from '~app/components/HookForm/FormLayout';
import { formatFilterData } from '~app/components/Filter/utils';

type Props = {
  options: ExpectedAny;
  initValues: ExpectedAny;
  currentFilter: ExpectedAny;
  showFilterData: boolean;
  placement?: TypeAttributes.Placement;
  className?: string;
  onFilter: (values: ExpectedAny) => void;
};

const SecondaryFilter = forwardRef(
  (
    { options, initValues, currentFilter, showFilterData, className, placement = 'autoVertical', onFilter }: Props,
    ref,
  ) => {
    const whisperRef = useRef<ExpectedAny>();

    const { t } = useTranslation('common');
    const methods = useForm<ExpectedAny>({
      defaultValues: initValues || {},
    });

    const { handleSubmit, reset, watch, getValues, setValue } = methods;

    useImperativeHandle(ref, () => ({
      setValue: (name: string, value: ExpectedAny) => setValue(name, value),
    }));

    useEffect(() => {
      if (currentFilter) {
        reset(currentFilter);
      }
    }, [currentFilter]);

    const onSubmit = (data: ExpectedAny) => {
      whisperRef?.current?.close();
      onFilter(data);
    };

    const filterItems = Object.keys(options).map((item: string) => {
      return {
        ...options[item],
        name: item,
      };
    });

    const filterData = getValues();
    const isDirty = JSON.stringify(initValues) !== JSON.stringify(filterData);
    const filterMap = useMemo(() => formatFilterData({ filterData, initValues, options }), [filterData, initValues]);

    const onCloseTag = (data: ExpectedAny, item: ExpectedAny) => {
      const newValue = Array.isArray(filterData[data.key])
        ? data.value.filter((value: ExpectedAny) => value !== item)
        : initValues[data.key];
      const dataFilter = {
        ...filterData,
        [data.key]: newValue,
      };
      reset(dataFilter);
      onSubmit(dataFilter);
    };

    const renderFilterData = useMemo(
      () =>
        filterMap.map((item: ExpectedAny) => {
          const itemFilter = item.value.map((value: ExpectedAny) => {
            const itemData = typeof value === 'string' && isJsonString(value) ? JSON.parse(value) : value;
            return (
              <FilterDataItem
                key={value?.value || value}
                item={item}
                itemData={itemData?.label || value}
                onClose={() => onCloseTag(item, value)}
              />
            );
          });
          return itemFilter;
        }),
      [filterMap],
    );

    return (
      <div className="pw-relative">
        <Whisper
          ref={whisperRef}
          trigger="click"
          placement={placement}
          onExit={() => {
            onSubmit(watch());
          }}
          speaker={
            <div
              id="filter"
              className="pw-absolute pw-mt-1 pw-bg-white pw-shadow-lg pw-z-2000 pw-border pw-border-neutral-50"
            >
              <div className={cx('pw-bg-white pw-w-80', className)}>
                <FormProvider
                  className="pw-divide-neutral-100 pw-divide-y"
                  methods={methods}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="pw-p-3 pw-z-20 pw-flex pw-flex-col pw-gap-4 pww">
                    <FormLayout
                      formSchema={{
                        type: 'container',
                        name: 'form',
                        children: filterItems,
                        className: 'pw-flex pw-flex-col pw-gap-2',
                      }}
                    />
                  </div>
                  <div className="pw-p-3 pw-flex pw-gap-2">
                    <Button
                      type="submit"
                      onClick={() => reset(initValues)}
                      appearance="ghost"
                      className="pw-w-full pw-font-bold"
                    >
                      <span className="pw-font-bold"> {t('reset')}</span>
                    </Button>
                    <Button type="submit" appearance="primary" className="pw-w-full">
                      <span className="pw-font-bold"> {t('apply')}</span>
                    </Button>
                  </div>
                </FormProvider>
              </div>
            </div>
          }
        >
          <IconButton
            size="md"
            className="!pw-bg-transparent"
            icon={
              <div className="pw-relative" id="filter-bar">
                <div className="pw-flex pw-items-center pw-gap-1">
                  {isDirty && (
                    <span className="pw-bg-error-active pw-border pw-z-10 pw-border-white pw-h-2 pw-w-2 pw-rounded-full pw-absolute -pw-top-[2px] pw-right-3"></span>
                  )}
                  <BsFunnel size={20} />
                  <BsChevronDown className="!pw-text-main" size={12} />
                </div>
              </div>
            }
          />
        </Whisper>
        {isDirty && showFilterData && (
          <Result>
            <div className="pw-mt-2">
              <TagGroup className="pw-flex pw-items-center pw-flex-wrap">
                <span className="pw-mt-2 pw-ml-3">{t('current-filter')}:</span> {renderFilterData}
              </TagGroup>
            </div>
          </Result>
        )}
      </div>
    );
  },
);

export default SecondaryFilter;
