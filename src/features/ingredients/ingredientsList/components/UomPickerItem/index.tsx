import { useTranslation } from 'react-i18next';
import { Radio } from 'rsuite';
import ButtonTransparent from '~app/components/ButtonTransparent';

type Props = {
  checked: boolean;
  item: Uom;
  onChange(item: ExpectedAny): void;
};

const UomPickerItem = ({ checked, item, onChange }: Props) => {
  const { t } = useTranslation('ingredients-form');
  return (
    <ButtonTransparent onClick={() => onChange(item)}>
      <div className="custom-radio pw-flex pw-pl-4 pw-pr-2 pw-py-1 pw-items-center pw-justify-between">
        <h5 className="pw-text-sm pw-font-normal pw-max-w-xs pw-overflow-hidden pw-text-ellipsis">{item.name}</h5>
        <div>
          {item.is_standard && <span className="pw-text-neutral-placeholder">{t('uom_standard')}</span>}
          <Radio
            value={item.id}
            checked={checked}
            onChange={(value, _, event) => {
              event.stopPropagation();
              onChange(item);
            }}
          />
        </div>
      </div>
    </ButtonTransparent>
  );
};

export default UomPickerItem;
