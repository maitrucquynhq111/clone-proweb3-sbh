import { useTranslation } from 'react-i18next';
import { BlockContentProps } from './type';
import { EmptyStateUploadImage } from '~app/components/Icons';

export default function BlockContent({ icon = <EmptyStateUploadImage />, description }: BlockContentProps) {
  const { t } = useTranslation(['products-form']);
  return (
    <div className="pw-h-full pw-flex pw-items-center pw-justify-center pw-flex-col">
      {icon}
      <span className="pw-text-sm pw-text-center pw-mx-2">{description || t('upload_description')}</span>
    </div>
  );
}
