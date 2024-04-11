import cx from 'classnames';
import { ReactNode } from 'react';
import { BsCheck2All } from 'react-icons/bs';
import { PlaceholderImage } from '~app/components';

type Props = {
  className?: string;
  avatarClassName?: string;
  avatar?: string;
  title?: string;
  subTitle?: ReactNode;
  titleClassName?: string;
  subTitleClassName?: string;
  selected?: boolean;
  onClick?(): void;
};

const ContactInfo = ({
  avatar,
  title,
  subTitle,
  className,
  avatarClassName,
  titleClassName,
  subTitleClassName,
  selected,
  onClick,
}: Props) => {
  return (
    <div
      className={cx('pw-flex pw-gap-2 pw-relative', className, {
        'pw-bg-primary-background': selected,
      })}
      onClick={onClick}
    >
      <div className="pw-flex pw-items-center pw-gap-2">
        <div className={cx('!pw-w-10 !pw-h-10', avatarClassName)}>
          <PlaceholderImage
            className={cx('pw-bg-cover pw-rounded-full !pw-w-10 !pw-h-10 pw-object-cover', avatarClassName)}
            src={avatar}
            alt={title}
            isAvatar={true}
          />
        </div>
        <div>
          <h4 className={cx('pw-font-bold pw-text-left', titleClassName)}>{title}</h4>
          {subTitle && (
            <div className={cx('pw-text-neutral-500 pw-text-sm pw-font-normal pw-text-left', subTitleClassName)}>
              {subTitle}
            </div>
          )}
        </div>
      </div>
      {selected && (
        <div className="pw-text-green-700">
          <BsCheck2All size={24} />
        </div>
      )}
    </div>
  );
};

export default ContactInfo;
