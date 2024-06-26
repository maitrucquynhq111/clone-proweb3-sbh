export enum ErrorRouteKeys {
  Root = '/error',
  NotFound = '/error/404',
  Internal = '/error/500',
}

export enum MainRouteKeys {
  Root = '/',
  Todo = '/todo',
  Pos = '/pos',
  Table = '/table',
  //SALES
  Sales = '/sales',
  Orders = '/sales/orders',
  // GOODS
  Goods = '/goods',
  Products = '/goods/products',
  ProductsList = '/goods/products/list',
  ProductAddon = '/goods/products/addon',
  PrintBarCode = '/goods/products/print-barcode',
  Inventory = '/goods/inventory',
  Warehouse = '/goods/inventory/warehouse',
  StockTaking = '/goods/inventory/stock-taking',
  InventoryBook = '/goods/inventory/book',
  InventoryImportBook = '/goods/inventory/import-book',
  InventoryExportBook = '/goods/inventory/export-book',
  Ingredients = '/goods/ingredients',
  IngredientsList = '/goods/ingredients/list',
  Recipe = '/goods/ingredients/recipe',
  // CHANNEL
  Channel = '/channel',
  Website = '/channel/website',
  Ecom = '/channel/ecommerce',
  Social = '/channel/social',
  // FINANCE
  Finance = '/finance',
  Cashbook = '/finance/cashbook',
  CashbookTransaction = '/finance/transaction',
  CashbookDebt = '/finance/debtbook',
  CashbookList = '/finance/cashbook',
  // CUSTOMER
  Customer = '/customer',
  Contacts = '/customer/contacts',
  ContactsList = '/customer/contacts/list',
  ContactsGroup = '/customer/contacts/groups',
  Chat = '/customer/chat',
  ChatInbox = '/customer/chat/inbox',
  ChatInboxDetails = '/customer/chat/inbox/:pageId',
  ChatConfigs = '/customer/chat/configs',
  ChatConfigsPages = '/customer/chat/configs/pages',
  ChatConfigsGeneral = '/customer/chat/configs/general',
  ChatConfigsLabel = '/customer/chat/configs/label',
  ChatConfigsComment = '/customer/chat/configs/comment',
  ChatConfigsQuickMessage = '/customer/chat/configs/quick-message',
  ChatConfigsAutoMessage = '/customer/chat/configs/auto-message',
  ChatConfigsAbsenceMessage = '/customer/chat/configs/absence-message',
  ChatConfigsFrequentlyQuestion = '/customer/chat/configs/frequently-question',
  ChatConfigsSplitConversation = '/customer/chat/configs/split-conversation',
  ChatConfigsChatBotScript = '/customer/chat/configs/chatbot-script',
  ChatConfigsChatBotKeyword = '/customer/chat/configs/chatbot-keyword',
  ChatBot = '/customer/chat/bot',
  // STAFF
  Staff = '/staff',
  StaffManagement = '/staff/management',
  Role = '/staff/role',
  // REPORT
  Report = '/report',
  ReportPNL = '/report/pnl',
  ReportRevenue = '/report/revenue',
  ReportTransaction = '/report/transaction',
  ReportInventory = '/report/inventory',
  Setting = '/setting',
  Commission = '/affiliate/trainer',
}
