import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { BsPencilFill, BsTrash } from 'react-icons/bs';
import { Tag } from 'rsuite';
import { toast } from 'react-toastify';
import { ActionMenu, MenuItemProps } from '~app/components';
import { ModalTypes } from '~app/modals/types';
import { useDeleteProductAddonMutation } from '~app/services/mutations';
import { ComponentType } from '~app/components/HookForm/utils';
import { PRODUCTS_ADDON_KEY } from '~app/services/queries';
import { queryClient } from '~app/configs/client';

export const selectAllAction = (): MenuItemProps[] => {
  const { t } = useTranslation('common');
  return [
    {
      title: t('common:edit'),
      icon: <BsPencilFill className="pw-text-primary-main" />,
      action: () => {
        console.log('');
      },
    },
    {
      title: t('common:delete'),
      icon: <BsTrash />,
      className: 'pw-text-red-500',
      action: async () =>
        new Promise(function (resolve) {
          setTimeout(() => {
            resolve();
          }, 2000);
        }),
      showConfirm: true,
    },
  ];
};

const dataMenuAction = (rowData: ProductAddOn): MenuItemProps[] => {
  const { mutateAsync } = useDeleteProductAddonMutation();
  const { t } = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();

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
      title: t('common:edit'),
      icon: <BsPencilFill className="pw-text-primary-main" />,
      action: () => handleClick(ModalTypes.ProductAddonDetails, rowData.id),
    },
    {
      title: t('common:delete'),
      icon: <BsTrash />,
      className: 'pw-text-red-500',
      action: async () => {
        await mutateAsync({
          id: rowData.id,
        } as ExpectedAny);
        toast.success(t('notification:delete-success'));
        queryClient.invalidateQueries([PRODUCTS_ADDON_KEY], { exact: false });
      },
      showConfirm: true,
    },
  ];
};

export const columnOptions = () => {
  const { t } = useTranslation('products-addon-table');
  return {
    name: {
      label: t('name'),
      width: 300,
      cell: ({ rowData }: { rowData: ProductAddOn }) => {
        return <div className="pw-w-full pw-px-2 pw-text-sm">{rowData.name}</div>;
      },
    },
    description: {
      minWidth: 300,
      flexGrow: 1,
      label: t('description'),
      cell: ({ rowData, dataKey }: { rowData: ExpectedAny; dataKey: string }) => {
        const values = typeof rowData[dataKey] === 'string' ? rowData[dataKey] : '';
        return (
          <div className="pw-w-full pw-p-2 pw-whitespace-pre-line">
            {values.split(';').map((value: string) => {
              return (
                <Tag
                  className="!pw-bg-gray-300 !pw-px-2 !pw-rounded-full !pw-mr-2 !pw-ml-0 !pw-mb-1"
                  key={value}
                  size="sm"
                >
                  {value}
                </Tag>
              );
            })}
          </div>
        );
      },
    },
    count_product: {
      width: 150,
      label: t('count_product'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: ProductAddOn }) => {
        return <div className="pw-w-full pw-px-2 pw-text-sm">{rowData.count_product}</div>;
      },
    },
    action: {
      width: 50,
      label: '',
      cell: ({ rowData }: { rowData: ProductAddOn }) => {
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ActionMenu data={dataMenuAction(rowData)} />
          </div>
        );
      },
    },
  };
};

export const initFilterValues = {
  search: '',
};

export const filterOptions = () => {
  const { t } = useTranslation('filters');
  return {
    primary: {
      search: {
        type: ComponentType.Text,
        placeholder: t('products-addon-table.search'),
        defaultValue: '',
        icon: 'search',
        size: 'lg',
        className: '!pw-w-80',
      },
    },
  };
};
