import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { MainRouteKeys } from '~app/routes/enums';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { CashBookType, DebtType, PackageKey } from '~app/utils/constants';
import { queryClient } from '~app/configs/client';
import { BUSSINESS_BY_ID } from '~app/services/queries';
import {
  InventoryPermission,
  ProductPermission,
  OrderPermission,
  useHasPermissions,
  OtherPermision,
  TablePermission,
  CashbookPermission,
} from '~app/utils/shield';
import { UpgradePackageModal } from '~app/components';
import { usePackage } from '~app/utils/shield/usePackage';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  transaction_type?: CashBookType | DebtType;
  onSuccess?(value?: ExpectedAny): void;
};

const QuickActionList = () => {
  const { t } = useTranslation('todo');
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [packageRequired, setPackageRequired] = useState<{ packages: string[]; addonKey: string } | null>(null);
  const navigate = useNavigate();
  const { currentPackage, description } = usePackage(packageRequired?.packages || [], packageRequired?.addonKey || '');

  const handleNavigate = (path: string, params?: Record<string, string>) => {
    navigate({
      pathname: path,
      search: `?${createSearchParams(params || {})}`,
    });
  };

  const handleOpenModal = (data: ModalData) => {
    setModalData(data);
  };

  const refreshBusinessInfo = () => {
    queryClient.invalidateQueries([BUSSINESS_BY_ID], { exact: false });
  };

  const handleClose = () => {
    setPackageRequired(null);
  };

  const quickActionList = useMemo(() => {
    return [
      {
        title: t('sell'),
        children: [
          {
            title: t('create-order'),
            action: () => handleNavigate(MainRouteKeys.Pos),
            permissions: [
              OrderPermission.ORDER_CART_CREATE,
              OrderPermission.ORDER_CART_UPDATE,
              OrderPermission.ORDER_CART_COMPLETE,
            ],
          },
          {
            title: t('create-order-table'),
            action: () => {
              if (currentPackage !== PackageKey.PRO) {
                return setPackageRequired({ packages: [PackageKey.PRO], addonKey: 'table_tablelist_view' });
              }
              handleNavigate(MainRouteKeys.Table);
            },
            permissions: [
              OrderPermission.ORDER_CART_CREATE,
              OrderPermission.ORDER_CART_UPDATE,
              OrderPermission.ORDER_CART_COMPLETE,
              TablePermission.TABLE_TABLELIST_VIEW,
            ],
          },
        ],
      },
      {
        title: t('product'),
        children: [
          {
            title: t('create-product'),
            action: () =>
              handleOpenModal({
                modal: ModalTypes.ProductCreate,
                onSuccess: refreshBusinessInfo,
              }),
            permissions: [ProductPermission.PRODUCT_PRODUCTLIST_CREATE],
          },
          {
            title: t('create-import-stock'),
            action: () => {
              if (currentPackage === PackageKey.FREE) {
                return setPackageRequired({ packages: [PackageKey.PRO], addonKey: 'inventory_productlist_advance' });
              }
              handleOpenModal({
                modal: ModalTypes.CreateImportGoods,
                onSuccess: refreshBusinessInfo,
              });
            },
            permissions: [InventoryPermission.INVENTORY_PURCHASEORDER_CREATE],
          },
          {
            title: t('create-stock-taking'),
            action: () => {
              if (currentPackage === PackageKey.FREE) {
                return setPackageRequired({ packages: [PackageKey.PRO], addonKey: 'inventory_productlist_advance' });
              }
              handleOpenModal({
                modal: ModalTypes.CreateStockTaking,
                onSuccess: refreshBusinessInfo,
              });
            },
            permissions: [InventoryPermission.INVENTORY_ADJUSTMENT_CREATE],
          },
        ],
      },
      {
        title: t('finance'),
        children: [
          {
            title: t('create-cashbook-in'),
            action: () =>
              handleOpenModal({
                modal: ModalTypes.CashbookCreate,
                transaction_type: CashBookType.IN,
                placement: ModalPlacement.Right,
                size: ModalSize.Xsmall,
                onSuccess: refreshBusinessInfo,
              }),
            permissions: [CashbookPermission.CASHBOOK_LIST_ALL_VIEW],
          },
          {
            title: t('create-cashbook-out'),
            action: () =>
              handleOpenModal({
                modal: ModalTypes.CashbookCreate,
                transaction_type: CashBookType.OUT,
                placement: ModalPlacement.Right,
                size: ModalSize.Xsmall,
                onSuccess: refreshBusinessInfo,
              }),
            permissions: [CashbookPermission.CASHBOOK_LIST_ALL_VIEW],
          },
          {
            title: t('create-debt'),
            action: () =>
              handleOpenModal({
                modal: ModalTypes.DebtCreate,
                transaction_type: DebtType.IN,
                placement: ModalPlacement.Right,
                size: ModalSize.Xsmall,
                onSuccess: refreshBusinessInfo,
              }),
            permissions: [OtherPermision.DEBT_LIST_ALL_VIEW],
          },
        ],
      },
    ];
  }, [t]);

  const allPermission = useMemo(() => {
    let listAllPermission: Array<ExpectedAny> = [];
    quickActionList.forEach((quickActionItems) => {
      quickActionItems.children.forEach((item) => {
        listAllPermission = listAllPermission.concat(item.permissions);
      });
    });
    return listAllPermission;
  }, [quickActionList]);

  if (!useHasPermissions(allPermission)) return null;

  return (
    <div>
      <p className="pw-font-bold pw-text-xl pw-mb-4">{t('quick-action')}</p>
      <div className="pw-grid pw-grid-cols-3 pw-gap-4 pw-py-2">
        {quickActionList.map((quickActionItems, index) => {
          let listPermissionChild: Array<ExpectedAny> = [];
          quickActionItems.children.forEach((item) => {
            listPermissionChild = listPermissionChild.concat(item.permissions);
          }, []);
          const hasPermissionSection = useHasPermissions(listPermissionChild);
          if (!hasPermissionSection) return null;
          return (
            <div key={`${index}-quickActionList`}>
              <p className="pw-text-neutral-placeholder pw-text-sm pw-font-bold pw-uppercase pw-mb-8">
                {quickActionItems.title}
              </p>
              <div className="pw-flex pw-flex-col pw-gap-y-5">
                {quickActionItems.children.map((childItem) => {
                  const hasPermission = useHasPermissions(childItem.permissions);
                  if (!hasPermission) return null;
                  return (
                    <div onClick={childItem.action} className="pw-flex pw-gap-x-2 pw-cursor-pointer">
                      <BsPlusCircleFill size={24} className="pw-text-main" />
                      <span className="pw-text-main pw-text-base">{childItem.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {packageRequired && (
        <UpgradePackageModal description={description} onConfirm={handleClose} onClose={handleClose} />
      )}
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </div>
  );
};

export default QuickActionList;
