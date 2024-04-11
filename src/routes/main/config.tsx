import { lazy } from 'react';
import { MainRouteObject } from '../types';
import { MainRouteKeys } from '../enums';
import { MainLayout } from '~app/layouts';
import {
  ProductPermission,
  CashbookPermission,
  InventoryPermission,
  OtherPermision,
  OrderPermission,
  CustomerPermission,
  TablePermission,
  NotiPermission,
  ConfigPermission,
  IngredientPermission,
  FormulaPermission,
} from '~app/utils/shield';
import { PackageKey } from '~app/utils/constants';

// Todo routers
const Todo = lazy(() => import('~app/pages/Todo'));

// Pos routers
const Pos = lazy(() => import('~app/pages/Pos'));

// Table routers
const Table = lazy(() => import('~app/pages/Table'));

// Orders routers
const Orders = lazy(() => import('~app/pages/Orders'));

// Products routers
const Products = lazy(() => import('~app/pages/Products'));
const ProductsList = lazy(() => import('~app/pages/Products/List'));
const ProductsAddon = lazy(() => import('~app/pages/Products/Addon'));
const PrintBarcode = lazy(() => import('~app/pages/Products/PrintBarcode'));

// Ecommerce routers
const Ecommerce = lazy(() => import('~app/pages/Ecommerce'));
const Website = lazy(() => import('~app/pages/Website'));
const Social = lazy(() => import('~app/pages/Social'));

// Staff routers
const Staff = lazy(() => import('~app/pages/Staff'));
const StaffManagement = lazy(() => import('~app/pages/Staff/StaffManagement'));
const Role = lazy(() => import('~app/pages/Staff/Role'));

// Contacts routers
const Contacts = lazy(() => import('~app/pages/Contacts'));
const ContactsList = lazy(() => import('~app/pages/Contacts/List'));
const ContactsGroup = lazy(() => import('~app/pages/Contacts/Groups'));

// Cashbook routers
const Cashbook = lazy(() => import('~app/pages/Cashbook'));
const CashbookList = lazy(() => import('~app/pages/Cashbook/List'));
const CashbookTransaction = lazy(() => import('~app/pages/Cashbook/Transaction'));
const CashbookDebt = lazy(() => import('~app/pages/Cashbook/Debt'));

// Report routers
const Report = lazy(() => import('~app/pages/Report'));
const ReportPNL = lazy(() => import('~app/pages/Report/PNL'));
const ReportRevenue = lazy(() => import('~app/pages/Report/Revenue'));
const ReportTransaction = lazy(() => import('~app/pages/Report/Transaction'));
const ReportInventory = lazy(() => import('~app/pages/Report/Inventory'));
// Chat routers

const Chat = lazy(() => import('~app/pages/Chat'));
const ChatInbox = lazy(() => import('~app/pages/Chat/Inbox'));
const ChatInboxDetails = lazy(() => import('~app/pages/Chat/Inbox/[pageId]'));
const ChatBot = lazy(() => import('~app/pages/Chat/Bot'));

const ChatConfigs = lazy(() => import('~app/pages/Chat/Configs'));
const ChatConfigsPages = lazy(() => import('~app/pages/Chat/Configs/Pages'));
const ChatConfigsGeneral = lazy(() => import('~app/pages/Chat/Configs/General'));
const ChatConfigsLabel = lazy(() => import('~app/pages/Chat/Configs/Label'));
const ChatConfigsComment = lazy(() => import('~app/pages/Chat/Configs/Comment'));
const ChatConfigsQuickMessage = lazy(() => import('~app/pages/Chat/Configs/QuickMessage'));
const ChatConfigsAutoMessage = lazy(() => import('~app/pages/Chat/Configs/AutoMessage'));
const ChatConfigsAbsenceMessage = lazy(() => import('~app/pages/Chat/Configs/AbsenceMessage'));
const ChatConfigsFrequentlyQuestion = lazy(() => import('~app/pages/Chat/Configs/FrequentlyQuestion'));
const ChatConfigsSplitConversation = lazy(() => import('~app/pages/Chat/Configs/SplitConversation'));
const ChatConfigsChatBotScript = lazy(() => import('~app/pages/Chat/Configs/ChatBotScript'));
const ChatConfigsChatBotKeyword = lazy(() => import('~app/pages/Chat/Configs/ChatBotKeyword'));

