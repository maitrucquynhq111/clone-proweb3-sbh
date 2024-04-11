import { ReactNode } from 'react';
import { DropzoneOptions } from 'react-dropzone';

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean;
  file: CustomFile | string | null;
  helperText?: ReactNode;
  className?: string;
}

export interface UploadMultiFileProps extends DropzoneOptions {
  fileList: (string | PendingUploadImage)[];
  helperText?: ReactNode;
  error?: boolean;
  canRemoveAll?: boolean;
  title?: string;
  description?: string;
  maxFiles?: number;
  icon?: JSX.Element;
  errorForm?: string;
  errorMessage?: string;
  className?: string;
  showCloseButton?: boolean;
  conditionOpacity?: {
    index: number;
    package: string;
  };
  onRemove?: (index: number) => void;
  onChange?: (fileList: (string | PendingUploadImage)[]) => void;
  onRemoveAll?: VoidFunction;
}

export interface BlockContentProps {
  icon?: JSX.Element;
  description?: string;
}
