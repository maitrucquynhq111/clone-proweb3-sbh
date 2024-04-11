import cx from 'classnames';
import { BsCheckLg } from 'react-icons/bs';

type Props = { defaultValue: string; colorError: string; onClick: (value: string) => void };

const COLORS = [
  '#D92B2B',
  '#4A94EC',
  '#E59803',
  '#37B869',
  '#D96285',
  '#3EBECD',
  '#8F61F2',
  '#FF6756',
  '#EA7330',
  '#FFD633',
  '#3744B8',
  '#B83794',
  '#8F9AA6',
  '#1E2226',
];

const ColorPicker = ({ defaultValue, colorError, onClick }: Props): JSX.Element => {
  return (
    <div className="pw-grid pw-grid-cols-7 pw-gap-7">
      {colorError && <p className="pw-col-span-7 pw-text-red-500">{colorError}</p>}
      {COLORS.map((color) => (
        <div
          className={cx(
            'pw-col-span-1 pw-rounded-full pw-w-7 pw-h-7 pw-cursor-pointer pw-self-center pw-justify-self-center',
            {
              'pw-flex pw-items-center pw-justify-center pw-shadow-md pw-shadow-amber-300 !pw-w-9 !pw-h-9':
                defaultValue === color,
            },
          )}
          style={{ backgroundColor: color }}
          onClick={() => onClick(color)}
        >
          {defaultValue === color && <BsCheckLg size={20} color="white" />}
        </div>
      ))}
    </div>
  );
};

export default ColorPicker;
