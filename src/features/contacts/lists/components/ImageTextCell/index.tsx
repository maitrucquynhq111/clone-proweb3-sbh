import cx from 'classnames';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-toastify';
import PlaceholderImage from '~app/components/PlaceholderImage';

type Props = {
  id: string;
  image?: string;
  text: string;
  secondText?: string;
  isAvatar?: boolean;
  className?: string;
  textClassName?: string;
  secondTextClassName?: string;
  imageClassName?: string;
};

export default function ImageTextCell({
  id,
  image,
  text,
  secondText,
  isAvatar,
  className,
  textClassName,
  secondTextClassName,
  imageClassName,
}: Props) {
  const { t } = useTranslation('common');

  function handleMouseOver(icon: ExpectedAny) {
    icon.style.display = 'block';
  }

  function handleMouseOut(icon: ExpectedAny) {
    icon.style.display = 'none';
  }

  useEffect(() => {
    if (secondText) {
      const cell = document.getElementById(id);
      const icon = document.getElementById(`copy-icon-${id}`);
      if (cell && icon) {
        cell.addEventListener('mouseover', () => handleMouseOver(icon));
        cell.addEventListener('mouseout', () => handleMouseOut(icon));
        return () => {
          cell.removeEventListener('mouseover', handleMouseOver);
          cell.addEventListener('mouseout', handleMouseOut);
        };
      }
    }
  }, []);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(secondText || '');
    } else {
      (window as ExpectedAny).clipboardData.setData('Text', secondText);
    }
    toast.success(t('copy_success'));
  };

  return (
    <div id={id} className={cx('pw-flex pw-px-2 pw-items-center pw-gap-3 pw-w-full', className)}>
      <div className="pw-w-10 pw-min-w-fit pw-h-10">
        <PlaceholderImage
          className={cx('pw-bg-cover pw-rounded-md !pw-w-10 pw-h-10 pw-object-cover', imageClassName)}
          src={image}
          alt={text}
          isAvatar={isAvatar}
        />
      </div>
      <div
        className={cx('pw-flex pw-flex-col', {
          'pw-justify-between': !!secondTextClassName,
        })}
      >
        <div className={`pw-overflow-hidden pw-flex-1 pw-text-ellipsis ${textClassName}`}>{text}</div>
        {secondText && (
          <div
            className={`pw-flex pw-items-center pw-overflow-hidden pw-flex-1 pw-text-ellipsis ${secondTextClassName}`}
          >
            <span className="pw-mr-2">{secondText}</span>
            <span
              id={`copy-icon-${id}`}
              className="pw-text-neutral-placeholder pw-cursor-pointer pw-hidden"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
            >
              <BiCopy size={20} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
