import cx from 'classnames';
import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useDebounce } from 'react-use';
import { useTranslation } from 'react-i18next';
import { Popover, Whisper } from 'rsuite';
import SearchInput from './SearchInput';
import Tabbar from './Tabbar';
import SkuTab from './SkuTab';
import IngredientTab from './IngredientTab';
import { SkuIngredientTab } from './constant';
import { InventoryPermission, useHasPermissions } from '~app/utils/shield';

export type SkuIngredientSelectionRef = {
  handleClose: () => void;
  handleOpen: () => void;
};

type Props = {
  className?: string;
  inputClassName?: string;
  popoverClassName?: string;
  autoFocus?: boolean;
  onAddSku(sku: SkuInventory): void;
  onAddIngredient(sku: Ingredient): void;
};

export const SkuIngredientSelection = memo(
  forwardRef<SkuIngredientSelectionRef, Props>(
    ({ inputClassName, popoverClassName, onAddSku, onAddIngredient, autoFocus = false }, ref) => {
      const whisperRef = useRef<ExpectedAny>();
      const inputRef = useRef<HTMLInputElement | null>(null);
      const { t } = useTranslation('stocktaking-form');
      const [activeTab, setActiveTab] = useState(SkuIngredientTab.SKU_TAB);
      const [search, setSearch] = useState('');
      const [debounceSearch, setDebounceSearch] = useState('');
      const [page, setPage] = useState(1);
      const canViewIngredients = useHasPermissions([InventoryPermission.INVENTORY_IMPORT_INGREDIENT_CREATE]);
      const handleOpen = () => {
        setPage(1);
        whisperRef.current.open();
      };

      const handleClose = () => {
        setPage(1);
        whisperRef.current.close();
      };

      const handleSearchChange = (value: string) => setSearch(value);

      const handleSelectTab = (activeTab: string) => {
        setActiveTab(activeTab as SkuIngredientTab);
        setSearch('');
        setDebounceSearch('');
        setPage(1);
      };

      useImperativeHandle(
        ref,
        () => ({
          handleOpen,
          handleClose,
        }),
        [handleOpen, handleClose],
      );

      useDebounce(
        () => {
          setDebounceSearch(search);
          setPage(1);
        },
        300,
        [search],
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
              const minWidth = inputRef.current?.getBoundingClientRect().width || 0;
              return (
                <Popover
                  ref={ref}
                  style={{ left, top, minWidth, maxWidth: minWidth }}
                  full
                  arrow={false}
                  className={cx(popoverClassName, className)}
                  id="open-inventory"
                >
                  {canViewIngredients ? (
                    <>
                      <Tabbar
                        activeTab={activeTab}
                        onSelect={handleSelectTab}
                        appearance="subtle"
                        className="pw-w-full"
                      />
                      {activeTab === SkuIngredientTab.SKU_TAB ? (
                        <SkuTab page={page} setPage={setPage} search={debounceSearch} onAddSku={onAddSku} />
                      ) : (
                        <IngredientTab
                          page={page}
                          setPage={setPage}
                          search={debounceSearch}
                          onAddIngredient={onAddIngredient}
                        />
                      )}
                    </>
                  ) : (
                    <SkuTab page={page} setPage={setPage} search={debounceSearch} onAddSku={onAddSku} />
                  )}
                </Popover>
              );
            }}
          >
            <div className={inputClassName}>
              <SearchInput
                ref={inputRef}
                value={search}
                onChange={handleSearchChange}
                onOpen={handleOpen}
                autoFocus={autoFocus}
                placeholder={t('placeholder.search') || ''}
              />
            </div>
          </Whisper>
        </>
      );
    },
  ),
);
