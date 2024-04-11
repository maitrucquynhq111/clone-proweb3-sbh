import cx from 'classnames';
import PlaceholderImage from '~app/components/PlaceholderImage';

type Props = {
  image?: string;
  showImage?: boolean;
  text: string;
  secondText?: string;
  isAvatar?: boolean;
  className?: string;
  textClassName?: string;
  secondTextClassName?: string;
  imageClassName?: string;
};

export default function ImageTextCell({
  image,
  text,
  secondText,
  isAvatar,
  className,
  textClassName,
  secondTextClassName,
  imageClassName,
  showImage = true,
}: Props) {
  return (
    <div className={cx('pw-flex pw-px-2 pw-items-center pw-gap-3 pw-w-full', className)}>
      {showImage ? (
        <div className="pw-w-10 pw-min-w-fit pw-h-10">
          <PlaceholderImage
            className={cx('pw-bg-cover pw-rounded-md !pw-w-10 pw-h-10 pw-object-cover', imageClassName)}
            src={image}
            alt={text}
            isAvatar={isAvatar}
          />
        </div>
      ) : null}
      <div
        className={cx('pw-flex pw-flex-col', {
          'pw-justify-between': !!secondTextClassName,
        })}
      >
        <div className={`pw-overflow-hidden pw-flex-1 pw-text-ellipsis pw-text-justify ${textClassName}`}>{text}</div>
        {secondText && (
          <div className={`pw-overflow-hidden pw-flex-1 pw-text-ellipsis pw-text-justify ${secondTextClassName}`}>
            {secondText}
          </div>
        )}
      </div>
    </div>
  );
}
