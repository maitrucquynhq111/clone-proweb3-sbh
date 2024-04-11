import { Checkbox } from 'rsuite';

type Props = {
  group: ContactGroup;
  checked: boolean;
  onChange(group: ContactGroup): void;
};

const ContactGroupItem = ({ group, checked, onChange }: Props) => {
  return (
    <div
      className="pw-grid pw-grid-cols-12 pw-py-2.5 pw-pr-2 pw-cursor-pointer"
      onClick={() => {
        if (checked === undefined) return;
        onChange(group);
      }}
    >
      <div className="pw-col-span-11 pw-flex pw-items-center">
        <div className="pw-min-w-[0.625rem] pw-w-5 pw-h-5 pw-border-[1px] pw-rounded-full pw-border-white pw-bg-primary-main pw-mr-3" />
        <span className="pw-text-base">{group.name}</span>
      </div>
      <div className="pw-col-span-1 pw-flex pw-items-center pw-justify-center">
        <Checkbox
          checked={checked}
          onClick={(e) => {
            e.stopPropagation();
            onChange(group);
          }}
        />
      </div>
    </div>
  );
};

export default ContactGroupItem;
