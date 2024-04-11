import { memo, useRef, useState } from 'react';
import { Button, Popover, Tag, Whisper } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { BsPlus, BsPlusCircleFill } from 'react-icons/bs';
import IngredientsSelectTable from './IngredientsSelectTable';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  onSuccess?(value: Ingredient): void;
};

type Props = {
  selectedSku: ExpectedAny;
  ingredientsLength: number;
  childrenType?: 'primary' | 'iconButton';
  onChange(value: ExpectedAny): void;
};

const IngredientsSelection = ({ selectedSku, ingredientsLength, childrenType, onChange }: Props) => {
  const { t } = useTranslation('products-form');
  const whisperRef = useRef<ExpectedAny>();
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [tempSelected, setTempSelected] = useState<ExpectedAny>(selectedSku.recipe || []);

  const handleSuccess = (newValue: Ingredient) => {
    whisperRef?.current?.open();
    onChange([...selectedSku, { ...newValue, quantity: 1 }]);
    setTempSelected([...tempSelected, { ...newValue, quantity: 1 }]);
  };

  const handleOpenCreate = () => {
    setModalData({
      modal: ModalTypes.IngredientCreate,
      size: ModalSize.Small,
      placement: ModalPlacement.Right,
      onSuccess: handleSuccess,
    });
    whisperRef?.current?.close();
  };

  const handleClick = () => {
    if (ingredientsLength === 0) return handleOpenCreate();
    setTempSelected(selectedSku.recipe || []);
  };

  const renderChildren = () => {
    if (!childrenType) {
      return (
        <div className="pw-flex pw-items-center pw-justify-end pw-w-full pw-h-full" onClick={handleClick}>
          {selectedSku?.recipe && selectedSku.recipe.length === 0 ? (
            <Tag size="sm" className="!pw-bg-error-active !pw-text-white pw-font-semibold">
              {t('not_have')}
            </Tag>
          ) : (
            <div
              className="pw-flex pw-justify-end pw-w-fit pw-border-b pw-border-blue-700 
          pw-border-dashed pw-text-neutral-placeholder pw-pl-1"
            >
              {selectedSku?.recipe?.length}
            </div>
          )}
        </div>
      );
    }
    switch (childrenType) {
      case 'iconButton':
        return (
          <button className="pw-flex pw-items-center pw-justify-center pw-gap-x-2" type="button" onClick={handleClick}>
            <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={22} />
            <span className="pw-text-blue-600 pw-text-sm pw-font-bold">{t('action.add_ingredients')}</span>
          </button>
        );
      default:
        return (
          <Button appearance="primary" startIcon={<BsPlus size={20} />} className="!pw-font-bold" onClick={handleClick}>
            {t('action.add_ingredients')}
          </Button>
        );
    }
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
              <IngredientsSelectTable
                top={top || 0}
                tempSelected={tempSelected}
                setTempSelected={setTempSelected}
                onOpenCreate={handleOpenCreate}
                onChange={(newValue: ExpectedAny) => {
                  onChange(newValue);
                  onClose();
                }}
              />
            </Popover>
          );
        }}
      >
        {renderChildren()}
      </Whisper>
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </>
  );
};

export default memo(IngredientsSelection);
