import cx from 'classnames';
import { useMemo } from 'react';
import { PlaceholderImage } from '~app/components';

type Props = {
  index: number;
  isSelected: boolean;
  data: QuickMessageResponse;
  onClick(index: number): void;
};

const QuickMessageItem = ({ index, data, isSelected, onClick }: Props) => {
  const image = useMemo(() => {
    if (data?.images?.[0]) return data.images[0];
  }, [data]);

  return (
    <div
      className={cx(
        'pw-text-neutral-divider pw-border-b pw-border-solid pw-border-neutral-divider pw-py-3 pw-px-4 pw-flex pw-justify-between pw-cursor-pointer hover:pw-bg-neutral-background',
        {
          'pw-bg-neutral-background': isSelected,
          'pw-bg-neutral-white': !isSelected,
        },
      )}
      onClick={() => onClick(index)}
      data-id={data.id}
    >
      <div>
        <div className="pw-py-0.5 pw-px-1 pw-rounded pw-bg-info-background pw-text-neutral-primary pw-w-max">
          /{data.shortcut}
        </div>
        <div className="pw-mt-2 pw-text-sm pw-text-neutral-primary">{data?.message || ''}</div>
      </div>
      {image ? (
        <PlaceholderImage src={image} className="pw-rounded pw-h-10 pw-w-10 pw-aspect-square pw-object-cover" />
      ) : null}
    </div>
  );
};

export default QuickMessageItem;
