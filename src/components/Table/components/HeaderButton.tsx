import { IconButton } from 'rsuite';
import ReloadIcon from '@rsuite/icons/Reload';
// import { FaExpand, FaCompress } from 'react-icons/fa';
// import { gridActions } from '../actions';

type ActionButtonProps = {
  onRefetch: () => void;
  dispatch: ExpectedAny;
  dataGridViewState: ExpectedAny;
  headerButton: React.ReactNode;
  disableRefresh?: boolean;
};

const HeaderButton = (props: ActionButtonProps) => {
  const {
    onRefetch,
    headerButton,
    disableRefresh,
    // dispatch,
    // dataGridViewState,
  } = props;
  // const { compact } = dataGridViewState;

  // const toggleCompact = () => {
  //   gridActions.changeCompact(dispatch)(!compact);
  // };

  return (
    <div className="pw-flex pw-justify-between pw-items-center">
      <div></div>
      <div className="pw-flex pw-space-x-1">
        {headerButton && headerButton}
        {/* {!disableRefresh && (
          <IconButton className="!pw-bg-transparent" size="sm" icon={<ReloadIcon />} onClick={onRefetch} />
        )} */}
        {/* <IconButton
          size="xs"
          icon={compact ? <FaCompress /> : <FaExpand />}
          onClick={toggleCompact}
        /> */}
      </div>
    </div>
  );
};

export default HeaderButton;
