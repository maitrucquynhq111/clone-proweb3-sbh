import { formatCurrency } from '~app/utils/helpers';

type Props = {
  value: string | number;
};

export default function PriceCell({ value }: Props) {
  return <div className="pw-text-right pw-w-full pw-px-2">{value ? `${formatCurrency(value)}` : '---'}</div>;
}
