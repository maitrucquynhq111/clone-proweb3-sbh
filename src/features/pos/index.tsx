import { SelectedOrderProvider } from '~app/features/pos/hooks/useSelectedOrder';
import { PosProvider } from '~app/features/pos/hooks/usePos';
import { ResponseOrderProvider } from '~app/features/pos/hooks/useResponseOrder';
import ProductDrawerContainer from '~app/features/pos/components/ProductDrawer/ProductDrawerContainer';
import PosLayout from '~app/features/pos/layout';
import { SearchInput, Sort, Header, OrderTabs, CreateFastProduct } from '~app/features/pos/components';

const Pos = () => {
  return (
    <div className="pw-h-screen pw-overflow-hidden pw-flex pw-flex-col">
      <PosProvider>
        <SelectedOrderProvider>
          <ResponseOrderProvider>
            <Header>
              <div className="pw-flex pw-items-center pw-gap-2 pw-ml-8 pw-w-full">
                <SearchInput />
                <CreateFastProduct />
                <Sort />
                <OrderTabs className="-pw-mb-3 pw-ml-8" />
              </div>
            </Header>
            <PosLayout />
            <ProductDrawerContainer />
          </ResponseOrderProvider>
        </SelectedOrderProvider>
      </PosProvider>
    </div>
  );
};

export default Pos;
