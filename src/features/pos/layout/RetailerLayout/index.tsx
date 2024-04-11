import { Summary, CategoryListHorizontal, ProductSelectList, OrderItemsTable } from '~app/features/pos/components';

const RetailerLayout = () => {
  return (
    <div className="pw-flex-1 pw-grid pw-grid-cols-12 pw-h-full pw-max-h-full pw-overflow-hidden">
      <div className="pw-col-span-8 pw-h-full pw-max-h-full pw-overflow-hidden">
        <div className="pw-flex pw-flex-col pw-h-full pw-max-h-full pw-overflow-hidden">
          <div
            style={{ height: 'calc(100% - 264px)' }}
            className="pw-bg-neutral-background pw-h-auto pw-py-4 pw-pl-6 pw-pr-4 pw-overflow-auto"
          >
            <OrderItemsTable />
          </div>
          <div className="pw-overflow-hidden pw-h-66">
            <CategoryListHorizontal />
            <ProductSelectList className=" pw-bg-neutral-background pw-h-[13.5rem]" />
          </div>
        </div>
      </div>
      <Summary className="pw-flex pw-flex-col pw-col-span-4 pw-h-full pw-overflow-auto pw-relative pw-shadow-posSummary" />
    </div>
  );
};

export default RetailerLayout;
