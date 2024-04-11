import cx from 'classnames';
import SwitchLanguage from './SwitchLanguage';
import UserInfo from './UserInfo';
import { HeaderActionOutlet } from './HeaderAction';
import Feedback from './Feedback';
import Support from './Support';
import { useCurrentPath } from '~app/utils/hooks';
import { MainRouteKeys } from '~app/routes/enums';

export default function Header() {
  const { currentPage } = useCurrentPath();
  return (
    <header
      className={cx('pw-p-5 pw-border-b-gray-100 pw-border-b pw-h-14 pw-flex pw-justify-between pw-items-center', {
        'min-md:pw-hidden': currentPage?.path === MainRouteKeys.Commission,
      })}
    >
      <HeaderActionOutlet />
      <div className="pw-flex pw-space-x-1 pw-items-center">
        <Support />
        <Feedback />
        <SwitchLanguage />
        <UserInfo />
      </div>
    </header>
  );
}
