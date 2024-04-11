import { menus } from './config';
import MenuBlock from './MenuBlock';
import { MenuBlockType } from './types';

const MenuConfigs = () => {
  return (
    <div className="pw-w-72 pw-py-4 pw-h-full pw-bg-neutral-background">
      {menus.map((item: MenuBlockType) => {
        return <MenuBlock data={item} key={item.title} />;
      })}
    </div>
  );
};

export default MenuConfigs;
