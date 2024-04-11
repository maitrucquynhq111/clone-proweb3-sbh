import { memo } from 'react';
import cx from 'classnames';
import { Button, Popover, Whisper } from 'rsuite';
import { BsChevronDown } from 'react-icons/bs';

type Props = {
  data: UomSelect[];
  selectedName: string;
  onChange: (value: string) => void;
};

const UomSelect = ({ data, selectedName, onChange }: Props) => {
  return (
    <Whisper
      placement="bottomStart"
      trigger="click"
      speaker={({ onClose, left, top, className }, ref) => {
        return (
          <Popover ref={ref} className={cx('!pw-rounded-none', className)} style={{ left, top }} arrow={false} full>
            <div className="pw-max-h-80">
              {data.map((ingredient) => (
                <Button
                  key={ingredient.id}
                  className={cx('pw-block pw-w-full !pw-rounded-none !pw-text-base', {
                    '!pw-bg-green-50 !pw-font-medium': selectedName === ingredient.name,
                  })}
                  appearance="subtle"
                  onClick={() => {
                    if (ingredient.name !== selectedName) {
                      onChange(ingredient.id);
                    }
                    onClose();
                  }}
                >
                  {ingredient.name}
                </Button>
              ))}
            </div>
          </Popover>
        );
      }}
    >
      <div className="pw-text-blue-700 pw-flex pw-items-center pw-p-3 pw-cursor-pointer">
        <div className="pw-text-base pw-mr-2 pw-w-8">{selectedName}</div>
        <BsChevronDown size={20} />
      </div>
    </Whisper>
  );
};

export default memo(UomSelect);
