import { useTranslation } from 'react-i18next';
import { Nav } from 'rsuite';
import { SelectionGoodsTab } from '~app/features/warehouse/utils';

const tabList = [
  {
    label: 'sku-table.product',
    value: SelectionGoodsTab.PRODUCT,
  },
  {
    label: 'ingredient-table.ingredient',
    value: SelectionGoodsTab.INGREDIENT,
  },
];

const Navbar = ({
  active,
  onSelect,
  ...props
}: {
  appearance: 'default' | 'subtle' | 'tabs';
  active: string;
  onSelect: (value: SelectionGoodsTab) => void;
}) => {
  const { t } = useTranslation('purchase-order');
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

type SelectionTabProps = {
  active: string;
  setActive: (value: SelectionGoodsTab) => void;
};

const SelectionTab = ({ active, setActive }: SelectionTabProps) => {
  return <Navbar appearance="subtle" active={active} onSelect={setActive} />;
};

export default SelectionTab;
