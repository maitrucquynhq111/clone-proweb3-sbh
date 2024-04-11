import { lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { ModalTypes, ModalPlacement, ModalSize } from './types';
import { Drawer } from '~app/components';
import {
  PermissionsWrapper,
  ProductPermission,
  OrderPermission,
  CustomerPermission,
  IngredientPermission,
  FormulaPermission,
  InventoryPermission,
} from '~app/utils/shield';

type Props = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  inline?: boolean;
  onClose?: () => void;
};

const OrderDetails = lazy(() => import('~app/features/orders/details'));
const ConfirmPaying = lazy(() => import('~app/features/orders/lists/components/ConfirmPaying'));
const ConfirmRefunding = lazy(() => import('~app/features/orders/components/ConfirmRefunding'));
const CancelCompleteOrder = lazy(() => import('~app/features/orders/components/CancelCompleteOrder'));

const ProductDetails = lazy(() => import('~app/features/products/details'));
const ProductCreate = lazy(() => import('~app/features/products/create'));
const ProductAddonCreate = lazy(() => import('~app/features/products-addon/create'));
const ProductAddonDetails = lazy(() => import('~app/features/products-addon/details'));

const CashbookCreate = lazy(() => import('~app/features/cashbook/create'));
const CashbookDetails = lazy(() => import('~app/features/cashbook/details'));

const DebtCreate = lazy(() => import('~app/features/debt/create'));
const DebtCreatePayment = lazy(() => import('~app/features/debt/create-payment'));
const DebtDetails = lazy(() => import('~app/features/debt/details'));

const ContactCreate = lazy(() => import('~app/features/contacts/create'));
const ContactUpdate = lazy(() => import('~app/features/contacts/update'));
const ContactDetails = lazy(() => import('~app/features/contacts/details'));

const ContactGroupCreate = lazy(() => import('~app/features/contacts-groups/create'));
const ContactGroupUpdate = lazy(() => import('~app/features/contacts-groups/update'));
const ContactGroupDetails = lazy(() => import('~app/features/contacts-groups/details'));

const ContactLabels = lazy(() => import('~app/features/contacts/details/components/ContactLabel/list'));

const FrequentlyQuestionCreate = lazy(() => import('~app/features/chat-configs/FrequentlyQuestion/create'));
const FrequentlyQuestionDetails = lazy(() => import('~app/features/chat-configs/FrequentlyQuestion/details'));
const LabelMessageCreate = lazy(() => import('~app/features/chat-configs/LabelMessage/create'));
const LabelMessageDetails = lazy(() => import('~app/features/chat-configs/LabelMessage/details'));
const QuickMessageCreate = lazy(() => import('~app/features/chat-configs/QuickMessage/create'));
const QuickMessageDetails = lazy(() => import('~app/features/chat-configs/QuickMessage/details'));
const AbsenceTimeSelectDetails = lazy(() => import('~app/features/chat-configs/components/AbsenceTimeList/details'));
const ChatbotPreview = lazy(() => import('~app/features/chat-bot/components/ChatbotPreview'));
const ReportMessageDrawer = lazy(() => import('~app/features/chat-inbox/details/components/ReportMessageDrawer'));
const HistoryOrderTable = lazy(() => import('~app/features/table/components/HistoryOrderTable'));

const IngredientCreate = lazy(() => import('~app/features/ingredients/ingredientsList/create'));
const IngredientDetails = lazy(() => import('~app/features/ingredients/ingredientsList/details'));
const RecipeUpdate = lazy(() => import('~app/features/ingredients/recipe/update'));
const RecipeCreate = lazy(() => import('~app/features/ingredients/recipe/create'));

const CreateImportGoods = lazy(() => import('~app/features/warehouse/create/importGoods'));
const ImportGoodsDetails = lazy(() => import('~app/features/inventoryImportBook/details'));
const ExportGoodsDetails = lazy(() => import('~app/features/inventoryExportBook/details'));
const CreateExportGoods = lazy(() => import('~app/features/warehouse/create/ExportGoods'));
const AutoLabel = lazy(() => import('~app/features/chat-configs/AutoLabel'));

const WarehouseDetails = lazy(() => import('~app/features/warehouse/details'));
const CancelPurchaseOrder = lazy(() => import('~app/features/inventory/CancelPurchaseOrder'));
const DebitPaymentPurchaseOrder = lazy(() => import('~app/features/inventory/DebitPaymentPurchaseOrder'));

const CreateStockTaking = lazy(() => import('~app/features/stock-taking/create'));
const DetailStockTaking = lazy(() => import('~app/features/stock-taking/detail'));

