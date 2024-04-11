import cx from 'classnames';
import { useState, memo } from 'react';
import { Placeholder } from 'rsuite';
import { DefaultAvatar, DefaultImage } from '~app/components/Icons';

type Props = {
  src?: string;
  className?: string;
  alt?: string;
  isAvatar?: boolean;
  sizeDefaultAvatar?: string;
  defaultElement?: JSX.Element;
};

const PlaceholderImage = ({ src, className, isAvatar = false, alt = '', sizeDefaultAvatar, defaultElement }: Props) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  return (
    <>
      {src && !isError && (
        <div
          className={cx(className, {
            'pw-hidden': loaded,
          })}
        >
          <Placeholder.Graph
            style={{
              height: '100%',
            }}
            className={className}
            active
          />
        </div>
      )}
      {!src || isError ? (
        <div
          className={cx('pw-bg-neutral-100 pw-w-full pw-h-full pw-flex pw-items-center pw-justify-center', className)}
        >
          {/* Have default element   */}
          {defaultElement && defaultElement}

          {/* Not have default element   */}
          {!defaultElement && isAvatar ? (
            <DefaultAvatar size={sizeDefaultAvatar} />
          ) : !defaultElement && !isAvatar ? (
            <DefaultImage />
          ) : null}
        </div>
      ) : (
        <img
          className={cx(
            className,
            {
              'pw-hidden': !loaded,
            },
            // {
            //   'pw-opacity-0': !loaded,
            // }
          )}
          src={src}
          alt={alt}
          onLoad={() => {
            setLoaded(true);
          }}
          onError={() => {
            setLoaded(true);
            setIsError(true);
          }}
        />
      )}
    </>
  );
};

export default memo(PlaceholderImage);
