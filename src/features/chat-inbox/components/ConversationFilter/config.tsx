import { useTranslation } from 'react-i18next';
import { MdLabel } from 'react-icons/md';
// import { BsGlobe2 } from 'react-icons/bs';
import { format } from 'date-fns';
import { ComponentType } from '~app/components/HookForm/utils';
import { useGetLabelMessageQuery } from '~app/services/queries';
// import { OrderStatus, OrderStatusType } from '~app/utils/constants';
import { IconFacebook, IconMessenger, LogoImage, IconZalo } from '~app/components/Icons';
import { ChatChannel, ChatStatus } from '~app/utils/constants';
import { convertDateFilter } from '~app/utils/helpers';

export const initFilterValues = {
  primary: {
    name: '',
    status: ChatStatus.ALL,
  },
  secondary: {
    tag: [],
    label_ids: [],
    dateRange: [],
  },
};

export const convertFilter = (filter: ExpectedAny) => {
  const { dateRange, ...rest } = filter;
  return {
    ...rest,
    ...convertDateFilter(dateRange),
  };
};

export const formatFilterValues = (initFilterValues: ExpectedAny) => {
  return { ...initFilterValues.secondary };
};

export const formatFilterDate = (value: Date[]) =>
  `${format(value?.[0] as Date, 'dd-MM-yyyy')} - ${format(value?.[1] as Date, 'dd-MM-yyyy')}`;

export const getSecondaryFilterValues = (currentFilter: ExpectedAny) => {
  const result: ExpectedAny = {};
  Object.keys(initFilterValues.secondary).map((key) =>
    Object.entries(currentFilter).map(([currentKey, currentValue]) => {
      if (key === currentKey) {
        return Object.assign(result, { [currentKey]: currentValue });
      }
    }),
  );
  return result;
};

export const filterOptions = () => {
  const { t } = useTranslation('chat');
  return {
    primary: {},
    secondary: {
      // state: {
      //   type: ComponentType.TagPicker,
      //   placeholder: t('common:all'),
      //   label: t('filter.order'),
      //   menuMaxHeight: 220,
      //   size: 'lg',
      //   container: () => document.getElementById('filter'),
      //   data: Object.values(OrderStatusType).map((status) => ({
      //     label: t(`common:order-status.${OrderStatus[status].name}`),
      //     value: JSON.stringify({
      //       label: t(`common:order-status.${OrderStatus[status].name}`),
      //       value: OrderStatus[status].name,
      //     }),
      //   })),
      // },
      tag: {
        type: ComponentType.TagPicker,
        placeholder: t('common:all'),
        label: t('filter.channel'),
        menuMaxHeight: 220,
        size: 'lg',
        placement: 'top',
        container: () => document.getElementById('filter'),
        renderMenuItem: (label: string, item: ExpectedAny) => {
          return (
            <div className="pw-flex pw-items-center">
              {item.icon}
              <span className="pw-text-base pw-ml-2">{label}</span>
            </div>
          );
        },
        data: [
          // {
          //   label: t('filter.store'),
          //   value: JSON.stringify({
          //     label: t('filter.store'),
          //     value: ChatChannel.STORE,
          //   }),
          //   icon: <DesktopCircle />,
          // },
          // {
          //   label: t('filter.website'),
          //   value: JSON.stringify({
          //     label: t('filter.website'),
          //     value: ChatChannel.WEBSITE,
          //   }),
          //   icon: <BsGlobe2 size={20} />,
          // },
          {
            label: t('filter.chat_sbh'),
            value: JSON.stringify({
              label: t('filter.chat_sbh'),
              value: ChatChannel.SBH,
            }),
            icon: (
              <div className="pw-flex pw-items-center pw-justify-center pw-w-6 pw-h-6 pw-rounded-full pw-bg-primary-main">
                <LogoImage width="12" />
              </div>
            ),
          },
          {
            label: 'Facebook',
            value: JSON.stringify({
              label: 'Facebook',
              value: ChatChannel.FACEBOOK,
            }),
            icon: <IconFacebook size="24" />,
          },
          {
            label: 'Messenger',
            value: JSON.stringify({
              label: 'Messenger',
              value: ChatChannel.MESSENGER,
            }),
            icon: <IconMessenger size="24" />,
          },
          {
            label: 'Zalo',
            value: JSON.stringify({
              label: 'Zalo',
              value: ChatChannel.ZALO,
            }),
            icon: <IconZalo size="24" />,
          },
          // {
          //   label: 'Shopee',
          //   value: JSON.stringify({
          //     label: 'Shopee',
          //     value: 'shopee',
          //   }),
          //   icon: <IconShopee size="24" />,
          // },
        ],
      },
      // staff_creator_ids: {
      //   type: ComponentType.TagPicker,
      //   placeholder: t('common:all'),
      //   label: t('filter.support_staff'),
      //   async: true,
      //   menuMaxHeight: 220,
      //   size: 'lg',
      //   initStateFunc: () => ({
      //     page: 1,
      //     page_size: 10,
      //   }),
      //   container: () => document.getElementById('filter'),
      //   query: useGetListStaffQuery,
      //   mapFunc: (item: Staff) => ({
      //     label: item.staff_name,
      //     value: JSON.stringify({
      //       label: item.staff_name,
      //       value: item.user_id,
      //     }),
      //   }),
      // },
      label_ids: {
        type: ComponentType.TagPicker,
        placeholder: t('common:all'),
        async: true,
        label: t('filter.label_message'),
        menuMaxHeight: 220,
        size: 'lg',
        initStateFunc: () => ({
          page: 1,
          page_size: 10,
        }),
        container: () => document.getElementById('filter'),
        renderMenuItem: (label: string, item: Label) => (
          <div className="pw-flex pw-items-center">
            <MdLabel size={24} color={item.color} />
            <span className="pw-text-base pw-ml-2 line-clamp-1">{label}</span>
          </div>
        ),
        query: useGetLabelMessageQuery,
        mapFunc: (item: Label) => ({
          label: item.name,
          value: JSON.stringify({
            label: item.name,
            value: item.id,
          }),
          color: item.color,
        }),
      },
      dateRange: {
        type: ComponentType.DateRangeForm,
        title: t('filter.time'),
        placeholder: t('common:all'),
        editable: false,
        cleanable: false,
        size: 'lg',
        name: 'dateRange',
        container: () => document.getElementById('filter'),
      },
    },
  };
};
