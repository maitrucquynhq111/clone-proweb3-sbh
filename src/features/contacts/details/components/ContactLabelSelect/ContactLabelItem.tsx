import { Checkbox } from 'rsuite';

type Props = {
  label: ContactLabel;
  checked: boolean;
  onChange(label: ContactLabel): void;
};

const ContactLabelItem = ({ label, checked, onChange }: Props) => {
  return (
    <div
      className="pw-grid pw-grid-cols-12 pw-py-2.5 pw-pr-2 pw-cursor-pointer"
      onClick={() => {
        if (checked === undefined) return;
        onChange(label);
      }}
    >
      <div className="pw-col-span-11">
        <span className="pw-text-base">{label.name}</span>
      </div>
      <div className="pw-col-span-1">
        <Checkbox
          checked={checked}
          onClick={(e) => {
            e.stopPropagation();
            onChange(label);
          }}
        />
      </div>
    </div>
  );
};

export default ContactLabelItem;
