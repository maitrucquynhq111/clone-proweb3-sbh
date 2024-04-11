import { useTranslation } from 'react-i18next';
import { BsTrash } from 'react-icons/bs';
import { IconButton } from 'rsuite';
import { TagInput, TextInput } from '~app/components';

type Props = {
  name: string;
  index: number;
  onRemove(index: number): void;
};

const VariantItem = ({ name, index, onRemove }: Props) => {
  const { t } = useTranslation('products-form');
  return (
    <div className="pw-mb-4">
      <div className="pw-grid pw-grid-cols-12 pw-gap-4">
        <label className="pw-block pw-col-span-3 pw-mb-1 pw-text-sm">{t('attribute')}</label>
        <label className="pw-block pw-mb-1 pw-col-span-8 pw-text-sm">{t('attribute_type')}</label>
      </div>
      <div className="pw-grid pw-grid-cols-12 pw-gap-4">
        <div className="pw-col-span-3">
          <TextInput name={`${name}.attribute_type`} placeholder={t('placeholder.attribute_type') || ''} />
        </div>
        <div className="pw-col-span-8">
          <TagInput name={`${name}.attribute`} placeholder={t('placeholder.attribute')} className="pw-tag-input" />
        </div>
        <div className="pw-col-span-1">
          <IconButton
            appearance="subtle"
            className="pw-w-full pw-h-10 !pw-flex pw-justify-center pw-items-center"
            icon={<BsTrash size={24} className="pw-fill-neutral-secondary" />}
            onClick={() => onRemove(index)}
          />
        </div>
      </div>
    </div>
  );
};

export default VariantItem;
