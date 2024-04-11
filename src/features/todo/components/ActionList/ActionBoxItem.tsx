import { BsChevronRight } from 'react-icons/bs';
import AnimatedNumber from 'animated-number-react';
import { currencyFormat } from '~app/utils/helpers';

type Props = {
  icon?: JSX.Element;
  title: string;
  amount: number;
  action?: () => void;
};

const ActionBoxItem = ({ icon, title, amount, action }: Props) => {
  return (
    <div onClick={action} className="pw-rounded pw-shadow-card pw-flex pw-p-4 pw-gap-x-3 pw-cursor-pointer">
      {icon && <div className="pw-flex pw-items-center">{icon}</div>}
      <div className="pw-flex pw-flex-1 pw-flex-col">
        <p className="pw-text-neutral-primary pw-font-bold pw-text-3.5xl">
          <AnimatedNumber
            duration={300}
            value={amount || 0}
            formatValue={(value: number) => {
              return currencyFormat(value.toFixed(0).toString());
            }}
          />
        </p>
        <p className="pw-text-neutral-primary pw-font-semibold pw-text-base">{title}</p>
      </div>
      <div className="pw-flex pw-items-center">
        <BsChevronRight size={20} className="pw-text-main" />
      </div>
    </div>
  );
};

export default ActionBoxItem;
