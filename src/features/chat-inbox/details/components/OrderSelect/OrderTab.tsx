import { useTranslation } from 'react-i18next';
import { Nav } from 'rsuite';

export enum OrderTabEnum {
  ORDER_BUY = 'order_buy',
  ORDER_SOLD = 'order_sold',
}

const tabList = [
  {
    label: 'order_buy',
    value: OrderTabEnum.ORDER_BUY,
  },
  {
    label: 'order_sold',
    value: OrderTabEnum.ORDER_SOLD,
  },
];

const Navbar = ({
  active,
  onSelect,
  ...props
}: {
  appearance: 'default' | 'subtle' | 'tabs';
  active: string;
  onSelect: (value: string) => void;
}) => {
  const { t } = useTranslation('chat');
  return (
    <Nav {...props} className="pw-flex pw-items-center" justified activeKey={active} onSelect={onSelect}>
      {tabList.map((tab, index) => (
        <>
          {index > 0 && <span className="pw-text-neutral-border">|</span>}
          <Nav.Item key={tab.value} eventKey={tab.value} className="pw-text-center pw-font-bold pw-text-sm !pw-py-3">
            {t(tab.label)}
          </Nav.Item>
        </>
      ))}
    </Nav>
  );
};

type OrderTabProps = {
  active: string;
  setActive: (value: string) => void;
};

const OrderTab = ({ active, setActive }: OrderTabProps) => {
  return <Navbar appearance="subtle" active={active} onSelect={setActive} />;
};

export default OrderTab;
