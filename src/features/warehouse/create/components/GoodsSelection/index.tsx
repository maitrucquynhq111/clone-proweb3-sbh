import cx from 'classnames';
import { UseFormSetValue } from 'react-hook-form';
import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Popover, Whisper } from 'rsuite';
import SearchInput from './SearchInput';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { IngredientSelection, ProductSelection, SelectionTab } from '~app/features/warehouse/create/components';
import { SelectionGoodsTab } from '~app/features/warehouse/utils';
import { InventoryPermission, useHasPermissions } from '~app/utils/shield';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
};

type Props = {
  isImportGoods: boolean;
  className?: string;
  autoFocus?: boolean;
  setValue: UseFormSetValue<ExpectedAny>;
};

export type ProductSelectionRef = {
  handleClose: () => void;
  handleOpen: () => void;
};

export const GoodsSelection = memo(
  forwardRef<ProductSelectionRef, Props>(({ isImportGoods, className, autoFocus = false, setValue }, ref) => {
    const whisperRef = useRef<ExpectedAny>();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modalData, setModalData] = useState<ModalData | null>(null);
    const [active, setActive] = useState(SelectionGoodsTab.PRODUCT);
    const canViewIngredients = useHasPermissions([InventoryPermission.INVENTORY_IMPORT_INGREDIENT_CREATE]);

    const handleChange = (value: string) => {
      setSearch(value);
      setPage(1);
    };

    const handleOpen = () => {
      setPage(1);
      whisperRef.current.open();
    };

    const handleClose = () => {
      setPage(1);
      whisperRef.current.close();
    };

    const handleOpenModal = (value: ModalData) => {
      setModalData(value);
      whisperRef.current.close();
    };

    const handleChangeTab = (value: SelectionGoodsTab) => {
      setActive(value);
      setPage(1);
    };

    const handleCreateSuccess = () => {
      whisperRef.current.open();
    };

    useImperativeHandle(
      ref,
      () => ({
        handleOpen,
        handleClose,
      }),
      [handleOpen, handleClose],
    );

    useEffect(() => {
      let timerId: ExpectedAny = undefined;
      if (autoFocus) {
        timerId = setTimeout(() => whisperRef?.current.open(), 500);
      }
      return () => {
        clearTimeout(timerId);
      };
    }, [autoFocus]);

    return (
      <>
        <Whisper
          trigger="click"
          placement="autoVerticalStart"
          ref={whisperRef}
          speaker={({ left, top, className }, ref) => {
            return (
              <Popover
                id="select-ingredients"
                ref={ref}
                style={{ left, top }}
                full
                arrow={false}
                className={cx('!pw-w-5/12 !pw-z-[1050]', className)}
              >
                {canViewIngredients ? (
                  <>
                    <SelectionTab active={active} setActive={(value) => handleChangeTab(value)} />
                    {active === SelectionGoodsTab.PRODUCT ? (
                      <ProductSelection
                        isImportGoods={isImportGoods}
                        search={search}
                        page={page}
                        setPage={setPage}
                        setValue={setValue}
                        setModalData={(value) => handleOpenModal(value)}
                        onCreateSuccess={handleCreateSuccess}
                      />
                    ) : (
                      <IngredientSelection
                        isImportGoods={isImportGoods}
                        search={search}
                        page={page}
                        setPage={setPage}
                        setValue={setValue}
                        setModalData={(value) => handleOpenModal(value)}
                        onCreateSuccess={handleCreateSuccess}
                      />
                    )}
                  </>
                ) : (
                  <ProductSelection
                    isImportGoods={isImportGoods}
                    search={search}
                    page={page}
                    setPage={setPage}
                    setValue={setValue}
                    setModalData={(value) => handleOpenModal(value)}
                    onCreateSuccess={handleCreateSuccess}
                  />
                )}
              </Popover>
            );
          }}
        >
          <div className={className}>
            <SearchInput onChange={handleChange} ref={inputRef} onOpen={handleOpen} autoFocus={autoFocus} />
          </div>
        </Whisper>
        {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
      </>
    );
  }),
);
