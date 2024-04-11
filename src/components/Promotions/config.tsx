import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Radio, Tooltip, Whisper } from 'rsuite';
import { BsExclamationTriangle } from 'react-icons/bs';
import cx from 'classnames';
import PromotionTable from './PromotionTable';
import EmptyState from '~app/components/EmptyState';
import { ComponentType } from '~app/components/HookForm/utils';
import { formatDescriptionPromotion } from '~app/features/pos/utils';
import { numberFormat } from '~app/configs';
import { EmptyStatePromotion } from '~app/components/Icons';

export const promotionsInitStateFunc = () => ({
  page: 1,
  page_size: 20,
  enabled: true,
});

export const promotionYupSchema = () => {
  return yup.object().shape({});
};

type FormSchemaProps = {
  data: SelectedPromotion[];
  search: string;
  selectedPromotion: SelectedPromotion | null;
  setSelectedPromotion(value: SelectedPromotion): void;
  setSearch(value: string): void;
  handleClick(): void;
};

export const promotionFormSchema = ({
  data,
  search,
  selectedPromotion,
  setSelectedPromotion,
  setSearch,
  handleClick,
}: FormSchemaProps) => {
  const { t } = useTranslation('pos');
  const searchElement = {
    className: 'pw-grid pw-grid-cols-2',
    type: 'block',
    name: 'first-block',
    children: [
      {
        className: 'pw-grid-cols-12',
        type: ComponentType.DebounceText,
        name: 'search',
        placeholder: t('placeholder.promotion'),
        icon: 'search',
        onChange: (value: string) => setSearch(value),
      },
    ],
  };
  let content: ExpectedAny = [
    {
      className: ``,
      type: 'block',
      name: 'first-block',
      children: [
        {
          type: ComponentType.Custom,
          isSearch: !!search,
          icon: <EmptyStatePromotion />,
          description1: t('empty_promotion'),
          textBtn: t('create_promotion'),
          onClick: handleClick,
          component: EmptyState,
        },
      ],
    },
  ];

  if (search && data.length === 0) {
    content = [
      searchElement,
      {
        type: ComponentType.Custom,
        isSearch: !!search,
        description1: `${t('error.no_search_result')} "${search}".`,
        description2: t('do_create_promotion'),
        textBtn: t('create_promotion'),
        onClick: handleClick,
        component: EmptyState,
      },
    ];
  }

  if (data.length > 0) {
    content = [
      searchElement,
      {
        blockClassName: 'pw-mt-4',
        type: 'block',
        name: 'customer-block',
        children: [
          {
            type: ComponentType.Custom,
            name: 'promotion',
            data,
            selectedPromotion,
            setSelectedPromotion,
            component: PromotionTable,
          },
        ],
      },
    ];
  }
  return {
    type: 'container',
    name: 'form',
    children: content,
  };
};

type ConfigParams = {
  t: ExpectedAny;
  onChange(value: Promotion): void;
};

export const promotionColumnsConfig = ({ t, onChange }: ConfigParams) => {
  return [
    {
      key: 'action',
      name: 'action',
      label: '',
      align: 'center',
      width: 56,
      cell: (props: ExpectedAny) => {
        const { rowData } = props;
        return (
          <div
            className="pw-h-full pw-flex pw-items-center pw-justify-center pw-cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              if (!rowData.valid) return;
              onChange(rowData);
            }}
          >
            <Radio
              disabled={!rowData.valid}
              checked={rowData.selected}
              onChange={(value, _, event) => {
                event.stopPropagation();
                onChange(rowData);
              }}
            />
          </div>
        );
      },
    },
    {
      key: 'name',
      name: 'name',
      label: t('promotion_table.name'),
      align: 'left',
      flexGrow: 1,
      cell: (props: ExpectedAny) => {
        const { rowData } = props;
        return (
          <div
            className={cx('pw-h-full pw-p-4 pw-flex pw-items-center pw-cursor-pointer', {
              'pw-bg-white pw-text-neutral-disable': !rowData.valid,
            })}
            onClick={(event) => {
              event.stopPropagation();
              if (!rowData.valid) return;
              onChange(rowData);
            }}
          >
            {!rowData.valid && (
              <Whisper
                placement="bottomStart"
                trigger="hover"
                speaker={<Tooltip arrow={false}>{t('error.unqualified_promotion')}</Tooltip>}
              >
                <div className="pw-text-orange-500 pw-mr-2 pw-text-xl">
                  <BsExclamationTriangle />
                </div>
              </Whisper>
            )}
            <Whisper placement="bottomStart" trigger="hover" speaker={<Tooltip arrow={false}>{rowData.name}</Tooltip>}>
              <div>{rowData.name}</div>
            </Whisper>
          </div>
        );
      },
    },
    {
      key: 'code',
      name: 'code',
      label: t('promotion_table.code'),
      align: 'left',
      flexGrow: 0.5,
      cell: (props: ExpectedAny) => {
        const { rowData } = props;
        return (
          <Whisper
            placement="bottomStart"
            trigger="hover"
            speaker={<Tooltip arrow={false}>{rowData.promotion_code}</Tooltip>}
            onClick={(event) => {
              event.stopPropagation();
              if (!rowData.valid) return;
              onChange(rowData);
            }}
          >
            <div
              className={cx('pw-h-full pw-p-4 pw-cursor-pointer', {
                'pw-bg-white pw-text-neutral-disable': !rowData.valid,
              })}
            >
              {rowData.promotion_code}
            </div>
          </Whisper>
        );
      },
    },
    {
      key: 'description',
      name: 'description',
      label: t('promotion_table.condition'),
      align: 'left',
      flexGrow: 1.5,
      cell: (props: ExpectedAny) => {
        const { rowData } = props;
        return (
          <Whisper
            placement="bottomStart"
            trigger="hover"
            speaker={<Tooltip arrow={false}>{formatDescriptionPromotion(rowData)}</Tooltip>}
            onClick={(event) => {
              event.stopPropagation();
              if (!rowData.valid) return;
              onChange(rowData);
            }}
          >
            <div
              className={cx('pw-h-full pw-p-4 pw-cursor-pointer', {
                'pw-bg-white pw-text-neutral-disable': !rowData.valid,
              })}
            >
              {formatDescriptionPromotion(rowData)}
            </div>
          </Whisper>
        );
      },
    },
    {
      key: 'total',
      name: 'total',
      label: t('promotion_table.total'),
      align: 'right',
      flexGrow: 0.5,
      cell: (props: ExpectedAny) => {
        const { rowData } = props;
        return (
          <div
            className={cx('pw-h-full pw-p-4 pw-cursor-pointer', {
              'pw-bg-white pw-text-neutral-disable': !rowData.valid,
            })}
            onClick={(event) => {
              event.stopPropagation();
              if (!rowData.valid) return;
              onChange(rowData);
            }}
          >
            {rowData.type === 'percent' ? `${rowData.value}%` : `${numberFormat.format(rowData.value)}đ`}
          </div>
        );
      },
    },
  ];
};
