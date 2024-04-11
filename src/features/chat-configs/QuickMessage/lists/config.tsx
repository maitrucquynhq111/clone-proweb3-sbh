import { useTranslation } from 'react-i18next';
import { BsPencilFill, BsTrash } from 'react-icons/bs';
import { ActionMenu, MenuItemProps, PlaceholderImage } from '~app/components';
// import { useHasPermissions, ProductPermission } from '~app/utils/shield';

const dataMenuAction = (
  rowData: QuickMessageResponse,
  { canView, canDelete }: Permission,
  onClick: (rowData: QuickMessageResponse, action: string) => void,
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

type Props = {
  onClick: (rowData: ExpectedAny, action: string) => void;
  t: ExpectedAny;
};

export const columnsOptions = ({ onClick, t }: Props) => {
  const canView = true;
  const canDelete = true;
  return [
    {
      key: 'shortcut',
      name: 'shortcut',
      label: t('shortcut_key'),
      flexGrow: 0.5,
      cell: ({ rowData }: { rowData: ExpectedAny }) => {
        return (
          <div
            className="pw-bg-info-background pw-w-fit pw-rounded pw-py-0.5 pw-px-1 pw-mx-3 line-clamp-1 pw-cursor-pointer"
            onClick={() => onClick(rowData, 'edit')}
          >
            /{rowData.shortcut}
          </div>
        );
      },
    },
    {
      key: 'shortcut',
      name: 'shortcut',
      label: t('content'),
      flexGrow: 1,
      cell: ({ rowData }: { rowData: ExpectedAny }) => {
        return (
          <div className="pw-mx-3 line-clamp-1 pw-cursor-pointer" onClick={() => onClick(rowData, 'edit')}>
            {rowData.message}
          </div>
        );
      },
    },
    {
      key: 'shortcut',
      name: 'shortcut',
      width: 70,
      label: t('image_shorten'),
      cell: ({ rowData }: { rowData: ExpectedAny }) => {
        return (
          <div className="pw-flex pw-justify-center pw-cursor-pointer" onClick={() => onClick(rowData, 'edit')}>
            {!rowData.images || rowData.images.length === 0 ? (
              '-'
            ) : (
              <PlaceholderImage
                className="pw-bg-cover pw-rounded !pw-w-10 pw-h-10 pw-object-cover"
                src={rowData.images?.[0]}
                alt={rowData.shortcut}
              />
            )}
          </div>
        );
      },
    },
    {
      key: 'action',
      name: 'action',
      width: 50,
      label: '',
      cell: ({ rowData }: { rowData: QuickMessageResponse }) => {
        return (
          <div
            className="pw-flex pw-justify-center"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ActionMenu
              data={dataMenuAction(
                rowData,
                {
                  canView,
                  canDelete,
                },
                onClick,
              )}
            />
          </div>
        );
      },
    },
  ];
};
