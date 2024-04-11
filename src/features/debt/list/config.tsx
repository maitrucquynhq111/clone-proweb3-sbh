import { useTranslation } from 'react-i18next';
import { format, isValid, isAfter } from 'date-fns';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { BsCheck2Circle, BsExclamationTriangle, BsDownload, BsPencilFill } from 'react-icons/bs';
import { IconButton, Tooltip, Whisper } from 'rsuite';
import { toast } from 'react-toastify';
import { ActionMenu, MenuItemProps, PriceCell, ContactInfo } from '~app/components';
import { useGetPDFReportCustomerMutation } from '~app/services/mutations';
import { ComponentType } from '~app/components/HookForm/utils';
import { ModalTypes, ModalPlacement, ModalSize } from '~app/modals/types';
import { createDownloadElement } from '~app/utils/helpers';

const dataMenuAction = (rowData: Contact): MenuItemProps[] => {
  const { mutateAsync, isLoading } = useGetPDFReportCustomerMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const handleClick = (name: string, id: string) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: name,
        id: id,
      })}`,
    });
  };

  return [
    {
      title: t('download-report'),
      icon: <BsDownload size={16} />,
      action: async () => {
        if (!isLoading) {
          const response = await mutateAsync({
            contactId: rowData.id,
          } as ExpectedAny);
          if (response) {
            createDownloadElement(response);
            toast.success(t('notification:download-success'));
          }
        }
      },
    },
    {
      title: t('edit'),
      icon: <BsPencilFill className="pw-text-primary-main" />,
      action: () => handleClick(ModalTypes.ContactDetails, rowData.id),
    },
  ];
};

export const columnOptions = () => {
  const { t } = useTranslation('debt-table');
  const location = useLocation();
  const navigate = useNavigate();
  return {
    business_id: {
      flexGrow: 1,
      minWidth: 180,
      label: t('customer-name'),
      cell: ({ rowData }: { rowData: Contact; dataKey: string }) => {
        return (
          <div className="pw-py-3 pw-flex pw-items-center pw-text-left pw-h-full pw-w-full pw-px-4">
            <ContactInfo
              avatar={rowData.avatar}
              title={rowData.name}
              className="pw-justify-between pw-items-center"
              titleClassName="pw-text-sm"
              subTitleClassName="!pw-text-2sm"
              subTitle={rowData.phone_number}
            />
          </div>
        );
      },
    },
    total_in: {
      width: 150,
      label: t('must-spent'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        const isIn = rowData['option'] === 'in';
        return (
          <div className="pw-text-right pw-text-sm pw-text-red-600 pw-flex pw-items-center pw-w-full pw-font-semibold pw-py-3 pw-h-full">
            {isIn ? <PriceCell value={Math.abs(rowData['debt_amount'])} /> : ''}
          </div>
        );
      },
    },
    total_out: {
      width: 150,
      label: t('must-receive'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: ExpectedAny; dataKey: string }) => {
        const isOut = rowData['option'] === 'out';
        return (
          <div className="pw-text-right pw-text-sm pw-text-green-600 pw-flex pw-items-center pw-w-full pw-font-semibold pw-py-3 pw-h-full">
            {isOut ? <PriceCell value={Math.abs(rowData['debt_amount'])} /> : ''}
          </div>
        );
      },
    },
    reminder_day: {
      width: 150,
      label: t('date'),
      align: 'left',
      cell: ({ rowData, dataKey }: { rowData: ExpectedAny; dataKey: string }) => {
        const value = rowData?.[dataKey] || null;
        return (
          <div className="pw-w-full pw-flex pw-items-center pw-gap-2 pw-p-3 pw-h-full pw-justify-start">
            {value && isValid(new Date(value)) && (
              <>
                <span className="pw-text-sm">{format(new Date(value), 'dd/MM/yyyy')}</span>
                {isAfter(new Date(), new Date(value)) && <BsExclamationTriangle color="red" />}
              </>
            )}
          </div>
        );
      },
    },
    action: {
      width: 80,
      label: '',
      cell: ({ rowData }: { rowData: Contact }) => {
        const handleClick = (name: string) => {
          navigate({
            pathname: location.pathname,
            search: `?${createSearchParams({
              modal: name,
              placement: ModalPlacement.Right,
              size: ModalSize.Xsmall,
              option: rowData?.option || '',
              id: rowData?.id || '',
            })}`,
          });
        };

        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="pw-flex pw-items-center pw-justify-center"
          >
            <Whisper placement="top" trigger="hover" speaker={<Tooltip>{t('payment')}</Tooltip>}>
              <IconButton
                onClick={() => handleClick(ModalTypes.DebtCreatePayment)}
                size="xs"
                appearance="subtle"
                icon={<BsCheck2Circle size={18} color="green" />}
              />
            </Whisper>
            <ActionMenu data={dataMenuAction(rowData)} />
          </div>
        );
      },
    },
  };
};

export type ConverFilterType = {
  options: string[];
  sort: string;
};

export const convertFilter = (props: ConverFilterType) => {
  const { options = [], sort, ...rest } = props;
  return {
    ...rest,
    options: options.map((item) => {
      return JSON.parse(item).value;
    }),
    sort: (sort && JSON.parse(sort).value) || '{}',
  };
};

export const initFilterValues = {
  primary: {
    search: '',
    option: 'have_transaction',
  },
  secondary: {
    options: [],
    sort: JSON.stringify({
      label: '',
      value: 'latest_sync_time desc',
    }),
  },
};

export const filterOptions = () => {
  const { t } = useTranslation('filters');
  return {
    primary: {
      search: {
        type: ComponentType.Text,
        placeholder: t('debt-table.search'),
        defaultValue: '',
        icon: 'search',
        size: 'lg',
        className: '!pw-w-60',
      },
    },
    secondary: {
      options: {
        type: ComponentType.CheckPicker,
        placeholder: t('debt-table.options'),
        label: t('debt-table.options'),
        menuMaxHeight: 200,
        container: () => document.getElementById('filter'),
        searchable: false,
        size: 'lg',
        defaultValue: initFilterValues.secondary.options,
        data: [
          {
            label: t('debt-table.options-values.in'),
            value: JSON.stringify({
              label: t('debt-table.options-values.in'),
              value: 'in',
            }),
          },
          {
            label: t('debt-table.options-values.out'),
            value: JSON.stringify({
              label: t('debt-table.options-values.out'),
              value: 'out',
            }),
          },
          {
            label: t('debt-table.options-values.debt_reminder'),
            value: JSON.stringify({
              label: t('debt-table.options-values.debt_reminder'),
              value: 'debt_reminder',
            }),
          },
          {
            label: t('debt-table.options-values.no_debt_reminder'),
            value: JSON.stringify({
              label: t('debt-table.options-values.no_debt_reminder'),
              value: 'no_debt_reminder',
            }),
          },
        ],
      },
      sort: {
        type: ComponentType.SelectPicker,
        placeholder: t('debt-table.sort'),
        label: t('debt-table.sort'),
        menuMaxHeight: 200,
        searchable: false,
        container: () => document.getElementById('filter'),
        size: 'lg',
        defaultValue: initFilterValues.secondary.sort,
        data: [
          {
            label: t('debt-table.sort-values.sort_transaction_new'),
            value: JSON.stringify({
              label: t('debt-table.sort-values.sort_transaction_new'),
              value: 'sort_transaction_new',
            }),
          },
          {
            label: t('debt-table.sort-values.sort_transaction_old'),
            value: JSON.stringify({
              label: t('debt-table.sort-values.sort_transaction_old'),
              value: 'sort_transaction_old',
            }),
          },
          {
            label: t('debt-table.sort-values.amount'),
            value: JSON.stringify({
              label: t('debt-table.sort-values.amount'),
              value: 'amount desc',
            }),
          },
          {
            label: t('debt-table.sort-values.az'),
            value: JSON.stringify({
              label: t('debt-table.sort-values.az'),
              value: 'a-z',
            }),
          },
        ],
      },
    },
  };
};
