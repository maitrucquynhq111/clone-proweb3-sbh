import { memo } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import cx from 'classnames';
import { Button } from 'rsuite';
import EmptyStateSearch from '~app/components/Icons/EmptyStateSearch';

const EmptyState = ({
  isSearch = false,
  description1,
  description2,
  textBtn = '',
  icon,
  className,
  onClick,
  hiddenButton,
  hidePlusIcon,
  customButton,
}: {
  isSearch?: boolean;
  description1: string;
  description2?: string;
  textBtn?: string;
  icon: JSX.Element;
  className?: string;
  onClick?: () => void;
  hiddenButton?: boolean;
  hidePlusIcon?: boolean;
  customButton?: React.ReactNode;
}) => {
  return (
    <div className={cx('pw-flex pw-items-center pw-flex-col', className)}>
      {isSearch ? <EmptyStateSearch /> : icon}
      <div className="pw-text-base pw-mb-6 pw-text-center">
        <div>{description1}</div>
        {description2 && <div>{description2}</div>}
      </div>
      {!hiddenButton && (
        <>
          {customButton || (
            <Button
              className="!pw-font-bold"
              startIcon={!hidePlusIcon ? <BsPlusLg /> : null}
              appearance="primary"
              onClick={onClick}
            >
              {textBtn}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default memo(EmptyState);
