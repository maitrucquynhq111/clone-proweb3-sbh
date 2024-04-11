import { Avatar } from 'rsuite';
import cx from 'classnames';
import { ButtonTransparent } from '~app/components';
import { IconFacebook } from '~app/components/Icons';

type Props = {
  page: Page;
  activePage: Page | null;
  onClick: (value: Page) => void;
};

const PageTabItem = ({ page, activePage, onClick }: Props) => {
  return (
    <ButtonTransparent className="!pw-mr-4 !pw-rounded-bl-none !pw-rounded-br-none" onClick={() => onClick(page)}>
      <div
        className={cx('pw-flex pw-items-center pw-p-3 !pw-bg-neutral-border', {
          '!pw-bg-neutral-white': activePage?.id === page.id,
        })}
      >
        <div className="pw-relative pw-mr-4">
          <Avatar circle src={page.page_avatar} alt={page.page_name} className="!pw-w-10 !pw-h-10" />
          <div className="pw-absolute pw-bottom-1 pw-right-0 pw-border pw-border-neutral-background pw-rounded-full pw-bg-white">
            <IconFacebook size="16" />
          </div>
        </div>
        <div
          className={cx('pw-text-base line-clamp-1', {
            '!pw-text-primary-main pw-font-bold': activePage?.id === page.id,
          })}
        >
          {page.page_name}
        </div>
      </div>
    </ButtonTransparent>
  );
};

export default PageTabItem;
