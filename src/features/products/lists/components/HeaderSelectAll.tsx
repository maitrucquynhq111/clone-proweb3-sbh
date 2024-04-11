import { memo } from 'react';
import { IconButton } from 'rsuite';
import { MdMoreVert } from 'react-icons/md';
import { selectAllAction } from '../config';
import CategoryDropdown from './CategoryDropdown';
import { ActionMenu } from '~app/components';

type Props = {
  selected: string[];
};

const HeaderSelectAll = ({ selected }: Props) => {
  return (
    <div className="pw-flex pw-gap-2 pw-h-10 pw-items-center">
      <CategoryDropdown selected={selected} />
      <ActionMenu
        toggleRender={<IconButton appearance="primary" size="xs" icon={<MdMoreVert size="18" />} />}
        data={selectAllAction(selected)}
      />
    </div>
  );
};

export default memo(HeaderSelectAll);
