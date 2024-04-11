import { memo, useRef, useState } from 'react';
import { Button, Popover, Whisper } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { RiPencilFill } from 'react-icons/ri';
import ProductsSelectTable from './ProductsSelectTable';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  onSuccess?(value: Product): void;
};

type Props = {
  idSelected?: string;
  childrenType?: 'btn' | 'icon';
  onChange(value: ExpectedAny): void;
};

const ProductSelection = ({ idSelected, onChange, childrenType }: Props) => {
  const { t } = useTranslation('recipe-table');
  const whisperRef = useRef<ExpectedAny>();
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const handleOpenCreate = () => {
    setModalData({
      modal: ModalTypes.ProductCreate,
      size: ModalSize.Full,
      placement: ModalPlacement.Top,
      onSuccess: handleSuccess,
    });
    whisperRef.current.close();
  };

  const handleSuccess = (newValue: Product) => {
    whisperRef?.current?.open();
    onChange({
      id: newValue.id,
      name: newValue.name,
      images: newValue.images,
      product_code: newValue.product_code,
      product_type: newValue.product_type,
      count_variant: (newValue.list_variant || []).length,
      has_recipe: false,
      list_sku: newValue.list_sku.map((sku: Sku) => ({
        id: sku.id,
        name: sku.name,
        historical_cost: sku.historical_cost,
        sku_code: sku.sku_code,
        media: sku.media,
        product_id: sku.product_id,
      })),
    });
  };

  return (
    <>
      <Whisper
        trigger="click"
        placement="auto"
        ref={whisperRef}
        speaker={({ onClose, left, top, className }, ref) => {
          return (
            <Popover id="select-ingredients" ref={ref} style={{ left, top }} arrow={false} className={className}>
              <ProductsSelectTable
                top={top || 0}
                idSelected={idSelected}
                onOpenCreate={handleOpenCreate}
                onChange={(data: ProductRecipe) => {
                  onChange(data);
                  onClose();
                }}
              />
            </Popover>
          );
        }}
      >
        {childrenType === 'btn' ? (
          <Button appearance="primary" className="!pw-font-bold">
            {t('action.add_product')}
          </Button>
        ) : (
          <div className="pw-flex pw-items-center">
            <RiPencilFill size={20} className="pw-text-main" />
          </div>
        )}
      </Whisper>
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </>
  );
};

export default memo(ProductSelection);