const renderModal = (modal: ModalTypes, rest: ExpectedAny, state?: ExpectedAny, onClose?: () => void) => {
  switch (modal) {
    case ModalTypes.OrderDetails:
      return (
        <PermissionsWrapper
          element={<OrderDetails {...rest} state={state} onClose={onClose} />}
          permissionNames={[OrderPermission.ORDER_ORDERDETAIL_UPDATE]}
        />
      );
    case ModalTypes.ConfirmPaying:
      return (
        <PermissionsWrapper
          element={<ConfirmPaying {...rest} state={state} onClose={onClose} />}
          permissionNames={[OrderPermission.ORDER_ORDERDETAIL_UPDATE]}
        />
      );
    case ModalTypes.ProductDetails:
      return (
        <PermissionsWrapper
          element={<ProductDetails {...rest} state={state} onClose={onClose} />}
          permissionNames={[ProductPermission.PRODUCT_PRODUCTDETAIL_VIEW]}
        />
      );
    case ModalTypes.ProductCreate:
      return (
        <PermissionsWrapper
          element={<ProductCreate {...rest} state={state} onClose={onClose} />}
          permissionNames={[ProductPermission.PRODUCT_PRODUCTLIST_CREATE]}
        />
      );
    case ModalTypes.ProductAddonCreate:
      return (
        <PermissionsWrapper
          element={<ProductAddonCreate {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.ProductAddonDetails:
      return (
        <PermissionsWrapper
          element={<ProductAddonDetails {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.CashbookCreate:
      return (
        <PermissionsWrapper
          element={<CashbookCreate {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.CashbookDetails:
      return (
        <PermissionsWrapper
          element={<CashbookDetails {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.DebtCreate:
      return (
        <PermissionsWrapper element={<DebtCreate {...rest} state={state} onClose={onClose} />} permissionNames={'*'} />
      );
    case ModalTypes.DebtCreatePayment:
      return (
        <PermissionsWrapper
          element={<DebtCreatePayment {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.DebtDetails:
      return (
        <PermissionsWrapper element={<DebtDetails {...rest} state={state} onClose={onClose} />} permissionNames={'*'} />
      );
    case ModalTypes.ContactCreate:
      return (
        <PermissionsWrapper
          element={<ContactCreate {...rest} state={state} onClose={onClose} />}
          permissionNames={[CustomerPermission.CUSTOMER_CUSTOMERLIST_CREATE]}
        />
      );
    case ModalTypes.ContactUpdate:
      return (
        <PermissionsWrapper
          element={<ContactUpdate {...rest} state={state} onClose={onClose} />}
          permissionNames={[CustomerPermission.CUSTOMER_CUSTOMERLIST_CREATE]}
        />
      );
    case ModalTypes.ContactDetails:
      return (
        <PermissionsWrapper
          element={<ContactDetails {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.ContactGroupCreate:
      return (
        <PermissionsWrapper
          element={<ContactGroupCreate {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.ContactGroupUpdate:
      return (
        <PermissionsWrapper
          element={<ContactGroupUpdate {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.ContactGroupDetails:
      return (
        <PermissionsWrapper
          element={<ContactGroupDetails {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.ContactLabels:
      return (
        <PermissionsWrapper
          element={<ContactLabels {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.FrequentlyQuestionCreate:
      return (
        <PermissionsWrapper
          element={<FrequentlyQuestionCreate {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.FrequentlyQuestionDetails:
      return (
        <PermissionsWrapper
          element={<FrequentlyQuestionDetails {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.LabelMessageCreate:
      return (
        <PermissionsWrapper
          element={<LabelMessageCreate {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.LabelMessageDetails:
      return (
        <PermissionsWrapper
          element={<LabelMessageDetails {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.QuickMessageCreate:
      return (
        <PermissionsWrapper
          element={<QuickMessageCreate {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.QuickMessageDetails:
      return (
        <PermissionsWrapper
          element={<QuickMessageDetails {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.AbsenceTimeSelectDetails:
      return (
        <PermissionsWrapper
          element={<AbsenceTimeSelectDetails {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.ChatbotPreview:
      return (
        <PermissionsWrapper
          element={<ChatbotPreview {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.CancelCompleteOrder:
      return (
        <PermissionsWrapper
          element={<CancelCompleteOrder {...rest} state={state} onClose={onClose} />}
          permissionNames={[OrderPermission.ORDER_ORDERDETAIL_DELETE]}
        />
      );
    case ModalTypes.ConfirmRefunding:
      return (
        <PermissionsWrapper
          element={<ConfirmRefunding {...rest} state={state} onClose={onClose} />}
          permissionNames={[OrderPermission.ORDER_ORDERDETAIL_DEBT_VIEW]}
        />
      );
    case ModalTypes.ReportMessage:
      return (
        <PermissionsWrapper
          element={<ReportMessageDrawer {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.HistoryOrderTable:
      return (
        <PermissionsWrapper
          element={<HistoryOrderTable {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.IngredientCreate:
      return (
        <PermissionsWrapper
          element={<IngredientCreate {...rest} state={state} onClose={onClose} />}
          permissionNames={IngredientPermission.INGREDIENT_CREATE}
        />
      );
    case ModalTypes.IngredientDetails:
      return (
        <PermissionsWrapper
          element={<IngredientDetails {...rest} state={state} onClose={onClose} />}
          permissionNames={IngredientPermission.INGREDIENT_DETAIL_VIEW}
        />
      );
    case ModalTypes.RecipeUpdate:
      return (
        <PermissionsWrapper
          element={<RecipeUpdate {...rest} state={state} onClose={onClose} />}
          permissionNames={FormulaPermission.FORMULA_VIEW}
        />
      );
    case ModalTypes.RecipeCreate:
      return (
        <PermissionsWrapper
          element={<RecipeCreate {...rest} state={state} onClose={onClose} />}
          permissionNames={FormulaPermission.FORMULA_CREATE}
        />
      );
    case ModalTypes.CreateImportGoods:
      return (
        <PermissionsWrapper
          element={<CreateImportGoods {...rest} state={state} onClose={onClose} />}
          permissionNames={InventoryPermission.INVENTORY_PURCHASEORDER_CREATE}
        />
      );
    case ModalTypes.ImportGoodsDetails:
      return (
        <PermissionsWrapper
          element={<ImportGoodsDetails {...rest} state={state} onClose={onClose} />}
          permissionNames={InventoryPermission.INVENTORY_PURCHASEORDER_VIEW}
        />
      );
    case ModalTypes.ExportGoodsDetails:
      return (
        <PermissionsWrapper
          element={<ExportGoodsDetails {...rest} state={state} onClose={onClose} />}
          permissionNames={InventoryPermission.INVENTORY_PURCHASEORDER_VIEW}
        />
      );
    case ModalTypes.CreateExportGoods:
      return (
        <PermissionsWrapper
          element={<CreateExportGoods {...rest} state={state} onClose={onClose} />}
          permissionNames={InventoryPermission.INVENTORY_PURCHASEORDER_CREATE}
        />
      );
    case ModalTypes.AutoLabels:
      return (
        <PermissionsWrapper
          element={<AutoLabel {...rest} onClose={onClose} />}
          permissionNames={ProductPermission.PRODUCT_PRODUCTDETAIL_INVENTORY_VIEW}
        />
      );
    case ModalTypes.WarehouseDetails:
      return (
        <PermissionsWrapper
          element={<WarehouseDetails {...rest} state={state} onClose={onClose} />}
          permissionNames={InventoryPermission.INVENTORY_PRODUCTLIST_VIEW}
        />
      );
    case ModalTypes.CancelPurchaseOrder:
      return (
        <PermissionsWrapper
          element={<CancelPurchaseOrder {...rest} state={state} onClose={onClose} />}
          permissionNames={InventoryPermission.INVENTORY_PURCHASEORDER_DELETE}
        />
      );
    case ModalTypes.DebitPaymentPurchaseOrder:
      return (
        <PermissionsWrapper
          element={<DebitPaymentPurchaseOrder {...rest} state={state} onClose={onClose} />}
          permissionNames={'*'}
        />
      );
    case ModalTypes.CreateStockTaking:
      return (
        <PermissionsWrapper
          element={<CreateStockTaking {...rest} state={state} onClose={onClose} isImportGoods={false} />}
          permissionNames={InventoryPermission.INVENTORY_ADJUSTMENT_CREATE}
        />
      );
    case ModalTypes.DetailStockTaking:
      return (
        <PermissionsWrapper
          element={<DetailStockTaking {...rest} state={state} onClose={onClose} isImportGoods={false} />}
          permissionNames={InventoryPermission.INVENTORY_ADJUSTMENT_CREATE}
        />
      );
    default:
      return <></>;
  }
};

const ModalWrapper = (props: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { modal, size, placement, inline, onClose, ...rest } = props || {};
  const { state } = location;

  const handleClose = () => {
    if (inline) {
      onClose?.();
    } else {
      navigate({
        pathname: location.pathname,
      });
    }
  };

  return (
    <Drawer
      backdrop={'static'}
      size={size || ModalSize.Full}
      placement={placement || ModalPlacement.Top}
      open={true}
      // onClose={handleClose}
      className={cx(`!pw-h-screen`, {
        '!pw-w-full': size === ModalSize.Full || !size,
      })}
    >
      {renderModal(modal, rest, state, handleClose)}
    </Drawer>
  );
};

export default ModalWrapper;
