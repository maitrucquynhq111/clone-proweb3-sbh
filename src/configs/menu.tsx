import { TFunction } from 'i18next';
import { FaBarcode, FaAddressBook, FaMoneyBill, FaTags, FaRobot, FaWarehouse, FaBook } from 'react-icons/fa';
import {
  BsArrowLeftRight,
  BsFileEarmarkTextFill,
  BsChatDotsFill,
  BsGearFill,
  BsArchiveFill,
  BsSave2Fill,
  BsFillFileEarmarkDiffFill,
  // BsGlobe,
  BsGlobe2,
  BsShareFill,
  BsCartFill,
  BsPeopleFill,
  BsPersonCheckFill,
  BsGraphUp,
  BsCashStack,
  BsCurrencyExchange,
  BsBoxSeam,
} from 'react-icons/bs';
import { IoReceiptSharp } from 'react-icons/io5';
import { MdRestaurantMenu, MdShoppingCart } from 'react-icons/md';
import { HiHome } from 'react-icons/hi';
import { RiBookReadFill } from 'react-icons/ri';
import { MainRouteKeys } from '~app/routes/enums';
import { MainRoutes } from '~app/routes/main/config';
import { RouteItem } from '~app/routes/types';
import { validatePermissions } from '~app/utils/shield';

type MenuItem = RouteItem & {
  childs?: RouteItem[];
};

const filterPermissions = (item: MenuItem): ExpectedAny => {
  if (item?.childs)
    return validatePermissions(
      {
        ...item,
        childs: item.childs.map((child: RouteItem) => filterPermissions(child)).filter((item) => item),
      },
      item.permissions,
    );
  return validatePermissions(item, item.permissions);
};

