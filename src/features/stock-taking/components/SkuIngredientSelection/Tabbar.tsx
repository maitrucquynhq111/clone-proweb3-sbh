import cx from 'classnames';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Nav } from 'rsuite';
import { SKU_INGREDIENT_TABS } from './constant';

type Props = {
  appearance: 'default' | 'subtle' | 'tabs';
  activeTab: string;
  onSelect(activeTab: string): void;
  className?: string;
};

const Tabbar = ({ appearance, className, activeTab, onSelect }: Props) => {
  const { t } = useTranslation('stocktaking-form');

  return (
    <Nav
      className={cx('pw-flex pw-items-center', className)}
      justified
      activeKey={activeTab}
      onSelect={onSelect}
      appearance={appearance}
    >
      {SKU_INGREDIENT_TABS.map((item, index) => {
        return (
          <Fragment key={item.value}>
            {index > 0 && <span className="pw-text-neutral-border">|</span>}
            <Nav.Item eventKey={item.value} className="pw-text-center pw-font-bold pw-text-sm !pw-py-3">
              {t(item.label)}
            </Nav.Item>
          </Fragment>
        );
      })}
    </Nav>
  );
};

export default Tabbar;
