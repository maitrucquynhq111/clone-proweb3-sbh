import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { MainRouteKeys, ErrorRouteKeys } from '../enums';
import { MainRoutes } from './config';
import { PermissionsWrapper } from '~app/utils/shield';

const routers: RouteObject = {
  path: MainRoutes[MainRouteKeys.Root].path,
  element: MainRoutes[MainRouteKeys.Root].element,
  children: [
    {
      path: MainRoutes[MainRouteKeys.Root].path,
      element: <Navigate to={MainRoutes[MainRouteKeys.Todo].path} replace />,
    },
    {
      path: MainRoutes[MainRouteKeys.Todo].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Todo].element}
          permissionNames={MainRoutes[MainRouteKeys.Todo].permissions}
          packages={MainRoutes[MainRouteKeys.Todo].packages}
        />
      ),
    },
    {
      path: MainRoutes[MainRouteKeys.Pos].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Pos].element}
          permissionNames={MainRoutes[MainRouteKeys.Pos].permissions}
          packages={MainRoutes[MainRouteKeys.Pos].packages}
        />
      ),
    },
    {
      path: MainRoutes[MainRouteKeys.Table].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Table].element}
          permissionNames={MainRoutes[MainRouteKeys.Table].permissions}
          packages={MainRoutes[MainRouteKeys.Table].packages}
          addonKey="table_tablelist_view"
        />
      ),
    },
    {
      path: MainRoutes[MainRouteKeys.Finance].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Finance].element}
          permissionNames={MainRoutes[MainRouteKeys.Finance].permissions}
        />
      ),
      children: [
        {
          path: MainRoutes[MainRouteKeys.CashbookList].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.CashbookList].element}
              permissionNames={MainRoutes[MainRouteKeys.CashbookList].permissions}
              packages={MainRoutes[MainRouteKeys.CashbookList].packages}
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.CashbookDebt].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.CashbookDebt].element}
              permissionNames={MainRoutes[MainRouteKeys.CashbookDebt].permissions}
              packages={MainRoutes[MainRouteKeys.CashbookDebt].packages}
              addonKey="debt_book"
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.CashbookTransaction].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.CashbookTransaction].element}
              permissionNames={MainRoutes[MainRouteKeys.CashbookTransaction].permissions}
              packages={MainRoutes[MainRouteKeys.CashbookTransaction].packages}
              addonKey="income_expenditure"
            />
          ),
        },
        {
          path: '*',
          element: <Navigate to={ErrorRouteKeys.NotFound} replace />,
        },
      ],
    },
    {
      path: MainRoutes[MainRouteKeys.Orders].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Orders].element}
          permissionNames={MainRoutes[MainRouteKeys.Orders].permissions}
          packages={MainRoutes[MainRouteKeys.Orders].packages}
          addonKey="order_management"
        />
      ),
    },
    {
      path: MainRoutes[MainRouteKeys.Products].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Products].element}
          permissionNames={MainRoutes[MainRouteKeys.Products].permissions}
        />
      ),
      children: [
        {
          path: MainRoutes[MainRouteKeys.ProductsList].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.ProductsList].element}
              permissionNames={MainRoutes[MainRouteKeys.ProductsList].permissions}
              packages={MainRoutes[MainRouteKeys.ProductsList].packages}
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.ProductAddon].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.ProductAddon].element}
              permissionNames={MainRoutes[MainRouteKeys.ProductAddon].permissions}
              packages={MainRoutes[MainRouteKeys.ProductAddon].packages}
              addonKey="product_addon_all"
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.PrintBarCode].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.PrintBarCode].element}
              permissionNames={MainRoutes[MainRouteKeys.PrintBarCode].permissions}
              packages={MainRoutes[MainRouteKeys.PrintBarCode].packages}
            />
          ),
        },
        {
          path: '*',
          element: <Navigate to={ErrorRouteKeys.NotFound} replace />,
        },
      ],
    },
    {
      path: MainRoutes[MainRouteKeys.Channel].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Channel].element}
          permissionNames={MainRoutes[MainRouteKeys.Channel].permissions}
        />
      ),
      children: [
        {
          path: MainRoutes[MainRouteKeys.Website].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.Website].element}
              permissionNames={MainRoutes[MainRouteKeys.Website].permissions}
              packages={MainRoutes[MainRouteKeys.Website].packages}
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.Ecom].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.Ecom].element}
              permissionNames={MainRoutes[MainRouteKeys.Ecom].permissions}
              packages={MainRoutes[MainRouteKeys.Ecom].packages}
              addonKey="online_channels_list"
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.Social].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.Social].element}
              permissionNames={MainRoutes[MainRouteKeys.Social].permissions}
              packages={MainRoutes[MainRouteKeys.Social].packages}
            />
          ),
        },
        {
          path: '*',
          element: <Navigate to={ErrorRouteKeys.NotFound} replace />,
        },
      ],
    },
    {
      path: MainRoutes[MainRouteKeys.Ingredients].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Ingredients].element}
          permissionNames={MainRoutes[MainRouteKeys.Ingredients].permissions}
        />
      ),
      children: [
        {
          path: MainRoutes[MainRouteKeys.IngredientsList].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.IngredientsList].element}
              permissionNames={MainRoutes[MainRouteKeys.IngredientsList].permissions}
              packages={MainRoutes[MainRouteKeys.IngredientsList].packages}
              addonKey="customer_ingredient_management"
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.Recipe].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.Recipe].element}
              permissionNames={MainRoutes[MainRouteKeys.Recipe].permissions}
              packages={MainRoutes[MainRouteKeys.Recipe].packages}
            />
          ),
        },
        {
          path: '*',
          element: <Navigate to={ErrorRouteKeys.NotFound} replace />,
        },
      ],
    },
    {
      path: MainRoutes[MainRouteKeys.Contacts].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Contacts].element}
          permissionNames={MainRoutes[MainRouteKeys.Contacts].permissions}
        />
      ),
      children: [
        {
          path: MainRoutes[MainRouteKeys.ContactsList].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.ContactsList].element}
              permissionNames={MainRoutes[MainRouteKeys.ContactsList].permissions}
              packages={MainRoutes[MainRouteKeys.ContactsList].packages}
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.ContactsGroup].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.ContactsGroup].element}
              permissionNames={MainRoutes[MainRouteKeys.ContactsGroup].permissions}
              packages={MainRoutes[MainRouteKeys.ContactsGroup].packages}
            />
          ),
        },
        {
          path: '*',
          element: <Navigate to={ErrorRouteKeys.NotFound} replace />,
        },
      ],
    },
    {
      path: MainRoutes[MainRouteKeys.Inventory].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Inventory].element}
          permissionNames={MainRoutes[MainRouteKeys.Inventory].permissions}
        />
      ),
      children: [
        {
          path: MainRoutes[MainRouteKeys.Warehouse].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.Warehouse].element}
              permissionNames={MainRoutes[MainRouteKeys.Warehouse].permissions}
              packages={MainRoutes[MainRouteKeys.Warehouse].packages}
              addonKey="inventory_productlist_advance"
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.StockTaking].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.StockTaking].element}
              permissionNames={MainRoutes[MainRouteKeys.StockTaking].permissions}
              packages={MainRoutes[MainRouteKeys.StockTaking].packages}
              addonKey="inventory_productlist_advance"
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.InventoryBook].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.InventoryBook].element}
              permissionNames={MainRoutes[MainRouteKeys.InventoryBook].permissions}
              packages={MainRoutes[MainRouteKeys.InventoryBook].packages}
              addonKey="inventory_productlist_basic"
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.InventoryImportBook].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.InventoryImportBook].element}
              permissionNames={MainRoutes[MainRouteKeys.InventoryImportBook].permissions}
              packages={MainRoutes[MainRouteKeys.InventoryImportBook].packages}
              addonKey="inventory_productlist_advance"
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.InventoryExportBook].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.InventoryExportBook].element}
              permissionNames={MainRoutes[MainRouteKeys.InventoryExportBook].permissions}
              packages={MainRoutes[MainRouteKeys.InventoryExportBook].packages}
              addonKey="inventory_productlist_advance"
            />
          ),
        },
        {
          path: '*',
          element: <Navigate to={ErrorRouteKeys.NotFound} replace />,
        },
      ],
    },
    {
      path: MainRoutes[MainRouteKeys.Chat].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Chat].element}
          permissionNames={MainRoutes[MainRouteKeys.Chat].permissions}
        />
      ),
      children: [
        {
          path: MainRoutes[MainRouteKeys.ChatInbox].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.ChatInbox].element}
              permissionNames={MainRoutes[MainRouteKeys.ChatInbox].permissions}
              packages={MainRoutes[MainRouteKeys.ChatInbox].packages}
            />
          ),
          children: [
            {
              path: MainRoutes[MainRouteKeys.ChatInboxDetails].path,
              element: (
                <PermissionsWrapper
                  element={MainRoutes[MainRouteKeys.ChatInboxDetails].element}
                  permissionNames={MainRoutes[MainRouteKeys.ChatInboxDetails].permissions}
                  packages={MainRoutes[MainRouteKeys.ChatInboxDetails].packages}
                />
              ),
            },
            {
              path: '*',
              element: <Navigate to={ErrorRouteKeys.NotFound} replace />,
            },
          ],
        },
        {
          path: MainRoutes[MainRouteKeys.ChatConfigs].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.ChatConfigs].element}
              permissionNames={MainRoutes[MainRouteKeys.ChatConfigs].permissions}
            />
          ),
          children: [
            {
              path: MainRoutes[MainRouteKeys.ChatConfigs].path,
              element: <Navigate to={MainRoutes[MainRouteKeys.ChatConfigsPages].path} replace={true} />,
            },
            {
              path: MainRoutes[MainRouteKeys.ChatConfigsPages].path,
              element: (
                <PermissionsWrapper
                  element={MainRoutes[MainRouteKeys.ChatConfigsPages].element}
                  permissionNames={MainRoutes[MainRouteKeys.ChatConfigsPages].permissions}
                  packages={MainRoutes[MainRouteKeys.ChatConfigsPages].packages}
                />
              ),
            },
            {
              path: MainRoutes[MainRouteKeys.ChatConfigsGeneral].path,
              element: (
                <PermissionsWrapper
                  element={MainRoutes[MainRouteKeys.ChatConfigsGeneral].element}
                  permissionNames={MainRoutes[MainRouteKeys.ChatConfigsGeneral].permissions}
                  packages={MainRoutes[MainRouteKeys.ChatConfigsGeneral].packages}
                />
              ),
            },
            {
              path: MainRoutes[MainRouteKeys.ChatConfigsLabel].path,
              element: (
                <PermissionsWrapper
                  element={MainRoutes[MainRouteKeys.ChatConfigsLabel].element}
                  permissionNames={MainRoutes[MainRouteKeys.ChatConfigsLabel].permissions}
                  packages={MainRoutes[MainRouteKeys.ChatConfigsLabel].packages}
                />
              ),
            },
            {
              path: MainRoutes[MainRouteKeys.ChatConfigsComment].path,
              element: (
                <PermissionsWrapper
                  element={MainRoutes[MainRouteKeys.ChatConfigsComment].element}
                  permissionNames={MainRoutes[MainRouteKeys.ChatConfigsComment].permissions}
                  packages={MainRoutes[MainRouteKeys.ChatConfigsComment].packages}
                />
              ),
            },
            {
              path: MainRoutes[MainRouteKeys.ChatConfigsQuickMessage].path,
              element: (
                <PermissionsWrapper
                  element={MainRoutes[MainRouteKeys.ChatConfigsQuickMessage].element}
                  permissionNames={MainRoutes[MainRouteKeys.ChatConfigsQuickMessage].permissions}
                  packages={MainRoutes[MainRouteKeys.ChatConfigsQuickMessage].packages}
                />
              ),
            },
            {
              path: MainRoutes[MainRouteKeys.ChatConfigsAutoMessage].path,
              element: (
                <PermissionsWrapper
                  element={MainRoutes[MainRouteKeys.ChatConfigsAutoMessage].element}
                  permissionNames={MainRoutes[MainRouteKeys.ChatConfigsAutoMessage].permissions}
                  packages={MainRoutes[MainRouteKeys.ChatConfigsAutoMessage].packages}
                />
              ),
            },
            {
              path: MainRoutes[MainRouteKeys.ChatConfigsAbsenceMessage].path,
              element: (
                <PermissionsWrapper
                  element={MainRoutes[MainRouteKeys.ChatConfigsAbsenceMessage].element}
                  permissionNames={MainRoutes[MainRouteKeys.ChatConfigsAbsenceMessage].permissions}
                  packages={MainRoutes[MainRouteKeys.ChatConfigsAbsenceMessage].packages}
                />
              ),
            },
            {
              path: MainRoutes[MainRouteKeys.ChatConfigsFrequentlyQuestion].path,
              element: (
                <PermissionsWrapper
                  element={MainRoutes[MainRouteKeys.ChatConfigsFrequentlyQuestion].element}
                  permissionNames={MainRoutes[MainRouteKeys.ChatConfigsFrequentlyQuestion].permissions}
                  packages={MainRoutes[MainRouteKeys.ChatConfigsFrequentlyQuestion].packages}
                />
              ),
            },
            {
              path: MainRoutes[MainRouteKeys.ChatConfigsSplitConversation].path,
              element: (
                <PermissionsWrapper
                  element={MainRoutes[MainRouteKeys.ChatConfigsSplitConversation].element}
                  permissionNames={MainRoutes[MainRouteKeys.ChatConfigsSplitConversation].permissions}
                  packages={MainRoutes[MainRouteKeys.ChatConfigsSplitConversation].packages}
                />
              ),
            },
            {
              path: MainRoutes[MainRouteKeys.ChatConfigsChatBotScript].path,
              element: (
                <PermissionsWrapper
                  element={MainRoutes[MainRouteKeys.ChatConfigsChatBotScript].element}
                  permissionNames={MainRoutes[MainRouteKeys.ChatConfigsChatBotScript].permissions}
                  packages={MainRoutes[MainRouteKeys.ChatConfigsChatBotScript].packages}
                />
              ),
            },
            {
              path: MainRoutes[MainRouteKeys.ChatConfigsChatBotKeyword].path,
              element: (
                <PermissionsWrapper
                  element={MainRoutes[MainRouteKeys.ChatConfigsChatBotKeyword].element}
                  permissionNames={MainRoutes[MainRouteKeys.ChatConfigsChatBotKeyword].permissions}
                  packages={MainRoutes[MainRouteKeys.ChatInboxDetails].packages}
                />
              ),
            },
            {
              path: '*',
              element: <Navigate to={ErrorRouteKeys.NotFound} replace />,
            },
          ],
        },
        {
          path: MainRoutes[MainRouteKeys.ChatBot].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.ChatBot].element}
              permissionNames={MainRoutes[MainRouteKeys.ChatBot].permissions}
              packages={MainRoutes[MainRouteKeys.ChatBot].packages}
            />
          ),
        },
        {
          path: '*',
          element: <Navigate to={ErrorRouteKeys.NotFound} replace />,
        },
      ],
    },
    {
      path: MainRoutes[MainRouteKeys.Staff].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Staff].element}
          permissionNames={MainRoutes[MainRouteKeys.Staff].permissions}
        />
      ),
      children: [
        {
          path: MainRoutes[MainRouteKeys.StaffManagement].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.StaffManagement].element}
              permissionNames={MainRoutes[MainRouteKeys.StaffManagement].permissions}
              packages={MainRoutes[MainRouteKeys.StaffManagement].packages}
              addonKey="staff_all"
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.Role].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.Role].element}
              permissionNames={MainRoutes[MainRouteKeys.Role].permissions}
              packages={MainRoutes[MainRouteKeys.Role].packages}
              addonKey="staff_config"
            />
          ),
        },
        {
          path: '*',
          element: <Navigate to={ErrorRouteKeys.NotFound} replace />,
        },
      ],
    },
    {
      path: MainRoutes[MainRouteKeys.Report].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Report].element}
          permissionNames={MainRoutes[MainRouteKeys.Report].permissions}
        />
      ),
      children: [
        {
          path: MainRoutes[MainRouteKeys.ReportPNL].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.ReportPNL].element}
              permissionNames={MainRoutes[MainRouteKeys.ReportPNL].permissions}
              packages={MainRoutes[MainRouteKeys.ReportPNL].packages}
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.ReportRevenue].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.ReportRevenue].element}
              permissionNames={MainRoutes[MainRouteKeys.ReportRevenue].permissions}
              packages={MainRoutes[MainRouteKeys.ReportRevenue].packages}
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.ReportTransaction].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.ReportTransaction].element}
              permissionNames={MainRoutes[MainRouteKeys.ReportTransaction].permissions}
              packages={MainRoutes[MainRouteKeys.ReportTransaction].packages}
            />
          ),
        },
        {
          path: MainRoutes[MainRouteKeys.ReportInventory].path,
          element: (
            <PermissionsWrapper
              element={MainRoutes[MainRouteKeys.ReportInventory].element}
              permissionNames={MainRoutes[MainRouteKeys.ReportInventory].permissions}
              packages={MainRoutes[MainRouteKeys.ReportInventory].packages}
            />
          ),
        },
        {
          path: '*',
          element: <Navigate to={ErrorRouteKeys.NotFound} replace />,
        },
      ],
    },
    {
      path: MainRoutes[MainRouteKeys.Setting].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Setting].element}
          permissionNames={MainRoutes[MainRouteKeys.Setting].permissions}
          packages={MainRoutes[MainRouteKeys.Setting].packages}
        />
      ),
    },
    {
      path: MainRoutes[MainRouteKeys.Commission].path,
      element: (
        <PermissionsWrapper
          element={MainRoutes[MainRouteKeys.Commission].element}
          permissionNames={MainRoutes[MainRouteKeys.Commission].permissions}
        />
      ),
    },
    {
      path: '*',
      element: <Navigate to={ErrorRouteKeys.NotFound} replace />,
    },
  ],
};

export default routers;
