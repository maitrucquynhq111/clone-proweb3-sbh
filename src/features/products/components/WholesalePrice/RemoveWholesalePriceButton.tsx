import { BsTrash } from 'react-icons/bs';
import { IconButton } from 'rsuite';

type Props = {
  index: number;
  onClick(index: number): void;
};

const RemoveWholesalePriceButton = ({ index, onClick }: Props) => {
  return (
    <IconButton
      appearance="subtle"
      icon={<BsTrash size={24} className="pw-fill-neutral-secondary" />}
      onClick={() => {
        onClick(index);
      }}
    />
  );
};

export default RemoveWholesalePriceButton;
