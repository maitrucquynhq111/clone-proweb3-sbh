import { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BsShieldExclamation, BsExclamationOctagon, BsExclamationTriangle } from 'react-icons/bs';
import ActionBoxItem from './ActionBoxItem';
import { MainRouteKeys } from '~app/routes/enums';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { queryClient } from '~app/configs/client';
import { BUSSINESS_BY_ID } from '~app/services/queries';
import { OtherPermision, ProductPermission, OrderPermission, useHasPermissions } from '~app/utils/shield';

const ActionList = () => {
  const { t } = useTranslation('todo');
  const {
    setting: { bussiness },
  } = useOfflineContext();
  const navigate = useNavigate();

  useEffect(() => {
    queryClient.invalidateQueries([BUSSINESS_BY_ID], { exact: false });
  }, []);

  const handleClick = (path: string, params: Record<string, string>) => {
    navigate(path, {
      state: params,
    });
  };
  const actionList = useMemo(() => {
    const summary = bussiness?.summary;
    return [
      [
        {
          title: t('waiting-confirm-order'),
          amount: summary?.order_waiting_confirm?.count || 0,
          action: () => handleClick(MainRouteKeys.Orders, { state: 'waiting_confirm' }),
          icon: (
            <BsShieldExclamation
              className="pw-text-error-active pw-bg-error-background pw-p-2.5 pw-rounded"
              size={40}
            />
          ),
          permissions: [OrderPermission.ORDER_ORDERLIST_VIEW],
        },
        {
          title: t('delivering-order'),
          amount: summary?.order_delivering?.count || 0,
          action: () => handleClick(MainRouteKeys.Orders, { state: 'delivering' }),
          icon: (
            <BsShieldExclamation
              className="pw-text-error-active pw-bg-error-background pw-p-2.5 pw-rounded"
              size={40}
            />
          ),
          permissions: [OrderPermission.ORDER_ORDERLIST_VIEW],
        },
        {
          title: t('unpaid-order'),
          amount: summary?.order_unpaid?.count || 0,
          action: () =>
            handleClick(MainRouteKeys.Orders, {
              state: 'complete',
              payment_status: JSON.stringify([
                JSON.stringify({
                  label: t('orders-table:unpaid'),
                  value: 'un_paid',
                }),
                JSON.stringify({
                  label: t('orders-table:partial_payment'),
                  value: 'partially_paid',
                }),
              ]),
            }),
          icon: (
            <BsShieldExclamation
              className="pw-text-error-active pw-bg-error-background pw-p-2.5 pw-rounded"
              size={40}
            />
          ),
          permissions: [OrderPermission.ORDER_ORDERLIST_VIEW],
        },
      ],
      [
        {
          title: t('sold-out-product'),
          amount: summary?.total_product_out_stock?.count || 0,
          action: () =>
            handleClick(MainRouteKeys.ProductsList, {
              sort: JSON.stringify({ id: 'can_pick_quantity', direction: 'asc' }),
            }),
          icon: (
            <BsExclamationOctagon
              className="pw-text-primary-main pw-bg-primary-background pw-p-2.5 pw-rounded"
              size={40}
            />
          ),
          permissions: [ProductPermission.PRODUCT_PRODUCTLIST_VIEW],
        },
        {
          title: t('low-inventory-product'),
          amount: summary?.total_product_low_stock?.count || 0,
          action: () =>
            handleClick(MainRouteKeys.ProductsList, {
              sort: JSON.stringify({ id: 'can_pick_quantity', direction: 'asc' }),
            }),
          icon: (
            <BsExclamationOctagon
              className="pw-text-primary-main pw-bg-primary-background pw-p-2.5 pw-rounded"
              size={40}
            />
          ),
          permissions: [ProductPermission.PRODUCT_PRODUCTLIST_VIEW],
        },
      ],
      [
        {
          title: t('need-remind-debt-customer'),
          amount: summary?.total_contact_have_reminder?.count || 0,
          action: () =>
            handleClick(MainRouteKeys.CashbookDebt, {
              options: JSON.stringify([
                JSON.stringify({
                  label: t('filters:debt-table.options-values.debt_reminder'),
                  value: 'debt_reminder',
                }),
              ]),
            }),
          icon: (
            <BsExclamationTriangle
              className="pw-text-warning-active pw-bg-warning-background pw-p-2.5 pw-rounded"
              size={40}
            />
          ),
          permissions: [OtherPermision.DEBT_LIST_ALL_VIEW],
        },
        {
          title: t('not-have-debt-schedule-customer'),
          amount: summary?.total_contact_not_reminder?.count || 0,
          action: () =>
            handleClick(MainRouteKeys.CashbookDebt, {
              options: JSON.stringify([
                JSON.stringify({
                  label: t('filters:debt-table.options-values.no_debt_reminder'),
                  value: 'no_debt_reminder',
                }),
              ]),
            }),
          icon: (
            <BsExclamationTriangle
              className="pw-text-warning-active pw-bg-warning-background pw-p-2.5 pw-rounded"
              size={40}
            />
          ),
          permissions: [OtherPermision.DEBT_LIST_ALL_VIEW],
        },
        {
          title: t('need-collect-debt-customer'),
          amount: summary?.total_amount_in?.count || 0,
          action: () =>
            handleClick(MainRouteKeys.CashbookDebt, {
              options: JSON.stringify([
                JSON.stringify({
                  label: t('filters:debt-table.options-values.in'),
                  value: 'in',
                }),
              ]),
            }),
          icon: (
            <BsExclamationTriangle
              className="pw-text-warning-active pw-bg-warning-background pw-p-2.5 pw-rounded"
              size={40}
            />
          ),
          permissions: [OtherPermision.DEBT_LIST_ALL_VIEW],
        },
      ],
    ];
  }, [bussiness?.summary, t]);

  const allPermission = useMemo(() => {
    let listAllPermission: Array<ExpectedAny> = [];
    actionList.forEach((actionCluster) => {
      actionCluster.forEach((item) => {
        listAllPermission = listAllPermission.concat(item.permissions);
      });
    });
    return listAllPermission;
  }, [actionList]);

  if (!useHasPermissions(allPermission)) return null;

  return (
    <div>
      <p className="pw-font-bold pw-text-xl pw-mb-4">{t('need-consider')}</p>
      <div className="pw-mb-4">
        {actionList.map((actionCluster, index: number) => {
          return (
            <div key={`${index}-actionCluster`} className="pw-grid pw-grid-cols-3 pw-gap-4 pw-py-2">
              {actionCluster.map((item) => {
                const hasPermission = useHasPermissions(item.permissions);
                if (!hasPermission) return null;
                return (
                  <ActionBoxItem
                    icon={item.icon}
                    title={item.title || ''}
                    amount={item.amount || 0}
                    action={item.action}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActionList;
