import cx from 'classnames';
import { FaBoxes } from 'react-icons/fa';
import { Checkbox } from 'rsuite';
import ButtonTransparent from '~app/components/ButtonTransparent';
import PlaceholderImage from '~app/components/PlaceholderImage';

type Props = {
  className?: string;
  image?: string;
  imageTitle?: string;
  title: string;
  subTitle?: string;
  checked: boolean;
  onClick(checked: boolean): void;
};

const CardWithCheckbox = ({
  image,
  imageTitle = '',
  title = '',
  subTitle = '',
  checked = false,
  className = '',
  onClick,
}: Props) => {
  return (
    <ButtonTransparent
      onClick={() => onClick(checked)}
      className={cx(
        '!pw-relative !pw-rounded !pw-whitespace-normal',
        {
          '!pw-border-2 !pw-border-solid !pw-border-green-600': checked,
        },
        className,
      )}
    >
      <div className="pw-flex pw-flex-col pw-h-full">
        <div className="pw-relative pw-pb-20 pw-bg-slate-50">
          <PlaceholderImage src={image} alt={title} className="pw-object-cover pw-w-full pw-h-full pw-absolute" />
          <div
            className="pw-bg-linear-black pw-h-1/2 pw-w-full pw-absolute pw-z-10 pw-bottom-0
              pw-flex pw-items-end pw-pb-2  pw-justify-center"
          >
            {imageTitle ? (
              <div className="pw-flex pw-items-center pw-justify-center pw-gap-x-1">
                <FaBoxes className="pw-fill-white" />
                <span className="pw-text-xs pw-font-semibold pw-text-gray-50">{imageTitle}</span>
              </div>
            ) : null}
          </div>
          <Checkbox className="!pw-absolute pw-z-10 pw-top-0 pw-right-0" checked={checked} />
        </div>
        <div
          className="pw-pt-1 pw-pb-2 pw-bg-gray-50 pw-h-full pw-flex-1
          pw-flex pw-flex-col pw-items-center pw-justify-center "
        >
          <div className="line-clamp-2 pw-h-full">
            <h4 className="pw-text-base pw-font-normal pw-text-black pw-max-w-full ">{title}</h4>
          </div>
          <div>
            <h5 className="pw-mt-1 pw-text-sm pw-font-bold pw-justify-end pw-h-full">{subTitle}</h5>
          </div>
        </div>
      </div>
    </ButtonTransparent>
  );
};

export default CardWithCheckbox;
