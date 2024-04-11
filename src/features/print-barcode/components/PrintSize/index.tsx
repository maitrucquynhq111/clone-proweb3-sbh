import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'rsuite';
import cx from 'classnames';
import { SlArrowRight } from 'react-icons/sl';
import SampleItem from './SampleItem';
import { configPrintData, configPrintSize } from './config';
import { useSelectedSku } from '~app/features/print-barcode/hook';

const PrintSize = () => {
  const { t } = useTranslation('barcode');
  const [store, setStore] = useSelectedSku((store: ExpectedAny) => store);
  const [setting, setSetting] = useState<BarcodePrintingSetting>({
    pageSize: '',
    size: '',
    options: configPrintData,
  });

  const choosePageSize = (pageSize: string) => {
    setSetting((prevState) => {
      setStore((store) => ({ ...store, settings: { ...store.settings, pageSize, size: '' } }));
      return { ...prevState, pageSize, size: '' };
    });
  };

  const chooseSize = (size: string) => {
    setSetting((prevState) => {
      setStore((store) => ({ ...store, settings: { ...store.settings, size } }));
      return { ...prevState, size };
    });
  };

  const updateConfigOptions = (dataId: string, value: boolean) => {
    setSetting((prevState) => {
      const { options } = prevState;
      const indexOption = options.findIndex((item) => item.id === dataId);
      if (indexOption === -1) return prevState;
      options[indexOption]!.value = value;
      setStore((store) => ({ ...store, settings: { ...store.settings, options } }));
      return { ...prevState, options };
    });
  };

  return (
    <div className="pw-h-full pw-overflow-auto pw-grid pw-grid-cols-1 lg:pw-grid-cols-3 pw-gap-4">
      <div className="pw-flex pw-flex-col pw-border-r-8 pw-border-neutral-background pw-pr-4">
        <span className="pw-text-base pw-font-bold pw-mb-4">{t('select_paper_size')}</span>
        {Object.keys(configPrintSize).map((pageSize) => {
          return (
            <div
              key={pageSize}
              onClick={() => choosePageSize(pageSize)}
              className={cx(
                'pw-flex pw-justify-between pw-items-center pw-p-3 pw-pl-6 hover:pw-bg-gray-50 pw-cursor-pointer pw-rounded',
                {
                  'pw-bg-green-600 hover:pw-bg-green-700 pw-text-white': setting.pageSize === pageSize,
                },
              )}
            >
              <span className="pw-overflow-hidden pw-text-base pw-text-ellipsis line-clamp-1">
                {t(`print_size.${pageSize}`)}
              </span>
              <SlArrowRight
                className={cx('pw-text-neutral-primary', {
                  ' pw-text-white': setting.pageSize === pageSize,
                })}
                size={13}
              />
            </div>
          );
        })}
      </div>
      <div className="pw-flex pw-flex-col pw-border-r-8 pw-border-neutral-background pw-pr-4">
        {configPrintSize[setting.pageSize] ? (
          <>
            <span className="pw-text-base pw-font-bold pw-mb-4">{t('select_size_quantity')}</span>
            {Object.keys(configPrintSize[setting.pageSize]).map((size: string) => {
              return (
                <div
                  key={size}
                  onClick={() => chooseSize(size)}
                  className={cx('pw-p-3 pw-pl-6 hover:pw-bg-gray-50 pw-cursor-pointer pw-rounded', {
                    'pw-bg-green-600 hover:pw-bg-green-700 pw-text-white': setting.size === size,
                  })}
                >
                  <span className="pw-overflow-hidden pw-text-base pw-text-ellipsis line-clamp-1">
                    {t(`print_size.${size}`)}
                  </span>
                </div>
              );
            })}
          </>
        ) : null}
      </div>
      {setting.pageSize && setting.size && (
        <div className="pw-flex pw-flex-col">
          <span className="pw-text-base pw-font-bold pw-mb-4">{t('select_size_quantity')}</span>
          <div className="pw-flex pw-justify-between">
            <div className="pw-flex pw-flex-col">
              {setting.options.map((data: ExpectedAny) => {
                return (
                  <Checkbox
                    key={data.id}
                    onChange={(_, checked: boolean) => {
                      updateConfigOptions(data.id, checked);
                    }}
                    checked={data.value}
                    className="pw-overflow-hidden pw-text-base pw-text-ellipsis line-clamp-1"
                  >
                    {t(`print_size.${data.id}`)}
                  </Checkbox>
                );
              })}
            </div>
            <SampleItem setting={setting} sku={store.selected_list.length > 0 ? store.selected_list[0] : undefined} />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(PrintSize);
