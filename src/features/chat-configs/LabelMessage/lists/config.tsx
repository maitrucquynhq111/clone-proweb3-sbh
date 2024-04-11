import { useTranslation } from 'react-i18next';
import { BsPencilFill, BsTrash } from 'react-icons/bs';
import { MdLabel } from 'react-icons/md';
import { ActionMenu, MenuItemProps } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
// import { useHasPermissions, ProductPermission } from '~app/utils/shield';

const dataMenuAction = (
  rowData: Product,
  { canView, canDelete }: Permission,
  onClick: (detail: ExpectedAny, action: string) => void,
): MenuItemProps[] => {
  const { t } = useTranslation('common');

  return [
    ...(canView
      ? [
          {
            title: t('edit'),
            icon: <BsPencilFill className="pw-text-primary-main" />,
            action: () => onClick(rowData, 'edit'),
          },
        ]
      : []),
    ...(canDelete
      ? [
          {
            title: t('delete'),
            icon: <BsTrash />,
            className: 'pw-text-red-500',
            action: () => onClick(rowData, 'delete'),
          },
        ]
      : []),
  ];
};

export const initFilterValues = {
  primary: {
    search: '',
    pageSize: 5,
  },
};

export const filterOptions = () => {
  const { t } = useTranslation('chat');
  return {
    primary: {
      search: {
        type: ComponentType.Text,
        placeholder: t('placeholder.label'),
        defaultValue: '',
        icon: 'search',
        className: '!pw-w-82',
        size: 'lg',
      },
    },
  };
};

type Props = {
  onClick(detail: ExpectedAny, action: string): void;
};

export const columnOptions = ({ onClick }: Props) => {
  //   const canDelete = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_DELETE]);
  //   const canView = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_VIEW]);
  const canDelete = true;
  const canView = true;
  const { t } = useTranslation('chat');

  return {
    color: {
      label: t('common:color'),
      width: 60,
      cell: ({ rowData }: { rowData: ExpectedAny }) => {
        return (
          <div className="pw-w-full pw-p-4" style={{ color: rowData.color }}>
            <MdLabel size={24} />
          </div>
        );
      },
    },
    name: {
      flexGrow: 1,
      label: t('label_name'),
    },
    ...(canView || canDelete
      ? {
          action: {
            width: 50,
            label: '',
            cell: ({ rowData }: { rowData: Product }) => {
              return (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <ActionMenu
                    data={dataMenuAction(
                      rowData,
                      {
                        canDelete,
                        canView,
                      },
                      onClick,
                    )}
                  />
                </div>
              );
            },
          },
        }
      : {}),
  };
};
