import { v4 } from 'uuid';
import cx from 'classnames';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'rsuite';
import { BsPlusCircleFill, BsTrash } from 'react-icons/bs';
import LabelPicker from './LabelPicker';
import { FormLabel, TagInput } from '~app/components';

type Props = {
  className?: string;
};

const LabelKeyword = ({ className }: Props) => {
  const { t } = useTranslation('chat');
  const { control, getValues, setValue } = useFormContext<PendingAutoLabel>();

  const keywordLabels = useWatch({
    control: control,
    name: 'keyword_label',
    defaultValue: [],
  }) as KeywordLabel[];

  const handleAdd = () => {
    const currentValue = getValues('keyword_label');
    setValue('keyword_label', [...currentValue, { id: v4(), keywords: [], label: null }]);
  };

  const handleRemove = (selectedIndex: number) => {
    const currentValue = getValues('keyword_label');
    setValue('keyword_label', [...currentValue.filter((_, index) => index !== selectedIndex)]);
  };
  return (
    <div className={className}>
      {keywordLabels.map((item, index) => {
        const excludedLabels = keywordLabels.filter((currentItem) => item?.id !== currentItem?.id);
        return (
          <div
            key={item.id}
            className={cx({
              'pw-mt-6': index !== 0,
            })}
          >
            <div className="pw-grid pw-grid-cols-12 pw-gap-x-4">
              <FormLabel label={t('enter_keyword')} isRequired={true} className="pw-col-span-5" />
              <FormLabel label={t('attact_label')} isRequired={true} className="pw-col-span-5" />
            </div>
            <div className="pw-grid pw-grid-cols-12 pw-gap-x-4">
              <div className="pw-col-span-5">
                <TagInput
                  name={`keyword_label.${index}.keywords`}
                  placeholder={t('placeholder.keyword_label')}
                  className="pw-tag-input pw-h-full"
                />
              </div>
              <LabelPicker
                name={`keyword_label.${index}.label`}
                className="pw-col-span-5"
                excludedLabels={excludedLabels}
              />
              <div className="pw-col-span-2">
                <IconButton
                  appearance="subtle"
                  className="pw-w-full pw-h-10 !pw-flex pw-justify-center pw-items-center"
                  icon={<BsTrash size={24} className="pw-fill-neutral-secondary" />}
                  onClick={() => handleRemove(index)}
                />
              </div>
            </div>
          </div>
        );
      })}
      <button
        className="pw-flex pw-items-center pw-justify-center pw-gap-x-2 pw-mt-4"
        type="button"
        onClick={handleAdd}
      >
        <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={20} />
        <span className="pw-text-secondary-main-blue pw-text-sm pw-font-bold">{t('action.add_keyword_label')}</span>
      </button>
    </div>
  );
};

export default LabelKeyword;
