import { CategoryList, ProductSelectList, Summary, ButtonActionBottom } from '~app/features/pos/components';

const FnbLayout = () => {
  return (
    <div className="pw-flex-1 pw-grid pw-grid-cols-12 pw-h-full pw-max-h-full pw-overflow-hidden">
      <div className="pw-col-span-8 pw-h-full pw-max-h-full pw-overflow-hidden">
        <div className="pw-flex pw-flex-col pw-h-full pw-max-h-full pw-overflow-hidden">
          <div className="pw-grid pw-grid-cols-12 pw-overflow-hidden pw-h-full pw-max-h-full">
            <CategoryList className="pw-col-span-3" />
            <ProductSelectList className="pw-col-span-9 pw-bg-neutral-background" />
          </div>
          <ButtonActionBottom className="pw-shadow-dropdown" />
        </div>
      </div>
      <Summary className="pw-flex pw-flex-col pw-col-span-4 pw-h-full pw-overflow-auto pw-relative pw-shadow-posSummary" />
    </div>
  );
};

export default FnbLayout;
