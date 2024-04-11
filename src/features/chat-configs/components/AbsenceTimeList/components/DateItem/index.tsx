import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { ButtonTransparent } from '~app/components';

type Props = {
  active: boolean;
  text: string;
  index: number;
  onClick: (index: number) => void;
};

const DateItem = ({ active, text, index, onClick }: Props): JSX.Element => {
  const { t } = useTranslation('chat');

  return (
    <ButtonTransparent className="!pw-h-10 pw-w-10" onClick={() => onClick(index)}>
      <div
        className={cx('pw-flex pw-items-center pw-justify-center pw-bg-neutral-divider pw-h-full', {
          'pw-bg-secondary-background pw-text-secondary-main-blue': active,
        })}
      >
        {t(text)}
      </div>
    </ButtonTransparent>
  );
};

export default DateItem;
