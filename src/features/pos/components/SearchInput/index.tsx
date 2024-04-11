import { memo, useSyncExternalStore, useState, useRef, useEffect } from 'react';
import { useDebounce } from 'react-use';
import { Input, InputGroup, Whisper, Popover } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { BsUpcScan } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useOfflineContext } from '../../context/OfflineContext';
import ProductsSelectTable from './ProductsSelectTable';
import { useSelectedOrderStore, usePosStore } from '~app/features/pos/hooks';
import { addToListOrderItem, toInitialOrderItem, updateListOrderItem } from '~app/features/pos/utils';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { ProductDrawerType, RequestType } from '~app/features/pos/constants';
import { filterProductStore, productSearchStore } from '~app/features/pos/stores';
import { getCanPickQuantityProduct, isProductAddon, isProductVariant } from '~app/utils/helpers';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  onSuccess?(value: Product): void;
};

const SearchInput = () => {
  const { offlineModeWorker } = useOfflineContext();
  const whisperRef = useRef<ExpectedAny>();
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const { t } = useTranslation('filters');
  const barcodeRef = useRef('');
  const filter = useSyncExternalStore(filterProductStore.subscribe, filterProductStore.getSnapshot);
  const products = useSyncExternalStore(productSearchStore.subscribe, productSearchStore.getSnapshot);
  const [listOrderItem, setStore] = useSelectedOrderStore((store) => store.list_order_item);
  const [, setPosStore] = usePosStore((store) => store.pending_orders);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isScanBarcode, setIsScanBarcode] = useState(false);

  const handleScanBarcode = (e: ExpectedAny) => {
    let reading = false;
    if (e.keyCode === 13 && barcodeRef.current) {
      offlineModeWorker.postMessage({
        action: RequestType.SEARCH_PRODUCT,
        value: {
          ...filter,
          search: barcodeRef.current,
        },
      });
      filterProductStore.setFilter({
        search: barcodeRef.current,
      });
      setIsScanBarcode(true);
    } else {
      if (e?.key && e.key.length === 1) {
        barcodeRef.current += e.key;
      }
    }
    if (!reading) {
      reading = true;
      setTimeout(() => {
        barcodeRef.current = '';
        reading = false;
      }, 500);
    }
  };

  useEffect(() => {
    if (window) {
      window.addEventListener('keydown', handleScanBarcode);
    }
    return () => {
      window.removeEventListener('keydown', handleScanBarcode);
    };
  }, []);

  useEffect(() => {
    if (isScanBarcode) {
      const product = products?.[0];
      const isValidSearch = filter.search && /^[A-Z0-9-]*$/.test(filter.search);
      if (products.length === 0 || !isValidSearch) {
        toast.error(t('pos:error.product_not_found'));
        resetSearch();
        return;
      }
      if (product && isValidSearch && products.length === 1) {
        const existedItem = listOrderItem.find((item) => item.product_id === product.id);
        const sku = product.list_sku[0];
        if (sku) {
          const can_pick_quantity = getCanPickQuantityProduct(product, sku);
          const canPickProduct =
            typeof can_pick_quantity === 'boolean' || typeof can_pick_quantity === 'string'
              ? can_pick_quantity
              : can_pick_quantity > 0;
          if (!canPickProduct) {
            resetSearch();
            toast.error(t('pos:error.out_of_stock'));
            return;
          }
        }
        // product no addon
        if (!isProductAddon(product) && !isProductVariant(product)) {
          if (sku) {
            if (existedItem) {
              handleUpdateOrderList({ existedItem });
              return;
            }
            handleAddToOrderList({ product, sku });
            return;
          }
        } else {
          // product addon existed in order list
          if (existedItem && isProductAddon(product)) {
            setPosStore((store) => ({
              ...store,
              selected_product: product,
              selected_drawer: ProductDrawerType.CART_DRAWER,
            }));
            resetSearch();
            return;
          }
          // product variant + addon
          if (isProductVariant(product) && isProductAddon(product)) {
            setPosStore((store) => ({
              ...store,
              selected_product: product,
              selected_drawer: ProductDrawerType.VARIANT_ADDON_DRAWER,
            }));
            resetSearch();
            return;
          }
          // product variant
          if (isProductVariant(product)) {
            setPosStore((store) => ({
              ...store,
              selected_product: product,
              selected_drawer: ProductDrawerType.VARIANT_DRAWER,
            }));
            resetSearch();
            return;
          }
          if (isProductAddon(product)) {
            // product addon
            setPosStore((store) => ({
              ...store,
              selected_product: product,
              selected_drawer: ProductDrawerType.SINGLE_ADDON,
            }));
            resetSearch();
            return;
          }
        }
      }
    }
  }, [products]);

  const handleAddToOrderList = ({ product, sku }: { product: Product; sku: Sku }) => {
    const orderItem = toInitialOrderItem(product, sku);
    setStore((store) => {
      const listOrderItem = addToListOrderItem(orderItem, store.list_order_item, 1, store.is_wholesale_price);
      return { ...store, list_order_item: listOrderItem };
    });
    resetSearch();
  };

  const handleUpdateOrderList = ({ existedItem }: { existedItem: PendingOrderItem }) => {
    if (
      existedItem.quantity <
      (typeof existedItem?.can_pick_quantity === 'number' ? existedItem.can_pick_quantity : Infinity)
    ) {
      setStore((store) => {
        const listOrderItem = updateListOrderItem(
          { ...existedItem, quantity: existedItem.quantity + 1 },
          store.list_order_item,
          store.is_wholesale_price,
        );
        return { ...store, list_order_item: listOrderItem };
      });
    } else {
      toast.error(t('pos:error.out_of_stock'));
    }
    resetSearch();
  };

  const resetSearch = () => {
    offlineModeWorker.postMessage({
      action: RequestType.SEARCH_PRODUCT,
      value: {
        ...filter,
        search: '',
      },
    });
    filterProductStore.setFilter({
      search: '',
    });
    setIsScanBarcode(false);
  };

  const handleSearch = (value: ExpectedAny) => {
    setSearchValue(value);
  };

  const handleSearchProducts = () => {
    if (searchValue !== filter.search) {
      offlineModeWorker.postMessage({
        action: RequestType.SEARCH_PRODUCT,
        value: {
          ...filter,
          search: searchValue || '',
        },
      });
      filterProductStore.setFilter({
        search: searchValue || '',
      });
    }
  };

  useDebounce(handleSearchProducts, 300, [searchValue]);

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
    handleClickProduct(newValue);
  };

  const handleClickProduct = (product: Product) => {
    const selectedOrderItem = listOrderItem.find((item) => item.product_id === product.id);
    if (selectedOrderItem && isProductAddon(product)) {
      return setPosStore((store) => ({
        ...store,
        selected_product: product,
        selected_drawer: ProductDrawerType.CART_DRAWER,
      }));
    }
    if (isProductVariant(product) && isProductAddon(product)) {
      return setPosStore((store) => ({
        ...store,
        selected_product: product,
        selected_drawer: ProductDrawerType.VARIANT_ADDON_DRAWER,
      }));
    }
    if (isProductAddon(product)) {
      return setPosStore((store) => ({
        ...store,
        selected_product: product,
        selected_drawer: ProductDrawerType.SINGLE_ADDON,
      }));
    }
    if (isProductVariant(product)) {
      return setPosStore((store) => ({
        ...store,
        selected_product: product,
        selected_drawer: ProductDrawerType.VARIANT_DRAWER,
      }));
    }
    // Already in order list item
    if (selectedOrderItem) {
      // Check max quantity
      if (
        selectedOrderItem.quantity <
        (typeof selectedOrderItem?.can_pick_quantity === 'number' ? selectedOrderItem.can_pick_quantity : Infinity)
      ) {
        setStore((store) => {
          const listOrderItem = updateListOrderItem(
            { ...selectedOrderItem, quantity: selectedOrderItem.quantity + 1 },
            store.list_order_item,
            store.is_wholesale_price,
          );
          return { ...store, list_order_item: listOrderItem };
        });
      } else {
        toast.error('common:error.max_quantity');
      }
    } else {
      const sku = product.list_sku[0];
      if (sku) {
        const orderItem = toInitialOrderItem(product, sku, undefined, undefined, product.uom || sku.uom);
        setStore((store) => {
          const listOrderItem = addToListOrderItem(orderItem, store.list_order_item, 1, store.is_wholesale_price);
          return { ...store, list_order_item: listOrderItem };
        });
      }
    }
  };

  return (
    <>
      <Whisper
        trigger="active"
        placement="autoVertical"
        ref={whisperRef}
        onOpen={handleSearchProducts}
        speaker={({ onClose, left, className }, ref) => {
          return (
            <Popover ref={ref} style={{ left }} arrow={false} className={className}>
              <ProductsSelectTable
                onOpenCreate={handleOpenCreate}
                handleClickProduct={(data: Product) => {
                  handleClickProduct(data);
                  onClose();
                }}
              />
            </Popover>
          );
        }}
      >
        <div>
          <InputGroup inside className="pw-flex pw-items-center">
            <InputGroup.Addon className="pw-h-full">
              <SearchIcon />
            </InputGroup.Addon>
            <Input
              size="lg"
              className="!pw-w-68 !pw-pr-9"
              onChange={handleSearch}
              placeholder={t('products-table.search') || ''}
            />
            <InputGroup.Addon className="pw-h-full">
              <BsUpcScan className="pw-text-green-700" />
            </InputGroup.Addon>
          </InputGroup>
        </div>
      </Whisper>
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </>
  );
};

export default memo(SearchInput);