export const menusRenderer = (t: TFunction) => {
  const filteredItems = [
    {
      title: t(MainRoutes[MainRouteKeys.Todo].name as string),
      path: MainRoutes[MainRouteKeys.Todo].path,
      icon: <HiHome size={20} />,
      permissions: MainRoutes[MainRouteKeys.Todo].permissions,
    },
    {
      title: t(MainRoutes[MainRouteKeys.Pos].name as string),
      path: MainRoutes[MainRouteKeys.Pos].path,
      icon: <MdShoppingCart size={20} />,
      permissions: MainRoutes[MainRouteKeys.Pos].permissions,
    },
    {
      title: t(MainRoutes[MainRouteKeys.Orders].name as string),
      path: MainRoutes[MainRouteKeys.Orders].path,
      icon: <BsFileEarmarkTextFill size={20} />,
      permissions: MainRoutes[MainRouteKeys.Orders].permissions,
    },
    {
      title: t(MainRoutes[MainRouteKeys.Goods].name as string),
      path: MainRoutes[MainRouteKeys.Products].path,
      icon: <BsArchiveFill size={20} />,
      permissions: MainRoutes[MainRouteKeys.Goods].permissions,
      childs: [
        {
          title: t(MainRoutes[MainRouteKeys.ProductsList].name as string),
          path: MainRoutes[MainRouteKeys.ProductsList].path,
          icon: <BsArchiveFill size={20} />,
          permissions: MainRoutes[MainRouteKeys.ProductsList].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.ProductAddon].name as string),
          path: MainRoutes[MainRouteKeys.ProductAddon].path,
          icon: <FaTags size={20} />,
          permissions: MainRoutes[MainRouteKeys.ProductAddon].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.PrintBarCode].name as string),
          path: MainRoutes[MainRouteKeys.PrintBarCode].path,
          icon: <FaBarcode size={20} />,
          permissions: MainRoutes[MainRouteKeys.PrintBarCode].permissions,
        },
      ],
    },
    {
      title: t(MainRoutes[MainRouteKeys.Goods].name as string),
      path: MainRoutes[MainRouteKeys.Ingredients].path,
      icon: <MdRestaurantMenu size={20} />,
      permissions: MainRoutes[MainRouteKeys.Ingredients].permissions,
      childs: [
        {
          title: t(MainRoutes[MainRouteKeys.IngredientsList].name as string),
          path: MainRoutes[MainRouteKeys.IngredientsList].path,
          icon: <MdRestaurantMenu size={20} />,
          permissions: MainRoutes[MainRouteKeys.IngredientsList].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.Recipe].name as string),
          path: MainRoutes[MainRouteKeys.Recipe].path,
          icon: <IoReceiptSharp size={20} />,
          permissions: MainRoutes[MainRouteKeys.Recipe].permissions,
        },
      ],
    },
    {
      title: t(MainRoutes[MainRouteKeys.Contacts].name as string),
      path: MainRoutes[MainRouteKeys.Contacts].path,
      icon: <FaAddressBook size={20} />,
      permissions: MainRoutes[MainRouteKeys.Contacts].permissions,
      childs: [
        {
          title: t(MainRoutes[MainRouteKeys.ContactsList].name as string),
          path: MainRoutes[MainRouteKeys.ContactsList].path,
          icon: <FaAddressBook size={20} />,
          permissions: MainRoutes[MainRouteKeys.ContactsList].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.ContactsGroup].name as string),
          path: MainRoutes[MainRouteKeys.ContactsGroup].path,
          icon: <BsPeopleFill size={20} />,
          permissions: MainRoutes[MainRouteKeys.ContactsGroup].permissions,
        },
      ],
    },
    {
      title: t(MainRoutes[MainRouteKeys.Finance].name as string),
      path: MainRoutes[MainRouteKeys.Finance].path,
      icon: <FaMoneyBill size={20} />,
      permissions: MainRoutes[MainRouteKeys.Finance].permissions,
      childs: [
        {
          title: t(MainRoutes[MainRouteKeys.CashbookTransaction].name as string),
          path: MainRoutes[MainRouteKeys.CashbookTransaction].path,
          icon: <FaMoneyBill size={20} />,
          permissions: MainRoutes[MainRouteKeys.CashbookTransaction].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.CashbookList].name as string),
          path: MainRoutes[MainRouteKeys.CashbookList].path,
          icon: <BsArrowLeftRight size={20} />,
          permissions: MainRoutes[MainRouteKeys.CashbookList].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.CashbookDebt].name as string),
          path: MainRoutes[MainRouteKeys.CashbookDebt].path,
          icon: <FaBook size={20} />,
          permissions: MainRoutes[MainRouteKeys.CashbookDebt].permissions,
        },
      ],
    },
    {
      title: t(MainRoutes[MainRouteKeys.Goods].name as string),
      path: MainRoutes[MainRouteKeys.Inventory].path,
      icon: <FaWarehouse size={20} />,
      permissions: MainRoutes[MainRouteKeys.Inventory].permissions,
      childs: [
        {
          title: t(MainRoutes[MainRouteKeys.Warehouse].name as string),
          path: MainRoutes[MainRouteKeys.Warehouse].path,
          icon: <FaWarehouse size={20} />,
          permissions: MainRoutes[MainRouteKeys.Warehouse].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.InventoryBook].name as string),
          path: MainRoutes[MainRouteKeys.InventoryBook].path,
          icon: <RiBookReadFill size={20} />,
          permissions: MainRoutes[MainRouteKeys.InventoryBook].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.InventoryImportBook].name as string),
          path: MainRoutes[MainRouteKeys.InventoryImportBook].path,
          icon: <BsSave2Fill size={20} />,
          permissions: MainRoutes[MainRouteKeys.InventoryImportBook].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.InventoryExportBook].name as string),
          path: MainRoutes[MainRouteKeys.InventoryExportBook].path,
          icon: <BsSave2Fill size={20} className="pw-rotate-180" />,
          permissions: MainRoutes[MainRouteKeys.InventoryExportBook].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.StockTaking].name as string),
          path: MainRoutes[MainRouteKeys.StockTaking].path,
          icon: <BsFillFileEarmarkDiffFill size={20} />,
          permissions: MainRoutes[MainRouteKeys.StockTaking].permissions,
        },
      ],
    },
    {
      title: t(MainRoutes[MainRouteKeys.Chat].name as string),
      path: MainRoutes[MainRouteKeys.Chat].path,
      icon: <BsChatDotsFill size={20} />,
      permissions: MainRoutes[MainRouteKeys.Chat].permissions,
      childs: [
        {
          title: t(MainRoutes[MainRouteKeys.ChatInbox].name as string),
          path: MainRoutes[MainRouteKeys.ChatInbox].path,
          icon: <BsChatDotsFill size={20} />,
          permissions: MainRoutes[MainRouteKeys.ChatInbox].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.ChatConfigs].name as string),
          path: MainRoutes[MainRouteKeys.ChatConfigs].path,
          icon: <BsGearFill size={20} />,
          permissions: MainRoutes[MainRouteKeys.ChatConfigs].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.ChatBot].name as string),
          path: MainRoutes[MainRouteKeys.ChatBot].path,
          icon: <FaRobot size={20} />,
          permissions: MainRoutes[MainRouteKeys.ChatBot].permissions,
        },
      ],
    },
  ]
    .map((item: MenuItem) => filterPermissions(item))
    .filter((item) => item);
  return filteredItems;
};

