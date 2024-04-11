import { toast } from 'react-toastify';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExportType, ExportDataType } from './types';
import {
  ProductService,
  OrderService,
  CashbookService,
  InventoryService,
  ContactService,
  DebtService,
} from '~app/services/api';
import { URL_EXCEL_ONLINE } from '~app/configs';
import { createDownloadElement, downloadBuffer } from '~app/utils/helpers';

const services = (dataType: ExportDataType): ExpectedAny => {
  switch (dataType) {
    case ExportDataType.PRODUCT:
      return ProductService;
    case ExportDataType.ORDER:
      return OrderService;
    case ExportDataType.CASHBOOK:
      return CashbookService;
    case ExportDataType.INVENTORY:
      return InventoryService;
    case ExportDataType.CONTACT:
      return ContactService;
    case ExportDataType.DEBT:
      return DebtService;
    default:
      return;
  }
};

export async function exportData<OptionsType>(
  type: ExportType,
  dataType: ExportDataType,
  options?: OptionsType,
  isBuffer?: boolean,
  name?: string,
) {
  try {
    let response = null;
    switch (dataType) {
      case ExportDataType.INVENTORY_IMPORT_BOOK:
        response = await InventoryService.exportInventoryImportBook(options as ExpectedAny);
        break;
      case ExportDataType.INVENTORY_EXPORT_BOOK:
        response = await InventoryService.exportInventoryExportBook(options as ExpectedAny);
        break;
      case ExportDataType.INVENTORY_BOOK:
        response = await InventoryService.exportInventoryBook(options as ExpectedAny);
        break;
      case ExportDataType.STOCK_TAKING:
        response = await InventoryService.exportStockTaking(options as ExpectedAny);
        break;
      default:
        response = await (services(dataType) as ExpectedAny).exportData(options);
        break;
    }
    if (isBuffer) {
      downloadBuffer(response, name || 'export-data');
    } else {
      if (type === ExportType.VIEW) {
        window.open(`${URL_EXCEL_ONLINE}${response}`, '_blank');
      } else {
        createDownloadElement(response);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export function useExportData<OptionsType>() {
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation('notification');
  const handleExport = async (
    type: ExportType,
    dataType: ExportDataType,
    options?: OptionsType,
    isBuffer?: boolean,
    name?: string,
  ) => {
    setLoading(true);
    try {
      await exportData<OptionsType>(type, dataType, options, isBuffer, name);
      if (type === ExportType.DOWNLOAD) {
        await toast.success(t('download-success'));
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return {
    handleExport,
    loading,
  };
}
