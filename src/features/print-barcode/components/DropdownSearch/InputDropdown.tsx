import { memo, useState, useCallback, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import { BsPlusCircleFill, BsChevronDown } from 'react-icons/bs';
import { Popover, Whisper, Button } from 'rsuite';
import TableDropdown from './TableDropdown';
import { InputDropdownProps } from './config';
import { ModalTypes } from '~app/modals/types';
import { useSelectedSku } from '~app/features/print-barcode/hook';
import { addToListSku } from '~app/features/print-barcode/utils';
import { DebouncedInput } from '~app/components';

const InputDropdown = ({ name, placeholder, rowHeight = 56, ...props }: InputDropdownProps) => {
  const { t } = useTranslation('barcode');
  const [selectedList, setSelectedList] = useSelectedSku((store: ExpectedAny) => store.selected_list);
  const whisperRef = useRef<ExpectedAny>(null);

  const handleChangeQuantity = (value: string, skuItem: SkuSelected) => {
    setSelectedList((store) => ({ ...store, selected_list: addToListSku(skuItem, store.selected_list, +value) }));
  };

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleClickCreate = (name: string) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: name,
      })}`,
    });
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  return (
    <Whisper
      ref={whisperRef}
      trigger={['click', 'focus']}
      placement="autoVertical"
      onOpen={() => setPage(1)}
      speaker={({ onClose, left, top, className }, ref) => {
        return (
          <Popover
            ref={ref}
            className={cx('!pw-rounded-none pw-w-6/12', className)}
            style={{ left, top }}
            arrow={false}
            full
          >
            <div className="dynamic-radio-select pw-max-h-96 pw-min-w-full pw-overflow-auto">
              <div className="pw-flex pw-flex-col pw-bg-neutral-white pw-p-4 pw-max-h-96">
                <div className="pw-flex pw-py-2">
                  <Button
                    appearance="subtle"
                    type="button"
                    block
                    size="sm"
                    className="!pw-flex !pw-items-start !pw-gap-x-2 !pw-justify-start !pw-p-0"
                    onClick={() => {
                      onClose();
                      handleClickCreate(ModalTypes.ProductCreate);
                    }}
                  >
                    <BsPlusCircleFill className="pw-w-5 pw-h-5 pw-text-secondary-main-blue" />
                    <span className="pw-font-bold pw-text-sm pw-text-secondary-main-blue">{t('create_product')}</span>
                    <BsChevronDown className="pw-w-5 pw-h-5 pw-text-secondary-main-blue" />
                  </Button>
                </div>
                <TableDropdown
                  selectedList={selectedList}
                  search={search}
                  handleChangeQuantity={handleChangeQuantity}
                  rowHeight={rowHeight}
                  setPage={setPage}
                  page={page}
                />
              </div>
            </div>
          </Popover>
        );
      }}
    >
      <div onClick={() => whisperRef?.current?.open()}>
        <DebouncedInput
          {...props}
          value={search}
          name="search"
          icon="search"
          size="md"
          className="pw-w-full"
          onChange={handleSearchChange}
          placeholder={placeholder}
        />
      </div>
    </Whisper>
  );
};

export default memo(InputDropdown);