// Inventory routers
const Inventory = lazy(() => import('~app/pages/Inventory'));
const Warehouse = lazy(() => import('~app/pages/Inventory/Warehouse'));
const InventoryBook = lazy(() => import('~app/pages/Inventory/InventoryBook'));
const InventoryImportBook = lazy(() => import('~app/pages/Inventory/InventoryImportBook'));
const InventoryExportBook = lazy(() => import('~app/pages/Inventory/InventoryExportBook'));
const StockTaking = lazy(() => import('~app/pages/Inventory/StockTaking'));

// Setting routers
const Setting = lazy(() => import('~app/pages/Setting'));

// Ingredients routers
const Ingredients = lazy(() => import('~app/pages/Ingredients'));
const IngredientsList = lazy(() => import('~app/pages/Ingredients/IngredientsList'));
const Recipe = lazy(() => import('~app/pages/Ingredients/Recipe'));

// Commission
const Commission = lazy(() => import('~app/pages/Commission'));

export const MainRoutes: MainRouteObject = {
  [MainRouteKeys.Root]: {
    path: MainRouteKeys.Root,
    name: 'route:root.name',
    title: 'route:root.title',
    element: <MainLayout />,
    permissions: '*',
  },
  [MainRouteKeys.Todo]: {
    path: MainRouteKeys.Todo,
    name: 'route:todo.name',
    title: 'route:todo.title',
    element: <Todo />,
    permissions: '*',
  },
  [MainRouteKeys.Sales]: {
    path: MainRouteKeys.Sales,
    name: 'route:sales',
    element: <Orders />,
    permissions: [
      OrderPermission.ORDER_CART_CREATE,
      OrderPermission.ORDER_CART_UPDATE,
      OrderPermission.ORDER_CART_COMPLETE,
      OrderPermission.ORDER_ORDERLIST_VIEW,
    ],
  },
  [MainRouteKeys.Pos]: {
    path: MainRouteKeys.Pos,
    name: 'route:sales',
    title: 'route:pos',
    element: <Pos />,
    hideHeader: true,
    hideSideBar: true,
    hideNavHeader: true,
    hidePageHeader: true,
    permissions: [OrderPermission.ORDER_CART_CREATE, OrderPermission.ORDER_CART_COMPLETE],
  },
  [MainRouteKeys.Table]: {
    path: MainRouteKeys.Table,
    name: 'route:table.name',
    title: 'route:table.title',
    element: <Table />,
    hideHeader: true,
    hideSideBar: true,
    hideNavHeader: true,
    hidePageHeader: true,
    permissions: [TablePermission.TABLE_TABLELIST_VIEW],
    packages: [PackageKey.PRO],
  },
  [MainRouteKeys.Orders]: {
    path: MainRouteKeys.Orders,
    name: 'route:orders.name',
    title: 'route:orders.title',
    element: <Orders />,
    permissions: [OrderPermission.ORDER_ORDERLIST_VIEW],
  },
  [MainRouteKeys.Goods]: {
    path: MainRouteKeys.Goods,
    name: 'route:goods',
    element: <Products />,
    permissions: [
      ProductPermission.PRODUCT_PRODUCTLIST_VIEW,
      ProductPermission.PRODUCT_ADDON_ALL_VIEW,
      InventoryPermission.INVENTORY_STAMP_ALL_VIEW,
      InventoryPermission.INVENTORY_PURCHASEORDER_VIEW,
      InventoryPermission.INVENTORY_ADJUSTMENT_CREATE,
      FormulaPermission.FORMULA_VIEW,
      IngredientPermission.INGREDIENT_LIST_VIEW,
    ],
  },
  [MainRouteKeys.Products]: {
    path: MainRouteKeys.Products,
    name: 'route:products.productsList.name',
    element: <Products />,
    permissions: [
      ProductPermission.PRODUCT_PRODUCTLIST_VIEW,
      ProductPermission.PRODUCT_ADDON_ALL_VIEW,
      InventoryPermission.INVENTORY_STAMP_ALL_VIEW,
    ],
  },
  [MainRouteKeys.ProductsList]: {
    path: MainRouteKeys.ProductsList,
    name: 'route:products.productsList.name',
    title: 'route:products.productsList.title',
    element: <ProductsList />,
    permissions: [ProductPermission.PRODUCT_PRODUCTLIST_VIEW, ProductPermission.PRODUCT_PRODUCTLIST_CREATE],
  },
  [MainRouteKeys.ProductAddon]: {
    path: MainRouteKeys.ProductAddon,
    name: 'route:products.productsAddon.name',
    title: 'route:products.productsAddon.title',
    element: <ProductsAddon />,
    permissions: [ProductPermission.PRODUCT_ADDON_ALL_VIEW],
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.PrintBarCode]: {
    path: MainRouteKeys.PrintBarCode,
    name: 'route:products.printBarCode.name',
    title: 'route:products.printBarCode.title',
    element: <PrintBarcode />,
    permissions: [InventoryPermission.INVENTORY_STAMP_ALL_VIEW],
  },
  [MainRouteKeys.Channel]: {
    path: MainRouteKeys.Channel,
    name: 'route:channel',
    title: 'route:ecom.title',
    element: <Ecommerce />,
    permissions: '*',
  },
  [MainRouteKeys.Website]: {
    path: MainRouteKeys.Website,
    name: 'route:website.name',
    title: 'route:website.title',
    element: <Website />,
    permissions: '*',
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.Ecom]: {
    path: MainRouteKeys.Ecom,
    name: 'route:ecom.name',
    title: 'route:ecom.title',
    element: <Ecommerce />,
    permissions: '*',
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.Social]: {
    path: MainRouteKeys.Social,
    name: 'route:social.name',
    title: 'route:social.title',
    element: <Social />,
    permissions: '*',
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.Customer]: {
    path: MainRouteKeys.Customer,
    name: 'route:customer',
    element: <Contacts />,
    permissions: [
      CustomerPermission.CUSTOMER_CUSTOMERLIST_VIEW,
      CustomerPermission.CUSTOMER_CUSTOMERLIST_CREATE,
      CustomerPermission.CUSTOMER_CHAT_ALL_VIEW,
      CustomerPermission.CUSTOMER_SETTING_CHAT_VIEW,
    ],
  },
  [MainRouteKeys.Contacts]: {
    path: MainRouteKeys.Contacts,
    name: 'route:contacts.name',
    element: <Contacts />,
    permissions: [CustomerPermission.CUSTOMER_CUSTOMERLIST_VIEW, CustomerPermission.CUSTOMER_CUSTOMERLIST_CREATE],
  },
  [MainRouteKeys.ContactsList]: {
    path: MainRouteKeys.ContactsList,
    name: 'route:contacts.contactsList.name',
    title: 'route:contacts.contactsList.title',
    element: <ContactsList />,
    permissions: [CustomerPermission.CUSTOMER_CUSTOMERLIST_VIEW],
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.ContactsGroup]: {
    path: MainRouteKeys.ContactsGroup,
    name: 'route:contacts.contactsGroups.name',
    title: 'route:contacts.contactsGroups.title',
    element: <ContactsGroup />,
    permissions: '*',
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.Finance]: {
    path: MainRouteKeys.Finance,
    name: 'route:finance',
    title: 'route:cashbook.title',
    element: <Cashbook />,
    permissions: [
      CashbookPermission.CASHBOOK_LIST_ALL_VIEW,
      CashbookPermission.CASHBOOK_LIST_VIEW_ONLYME,
      OtherPermision.DEBT_LIST_ALL_VIEW,
    ],
  },
  [MainRouteKeys.Cashbook]: {
    path: MainRouteKeys.Cashbook,
    name: 'route:cashbook.name',
    title: 'route:cashbook.title',
    element: <Cashbook />,
    permissions: [
      CashbookPermission.CASHBOOK_LIST_ALL_VIEW,
      CashbookPermission.CASHBOOK_LIST_VIEW_ONLYME,
      OtherPermision.DEBT_LIST_ALL_VIEW,
    ],
  },
  [MainRouteKeys.CashbookTransaction]: {
    path: MainRouteKeys.CashbookTransaction,
    name: 'route:cashbook.transaction.name',
    title: 'route:cashbook.transaction.title',
    element: <CashbookTransaction />,
    permissions: [CashbookPermission.CASHBOOK_LIST_ALL_VIEW, CashbookPermission.CASHBOOK_LIST_VIEW_ONLYME],
  },
  [MainRouteKeys.CashbookList]: {
    path: MainRouteKeys.CashbookList,
    name: 'route:cashbook.cashbookList.name',
    title: 'route:cashbook.cashbookList.title',
    element: <CashbookList />,
    permissions: [CashbookPermission.CASHBOOK_LIST_ALL_VIEW, CashbookPermission.CASHBOOK_LIST_VIEW_ONLYME],
  },
  [MainRouteKeys.CashbookDebt]: {
    path: MainRouteKeys.CashbookDebt,
    name: 'route:cashbook.cashbookDebt.name',
    title: 'route:cashbook.cashbookDebt.title',
    element: <CashbookDebt />,
    permissions: [OtherPermision.DEBT_LIST_ALL_VIEW],
  },
  [MainRouteKeys.Inventory]: {
    path: MainRouteKeys.Inventory,
    name: 'route:inventory.name',
    title: 'route:inventory.title',
    element: <Inventory />,
    permissions: [
      InventoryPermission.INVENTORY_PRODUCTLIST_VIEW,
      InventoryPermission.INVENTORY_PURCHASEORDER_VIEW,
      InventoryPermission.INVENTORY_ADJUSTMENT_CREATE,
    ],
    packages: [PackageKey.PRO],
  },
  [MainRouteKeys.Warehouse]: {
    path: MainRouteKeys.Warehouse,
    name: 'route:inventory.warehouse.name',
    title: 'route:inventory.warehouse.title',
    element: <Warehouse />,
    permissions: [InventoryPermission.INVENTORY_PRODUCTLIST_VIEW],
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },

  [MainRouteKeys.InventoryBook]: {
    path: MainRouteKeys.InventoryBook,
    name: 'route:inventory.inventoryBook.name',
    title: 'route:inventory.inventoryBook.title',
    element: <InventoryBook />,
    permissions: [InventoryPermission.INVENTORY_PURCHASEORDER_VIEW],
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.InventoryImportBook]: {
    path: MainRouteKeys.InventoryImportBook,
    name: 'route:inventory.inventoryImportBook.name',
    title: 'route:inventory.inventoryImportBook.title',
    element: <InventoryImportBook />,
    permissions: [InventoryPermission.INVENTORY_PURCHASEORDER_CREATE],
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.InventoryExportBook]: {
    path: MainRouteKeys.InventoryExportBook,
    name: 'route:inventory.inventoryExportBook.name',
    title: 'route:inventory.inventoryExportBook.title',
    element: <InventoryExportBook />,
    permissions: [InventoryPermission.INVENTORY_OUTBOUND_CREATE],
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.StockTaking]: {
    path: MainRouteKeys.StockTaking,
    name: 'route:inventory.stockTaking.name',
    title: 'route:inventory.stockTaking.title',
    element: <StockTaking />,
    permissions: [InventoryPermission.INVENTORY_ADJUSTMENT_CREATE],
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.Chat]: {
    path: MainRouteKeys.Chat,
    name: 'route:chat.name',
    title: 'route:chat.title',
    element: <Chat />,
    hidePageHeader: true,
    permissions: '*',
  },
  [MainRouteKeys.ChatInbox]: {
    path: MainRouteKeys.ChatInbox,
    name: 'route:chat.chatInbox.name',
    title: 'route:chat.chatInbox.title',
    element: <ChatInbox />,
    hidePageHeader: true,
    hideNavHeader: true,
    hidePageTitle: true,
    permissions: [
      CustomerPermission.CUSTOMER_CHAT_ALL_VIEW,
      ConfigPermission.SBH_ASSISTANT_CHAT_VIEW,
      ConfigPermission.SBH_SUPPORTER_CHAT_VIEW,
      NotiPermission.NOTI_VIEW,
      NotiPermission.NOTI_ORDER_VIEW,
      NotiPermission.NOTI_FINANCE_VIEW,
    ],
  },
  [MainRouteKeys.ChatInboxDetails]: {
    path: MainRouteKeys.ChatInboxDetails,
    name: 'route:chat.chatInboxDetails.name',
    title: 'route:chat.chatInboxDetails.title',
    element: <ChatInboxDetails />,
    hidePageHeader: true,
    hideNavHeader: true,
    hidePageTitle: true,
    permissions: [
      NotiPermission.NOTI_VIEW,
      NotiPermission.NOTI_ORDER_VIEW,
      NotiPermission.NOTI_FINANCE_VIEW,
      CustomerPermission.CUSTOMER_CHAT_ALL_VIEW,
      ConfigPermission.SBH_ASSISTANT_CHAT_VIEW,
      ConfigPermission.SBH_SUPPORTER_CHAT_VIEW,
    ],
  },
  [MainRouteKeys.ChatConfigs]: {
    path: MainRouteKeys.ChatConfigs,
    name: 'route:chat.chatConfigs.name',
    title: 'route:chat.chatConfigs.title',
    element: <ChatConfigs />,
    hidePageHeader: true,
    permissions: [CustomerPermission.CUSTOMER_SETTING_CHAT_VIEW],
  },
  [MainRouteKeys.ChatConfigsPages]: {
    path: MainRouteKeys.ChatConfigsPages,
    name: 'route:chat.chatConfigsPages.name',
    title: 'route:chat.chatConfigsPages.title',
    element: <ChatConfigsPages />,
    hidePageHeader: true,
    permissions: '*',
  },
  [MainRouteKeys.ChatConfigsGeneral]: {
    path: MainRouteKeys.ChatConfigsGeneral,
    name: 'route:chat.chatConfigsGeneral.name',
    title: 'route:chat.chatConfigsGeneral.title',
    element: <ChatConfigsGeneral />,
    hidePageHeader: true,
    permissions: '*',
  },
  [MainRouteKeys.ChatConfigsLabel]: {
    path: MainRouteKeys.ChatConfigsLabel,
    name: 'route:chat.chatConfigsLabel.name',
    title: 'route:chat.chatConfigsLabel.title',
    element: <ChatConfigsLabel />,
    hidePageHeader: true,
    permissions: [CustomerPermission.CUSTOMER_SETTING_CHAT_VIEW],
  },
  [MainRouteKeys.ChatConfigsComment]: {
    path: MainRouteKeys.ChatConfigsComment,
    name: 'route:chat.chatConfigsComment.name',
    title: 'route:chat.chatConfigsComment.title',
    element: <ChatConfigsComment />,
    hidePageHeader: true,
    permissions: [CustomerPermission.CUSTOMER_SETTING_CHAT_VIEW],
  },
  [MainRouteKeys.ChatConfigsQuickMessage]: {
    path: MainRouteKeys.ChatConfigsQuickMessage,
    name: 'route:chat.chatConfigsQuickMessage.name',
    title: 'route:chat.chatConfigsQuickMessage.title',
    element: <ChatConfigsQuickMessage />,
    hidePageHeader: true,
    permissions: [CustomerPermission.CUSTOMER_SETTING_CHAT_VIEW],
  },
  [MainRouteKeys.ChatConfigsAutoMessage]: {
    path: MainRouteKeys.ChatConfigsAutoMessage,
    name: 'route:chat.chatConfigsAutoMessage.name',
    title: 'route:chat.chatConfigsAutoMessage.title',
    element: <ChatConfigsAutoMessage />,
    hidePageHeader: true,
    permissions: [CustomerPermission.CUSTOMER_SETTING_CHAT_VIEW],
  },
  [MainRouteKeys.ChatConfigsAbsenceMessage]: {
    path: MainRouteKeys.ChatConfigsAbsenceMessage,
    name: 'route:chat.chatConfigsAbsenceMessage.name',
    title: 'route:chat.chatConfigsAbsenceMessage.title',
    element: <ChatConfigsAbsenceMessage />,
    hidePageHeader: true,
    permissions: [CustomerPermission.CUSTOMER_SETTING_CHAT_VIEW],
  },
  [MainRouteKeys.ChatConfigsFrequentlyQuestion]: {
    path: MainRouteKeys.ChatConfigsFrequentlyQuestion,
    name: 'route:chat.chatConfigsFrequentlyQuestion.name',
    title: 'route:chat.chatConfigsFrequentlyQuestion.title',
    element: <ChatConfigsFrequentlyQuestion />,
    hidePageHeader: true,
    permissions: [CustomerPermission.CUSTOMER_SETTING_CHAT_VIEW],
  },
  [MainRouteKeys.ChatConfigsSplitConversation]: {
    path: MainRouteKeys.ChatConfigsSplitConversation,
    name: 'route:chat.chatConfigsSplitConversation.name',
    title: 'route:chat.chatConfigsSplitConversation.title',
    element: <ChatConfigsSplitConversation />,
    hidePageHeader: true,
    permissions: '*',
  },
  [MainRouteKeys.ChatConfigsChatBotScript]: {
    path: MainRouteKeys.ChatConfigsChatBotScript,
    name: 'route:chat.chatConfigsChatBotScript.name',
    title: 'route:chat.chatConfigsChatBotScript.title',
    element: <ChatConfigsChatBotScript />,
    hidePageHeader: true,
    permissions: [CustomerPermission.CUSTOMER_SETTING_CHAT_VIEW],
  },
  [MainRouteKeys.ChatConfigsChatBotKeyword]: {
    path: MainRouteKeys.ChatConfigsChatBotKeyword,
    name: 'route:chat.chatConfigsChatBotKeyword.name',
    title: 'route:chat.chatConfigsChatBotKeyword.title',
    element: <ChatConfigsChatBotKeyword />,
    hidePageHeader: true,
    permissions: '*',
  },
  [MainRouteKeys.ChatBot]: {
    path: MainRouteKeys.ChatBot,
    name: 'route:chat.chatBot.name',
    title: 'route:chat.chatBot.title',
    element: <ChatBot />,
    hidePageHeader: true,
    permissions: [CustomerPermission.CUSTOMER_SETTING_CHAT_VIEW],
  },
  [MainRouteKeys.Setting]: {
    path: MainRouteKeys.Setting,
    name: 'route:setting.name',
    title: 'route:setting.title',
    element: <Setting />,
    permissions: [OtherPermision.STORE_SETTINGS_ALL_VIEW],
  },
  [MainRouteKeys.Ingredients]: {
    path: MainRouteKeys.Ingredients,
    name: 'route:ingredients.name',
    title: 'route:ingredients.title',
    element: <Ingredients />,
    permissions: [IngredientPermission.INGREDIENT_LIST_VIEW],
  },
  [MainRouteKeys.IngredientsList]: {
    path: MainRouteKeys.IngredientsList,
    name: 'route:ingredients.ingredientsList.name',
    title: 'route:ingredients.ingredientsList.title',
    element: <IngredientsList />,
    permissions: [IngredientPermission.INGREDIENT_LIST_VIEW],
    packages: [PackageKey.PRO],
  },
  [MainRouteKeys.Recipe]: {
    path: MainRouteKeys.Recipe,
    name: 'route:ingredients.recipe.name',
    title: 'route:ingredients.recipe.title',
    element: <Recipe />,
    permissions: [FormulaPermission.FORMULA_VIEW],
    packages: [PackageKey.PRO],
  },
  [MainRouteKeys.Commission]: {
    path: MainRouteKeys.Commission,
    hidePageHeader: true,
    name: 'route:commission.name',
    title: 'route:commission.title',
    element: <Commission />,
    permissions: [OtherPermision.COMMISSION_ALL_VIEW],
  },
  [MainRouteKeys.Staff]: {
    path: MainRouteKeys.Staff,
    name: 'route:staff',
    element: <Staff />,
    permissions: '*',
  },
  [MainRouteKeys.StaffManagement]: {
    path: MainRouteKeys.StaffManagement,
    name: 'route:staffManagement.name',
    title: 'route:staffManagement.title',
    element: <StaffManagement />,
    permissions: '*',
    // packages: [PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.Role]: {
    path: MainRouteKeys.Role,
    name: 'route:role.name',
    title: 'route:role.title',
    element: <Role />,
    permissions: '*',
    // packages: [PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.Report]: {
    path: MainRouteKeys.Report,
    name: 'route:report',
    element: <Report />,
    permissions: '*',
  },
  [MainRouteKeys.ReportPNL]: {
    path: MainRouteKeys.ReportPNL,
    name: 'route:reportPNL.name',
    title: 'route:reportPNL.title',
    element: <ReportPNL />,
    permissions: '*',
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.ReportRevenue]: {
    path: MainRouteKeys.ReportRevenue,
    name: 'route:reportRevenue.name',
    title: 'route:reportRevenue.title',
    element: <ReportRevenue />,
    permissions: '*',
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.ReportTransaction]: {
    path: MainRouteKeys.ReportTransaction,
    name: 'route:reportTransaction.name',
    title: 'route:reportTransaction.title',
    element: <ReportTransaction />,
    permissions: '*',
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
  [MainRouteKeys.ReportInventory]: {
    path: MainRouteKeys.ReportInventory,
    name: 'route:reportInventory.name',
    title: 'route:reportInventory.title',
    element: <ReportInventory />,
    permissions: '*',
    packages: [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
  },
};
