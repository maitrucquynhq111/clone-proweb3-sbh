import { BsDownload, BsEye } from 'react-icons/bs';

export enum ExportType {
  VIEW = 'view',
  DOWNLOAD = 'download',
}

export const ExportTypeIcon = {
  [ExportType.VIEW]: <BsEye size={24} />,
  [ExportType.DOWNLOAD]: <BsDownload size={22} />,
};

export enum ExportDataType {
  PRODUCT = 'product',
  ORDER = 'order',
  CASHBOOK = 'cashbook',
  INVENTORY = 'inventory',
  INVENTORY_BOOK = 'inventory-book',
  INVENTORY_IMPORT_BOOK = 'inventory-import-book',
  INVENTORY_EXPORT_BOOK = 'inventory-export-book',
  STOCK_TAKING = 'stock-taking',
  CONTACT = 'contact',
  DEBT = 'debt',
}

type Appearance = 'default' | 'primary' | 'link' | 'subtle' | 'ghost';
type Size = 'lg' | 'md' | 'sm' | 'xs';

export type ButtonExportTableProps<OptionsType> = {
  size?: Size;
  appearance?: Appearance;
  className?: string;
  title?: string;
  dataType: ExportDataType;
  options?: OptionsType;
  type: ExportType;
  isBuffer?: boolean;
};
