import { useTranslation } from 'react-i18next';
import { BsPencilFill } from 'react-icons/bs';
import { ActionMenu, MenuItemProps } from '~app/components';
import { FrequentlyQuestionType } from '~app/features/chat-configs/FrequentlyQuestion/utils';
import { ImageCell } from '~app/features/chat-configs/FrequentlyQuestion/components';
// import { useHasPermissions, ProductPermission } from '~app/utils/shield';

const dataMenuAction = (
  rowData: FrequentlyQuestion,
  { canView }: Permission,
  onRowClick: (rowData: FrequentlyQuestion) => void,
): MenuItemProps[] => {
  const { t } = useTranslation('common');

  return [
    ...(canView
      ? [
          {
            title: t('edit'),
            icon: <BsPencilFill className="pw-text-primary-main" />,
            action: () => onRowClick(rowData),
          },
        ]
      : []),
  ];
};

const renderAnswer = (rowData: ExpectedAny) => {
  const { t } = useTranslation('chat');
  switch (rowData.answer_type) {
    case FrequentlyQuestionType.Product:
      return <div className="pw-p-2">{t('product_list')}</div>;
    case FrequentlyQuestionType.Image:
      return <ImageCell rowData={rowData} />;
    default: {
      if (rowData.answer.includes('https://')) {
        return (
          <a href={rowData.answer} target="_blank" className="pw-no-underline" onClick={(e) => e.stopPropagation()}>
            {rowData.answer}
          </a>
        );
      }
      return <div className="pw-p-2">{rowData.answer}</div>;
    }
  }
};

type Props = {
  onRowClick: (rowData: ExpectedAny) => void;
};

export const columnOptions = ({ onRowClick }: Props) => {
  //   const canView = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_VIEW]);
  const canView = true;
  const { t } = useTranslation('chat');

  return {
    message: {
      label: t('question'),
      flexGrow: 1,
    },
    answer: {
      flexGrow: 1,
      label: t('answer'),
      cell: ({ rowData }: { rowData: ExpectedAny }) => {
        return <>{renderAnswer(rowData)}</>;
      },
    },
    ...(canView
      ? {
          action: {
            width: 50,
            label: '',
            cell: ({ rowData }: { rowData: FrequentlyQuestion }) => {
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
                        canView,
                      },
                      onRowClick,
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
