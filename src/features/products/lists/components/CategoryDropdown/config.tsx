import { Button } from 'rsuite';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCategoriesQuery } from '~app/services/queries';
import { ComponentType } from '~app/components/HookForm/utils';

export const config = (submit: ExpectedAny, reset: ExpectedAny, isLoading: boolean, disabled: boolean) => {
  const { t } = useTranslation('common');
  const pickerRef = useRef<ExpectedAny>(null);
  return [
    {
      type: ComponentType.CheckPicker,
      placeholder: t('add-to-category'),
      async: true,
      name: 'category_ids',
      size: 'sm',
      _ref: pickerRef,
      initStateFunc: () => ({
        page: 1,
        page_size: 10,
      }),
      searchKey: 'name',
      menuMaxHeight: 200,
      style: { width: 280 },
      query: useCategoriesQuery,
      renderExtraFooter: () => (
        <div className="pw-p-3 pw-flex pw-gap-2">
          <Button
            onClick={() => {
              reset();
            }}
            appearance="ghost"
            disabled={isLoading || disabled}
            className="pw-w-full pw-font-bold"
          >
            <span className="pw-font-bold"> {t('reset')}</span>
          </Button>
          <Button
            disabled={isLoading || disabled}
            loading={isLoading}
            onClick={async () => {
              await submit();
              pickerRef.current.close();
            }}
            appearance="primary"
            className="pw-w-full"
          >
            <span className="pw-font-bold"> {t('apply')}</span>
          </Button>
        </div>
      ),
      mapFunc: (item: Category) => ({
        label: item.name,
        value: item.id,
      }),
    },
  ];
};
