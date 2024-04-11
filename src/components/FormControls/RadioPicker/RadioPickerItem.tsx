import { Radio } from 'rsuite';
import ButtonTransparent from '~app/components/ButtonTransparent';

type Props = {
  checked: boolean;
  item: ExpectedAny;
  onChange(item: ExpectedAny): void;
};

const RadioPickerItem = ({ checked, item, onChange }: Props) => {
  return (
    <ButtonTransparent onClick={() => onChange(item)}>
      <div className="custom-radio pw-flex pw-px-4 pw-py-1 pw-items-center pw-justify-between">
        <h5 className="pw-text-sm pw-font-normal pw-max-w-xs pw-overflow-hidden pw-text-ellipsis">{item.label}</h5>
        <Radio
          value={item.value}
          checked={checked}
          onChange={(value, _, event) => {
            event.stopPropagation();
            onChange(item);
          }}
        />
      </div>
    </ButtonTransparent>
  );
};

export default RadioPickerItem;
