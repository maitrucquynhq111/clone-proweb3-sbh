import { Checkbox } from 'rsuite';
import { ValueType } from 'rsuite/esm/Checkbox';
import PageItem from '../PageItem';

type Props = { data: ExpectedAny; disabled?: boolean; disableLink?: boolean; selected: ValueType[] };

const NotConnectItem = ({ data, disabled = false, disableLink = false, selected }: Props) => {
  return (
    <div className="pw-flex pw pw-items-center pw-border-neutral-divider pw-border-b pw-py-2 pw-px-4 pw-cursor-pointer">
      <Checkbox
        disabled={disabled || (!selected.includes(data.id) && disableLink)}
        value={data.id}
        inline={true}
        className="pw-mr-4 page-choosen"
      >
        <PageItem data={data} />
      </Checkbox>
    </div>
  );
};

export default NotConnectItem;
