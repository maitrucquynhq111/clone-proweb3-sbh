import cx from 'classnames';
import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Popover, Whisper } from 'rsuite';
import SearchInput from './SearchInput';
import ProductSelectTable from './ProductSelectTable';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
};

type Props = {
  className?: string;
  autoFocus?: boolean;
};

export type ProductSelectionRef = {
  handleClose: () => void;
  handleOpen: () => void;
};

export const ProductSelection = memo(
  forwardRef<ProductSelectionRef, Props>(({ className, autoFocus = false }, ref) => {
    const whisperRef = useRef<ExpectedAny>();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modalData, setModalData] = useState<ModalData | null>(null);

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

    const handleOpenCreateProduct = () => {
      setModalData({
        modal: ModalTypes.ProductCreate,
        size: ModalSize.Full,
        placement: ModalPlacement.Top,
      });
      whisperRef.current.close();
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
                ref={ref}
                style={{ left, top }}
                full
                arrow={false}
                className={cx('!pw-w-5/12 !pw-z-[1050]', className)}
              >
                <ProductSelectTable
                  search={search}
                  onOpenCreateProduct={handleOpenCreateProduct}
                  page={page}
                  setPage={setPage}
                />
              </Popover>
            );
          }}
        >
          <div className={className}>
            <SearchInput onChange={handleChange} ref={inputRef} onOpen={handleOpen} autoFocus={autoFocus} />
          </div>
        </Whisper>
        {modalData && modalData.modal === ModalTypes.ProductCreate && (
          <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />
        )}
      </>
    );
  }),
);
