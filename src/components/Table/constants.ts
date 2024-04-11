import { TFunction } from 'i18next';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '~app/configs';

export const DefaultColumnOptions: ExpectedAny = {};

export const initStateFunction = (arg: {
  page?: number;
  pageSize?: number;
  orderBy?: ExpectedAny;
  checkedKeys?: ExpectedAny;
}): (() => ExpectedAny) => {
  return (): ExpectedAny => {
    return {
      pageSize: arg.pageSize ?? DEFAULT_PAGE_SIZE,
      page: arg.page ?? DEFAULT_PAGE,
      orderBy: arg.orderBy ?? undefined,
      checkedKeys: arg.checkedKeys ?? [],
      compact: false,
      ...arg,
    };
  };
};

export const itemsPerPageOptions = (t: TFunction) => {
  return [
    {
      value: 5,
      label: `5 / ${t('page')}`,
    },
    {
      value: 10,
      label: `10 / ${t('page')}`,
    },
    {
      value: 20,
      label: `20 / ${t('page')}`,
    },
    {
      value: 30,
      label: `30 / ${t('page')}`,
    },
    {
      value: 40,
      label: `40 / ${t('page')}`,
    },
    {
      value: 50,
      label: `50 / ${t('page')}`,
    },
  ];
};