export const menusSidebarRenderer = (t: TFunction) => {
  const filteredItems = [
    {
      title: t(MainRoutes[MainRouteKeys.Todo].name as string),
      path: MainRoutes[MainRouteKeys.Todo].path,
      icon: <HiHome size={24} />,
      permissions: MainRoutes[MainRouteKeys.Todo].permissions,
    },
    {
      title: t(MainRoutes[MainRouteKeys.Sales].name as string),
      path: MainRoutes[MainRouteKeys.Sales].path,
      icon: <MdShoppingCart size={20} />,
      defaultOpen: true,
      permissions: MainRoutes[MainRouteKeys.Sales].permissions,
      childs: [
        {
          title: t(MainRoutes[MainRouteKeys.Pos].title as string),
          path: MainRoutes[MainRouteKeys.Pos].path,
          icon: <MdShoppingCart size={20} />,
          permissions: MainRoutes[MainRouteKeys.Pos].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.Orders].name as string),
          path: MainRoutes[MainRouteKeys.Orders].path,
          icon: <BsFileEarmarkTextFill size={20} />,
          permissions: MainRoutes[MainRouteKeys.Orders].permissions,
        },
      ],
    },
    {
      title: t(MainRoutes[MainRouteKeys.Goods].name as string),
      path: MainRoutes[MainRouteKeys.Goods].path,
      icon: <BsArchiveFill size={20} />,
      defaultOpen: true,
      permissions: MainRoutes[MainRouteKeys.Goods].permissions,
      childs: [
        {
          title: t(MainRoutes[MainRouteKeys.Products].name as string),
          path: MainRoutes[MainRouteKeys.Products].path,
          icon: <BsArchiveFill size={20} />,
          permissions: MainRoutes[MainRouteKeys.Products].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.Warehouse].name as string),
          path: MainRoutes[MainRouteKeys.Warehouse].path,
          icon: <FaWarehouse size={20} />,
          permissions: MainRoutes[MainRouteKeys.Warehouse].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.Ingredients].name as string),
          path: MainRoutes[MainRouteKeys.Ingredients].path,
          icon: <MdRestaurantMenu size={20} />,
          permissions: MainRoutes[MainRouteKeys.Ingredients].permissions,
        },
      ],
    },
    {
      title: t(MainRoutes[MainRouteKeys.Channel].name as string),
      path: MainRoutes[MainRouteKeys.Channel].path,
      icon: <BsGlobe2 size={20} />,
      permissions: MainRoutes[MainRouteKeys.Channel].permissions,
      childs: [
        {
          title: t(MainRoutes[MainRouteKeys.Website].name as string),
          path: MainRoutes[MainRouteKeys.Website].path,
          icon: <BsGlobe2 size={20} />,
          permissions: MainRoutes[MainRouteKeys.Website].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.Ecom].name as string),
          path: MainRoutes[MainRouteKeys.Ecom].path,
          icon: <BsCartFill size={20} />,
          permissions: MainRoutes[MainRouteKeys.Ecom].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.Social].name as string),
          path: MainRoutes[MainRouteKeys.Social].path,
          icon: <BsShareFill size={20} />,
          permissions: MainRoutes[MainRouteKeys.Social].permissions,
        },
      ],
    },
    {
      title: t(MainRoutes[MainRouteKeys.Finance].name as string),
      path: MainRoutes[MainRouteKeys.Finance].path,
      icon: <FaMoneyBill size={20} />,
      permissions: MainRoutes[MainRouteKeys.Finance].permissions,
      childs: [
        {
          title: t(MainRoutes[MainRouteKeys.CashbookTransaction].name as string),
          path: MainRoutes[MainRouteKeys.CashbookTransaction].path,
          icon: <FaMoneyBill size={20} />,
          permissions: MainRoutes[MainRouteKeys.CashbookTransaction].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.CashbookList].name as string),
          path: MainRoutes[MainRouteKeys.CashbookList].path,
          icon: <BsArrowLeftRight size={20} />,
          permissions: MainRoutes[MainRouteKeys.CashbookList].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.CashbookDebt].name as string),
          path: MainRoutes[MainRouteKeys.CashbookDebt].path,
          icon: <FaBook size={20} />,
          permissions: MainRoutes[MainRouteKeys.CashbookDebt].permissions,
        },
      ],
    },
    {
      title: t(MainRoutes[MainRouteKeys.Customer].name as string),
      path: MainRoutes[MainRouteKeys.Customer].path,
      icon: <FaAddressBook size={20} />,
      permissions: MainRoutes[MainRouteKeys.Customer].permissions,
      childs: [
        {
          title: t(MainRoutes[MainRouteKeys.ContactsList].name as string),
          path: MainRoutes[MainRouteKeys.ContactsList].path,
          icon: <FaAddressBook size={20} />,
          permissions: MainRoutes[MainRouteKeys.ContactsList].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.ChatInbox].name as string),
          path: MainRoutes[MainRouteKeys.ChatInbox].path,
          icon: <BsChatDotsFill size={20} />,
          permissions: MainRoutes[MainRouteKeys.ChatInbox].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.ChatConfigs].name as string),
          path: MainRoutes[MainRouteKeys.ChatConfigs].path,
          icon: <BsGearFill size={20} />,
          permissions: MainRoutes[MainRouteKeys.ChatConfigs].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.ChatBot].name as string),
          path: MainRoutes[MainRouteKeys.ChatBot].path,
          icon: <FaRobot size={20} />,
          permissions: MainRoutes[MainRouteKeys.ChatBot].permissions,
        },
      ],
    },
    {
      title: t(MainRoutes[MainRouteKeys.Staff].name as string),
      path: MainRoutes[MainRouteKeys.Staff].path,
      icon: <BsPeopleFill size={20} />,
      permissions: MainRoutes[MainRouteKeys.Staff].permissions,
      childs: [
        {
          title: t(MainRoutes[MainRouteKeys.StaffManagement].name as string),
          path: MainRoutes[MainRouteKeys.StaffManagement].path,
          icon: <BsPeopleFill size={20} />,
          permissions: MainRoutes[MainRouteKeys.StaffManagement].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.Role].name as string),
          path: MainRoutes[MainRouteKeys.Role].path,
          icon: <BsPersonCheckFill size={20} />,
          permissions: MainRoutes[MainRouteKeys.Role].permissions,
        },
      ],
    },
    {
      title: t(MainRoutes[MainRouteKeys.Report].name as string),
      path: MainRoutes[MainRouteKeys.Report].path,
      icon: <BsGraphUp size={20} />,
      permissions: MainRoutes[MainRouteKeys.Report].permissions,
      childs: [
        {
          title: t(MainRoutes[MainRouteKeys.ReportPNL].name as string),
          path: MainRoutes[MainRouteKeys.ReportPNL].path,
          icon: <BsGraphUp size={20} />,
          permissions: MainRoutes[MainRouteKeys.ReportPNL].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.ReportRevenue].name as string),
          path: MainRoutes[MainRouteKeys.ReportRevenue].path,
          icon: <BsCashStack size={20} />,
          permissions: MainRoutes[MainRouteKeys.ReportRevenue].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.ReportTransaction].name as string),
          path: MainRoutes[MainRouteKeys.ReportTransaction].path,
          icon: <BsCurrencyExchange size={20} />,
          permissions: MainRoutes[MainRouteKeys.ReportTransaction].permissions,
        },
        {
          title: t(MainRoutes[MainRouteKeys.ReportInventory].name as string),
          path: MainRoutes[MainRouteKeys.ReportInventory].path,
          icon: <BsBoxSeam size={20} />,
          permissions: MainRoutes[MainRouteKeys.ReportInventory].permissions,
        },
      ],
    },
  ]
    .map((item: MenuItem) => filterPermissions(item))
    .filter((item) => item);
  return filteredItems;
};
