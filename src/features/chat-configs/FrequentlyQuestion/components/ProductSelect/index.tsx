import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { BsChevronDown, BsPlusCircleFill } from 'react-icons/bs';
import { Button, Popover, Whisper } from 'rsuite';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import ProductSelectItem from './ProductSelectItem';
import { ButtonTransparent, DebouncedInput, EmptyState, InfiniteScroll } from '~app/components';
import { EmptyStateProduct, NoDataImage } from '~app/components/Icons';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals';
import { useProductsQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';

type Props = {
  error: string;
  products: Product[];
  onChange(value: ExpectedAny): void;
};

const MAX_SELECTED = 5;

const ProductSelect = ({ error, products = [], onChange }: Props): JSX.Element => {
  const whisperRef = useRef<ExpectedAny>();
  const contentRef = useRef<ExpectedAny>();
  const { t } = useTranslation('chat');
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [list, setList] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const { data } = useProductsQuery({
    page,
    pageSize: 10,
    name: search,
  });

  const total_page = useMemo(() => {
    if (data?.meta) return data.meta.total_pages as number;
    return 0;
  }, [data]);

  const isLastPage = useMemo(() => {
    return page >= total_page;
  }, [total_page, page]);

  const next = useCallback(() => {
    setPage((prevState) => prevState + 1);
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setSelectedProducts(products);
    }
  }, [products]);

  useEffect(() => {
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...(data?.data || [])], 'id'));
    } else {
      setList(data?.data || []);
    }
  }, [data?.data, page]);

  const handleSelect = (product: Product, checked: boolean, isDelete?: boolean) => {
    if (checked) {
      return setSelectedProducts([...selectedProducts, product]);
    }
    const newSelected = selectedProducts.filter((selectedProduct) => selectedProduct.id !== product.id);
    setSelectedProducts(newSelected);
    if (isDelete) onChange(newSelected.map((product) => product.id).join(','));
  };

  const handleOpenCreate = (onClose: () => void) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.ProductCreate,
        placement: ModalPlacement.Top,
        size: ModalSize.Full,
      })}`,
    });
    onClose();
  };

  const handleSubmit = () => {
    onChange(selectedProducts.map((product) => product.id).join(','));
  };

  useClickAway(contentRef, () => {
    whisperRef?.current?.close();
  });

  return (
    <>
      <label className="!pw-text-left pw-block pw-mb-1 pw-text-sm" htmlFor={t('product') || ''}>
        {`${t('product')} (${selectedProducts.length}/${MAX_SELECTED})`}{' '}
        <span className="pw-text-xs pw-text-red-500">*</span>
      </label>
      <Whisper
        ref={whisperRef}
        placement="bottomStart"
        trigger="none"
        speaker={({ onClose, left, top, className }, ref) => {
          return (
            <Popover
              ref={ref}
              className={cx('!pw-rounded-none pw-w-xs', className)}
              style={{ left, top }}
              arrow={false}
              full
            >
              {!search && list.length === 0 && (
                <EmptyState
                  icon={<EmptyStateProduct size="120" />}
                  description1={t('empty_state_product')}
                  textBtn={t('action.create_product') || ''}
                  className="pw-mb-4 pw-mt-2 pw-mx-4"
                  onClick={() => handleOpenCreate(onClose)}
                />
              )}
              <div className="pw-p-4 pw-pt-0 pw-pr-0" ref={contentRef}>
                <ButtonTransparent onClick={() => handleOpenCreate(onClose)}>
                  <div className="pw-flex pw-items-center pw-text-blue-primary pw-py-3">
                    <BsPlusCircleFill size={22} />
                    <span className="pw-font-bold pw-mx-1">{t('action.create_product')}</span>
                    <BsChevronDown size={22} />
                  </div>
                </ButtonTransparent>
                {list.length > 0 ? (
                  <div className="pw-overflow-y-auto pw-overflow-x-hidden pw-max-h-[35vh]">
                    <InfiniteScroll next={next} hasMore={!isLastPage}>
                      {list.map((product) => {
                        const checked = selectedProducts.some((selectedProduct) => selectedProduct.id === product.id);
                        return (
                          <ProductSelectItem
                            key={product.id}
                            product={product}
                            checked={checked}
                            disabled={selectedProducts.length === MAX_SELECTED && !checked}
                            onChange={handleSelect}
                          />
                        );
                      })}
                    </InfiniteScroll>
                  </div>
                ) : (
                  <div className="pw-h-[30vh] pw-flex pw-flex-col pw-items-center pw-justify-center">
                    <NoDataImage width={120} height={120} />
                    <div className="pw-text-base">{t('common:no-data')}</div>
                  </div>
                )}
                <div className="pw-flex pw-pt-4 pw-pr-6 pw-bg-white pw-shadow-sm">
                  <Button
                    appearance="ghost"
                    className="!pw-text-neutral-primary !pw-border-neutral-border !pw-text-base !pw-font-bold !pw-py-3 pw-w-full"
                    onClick={() => setSelectedProducts([])}
                  >
                    {t('action.delete_selected')}
                  </Button>
                  <Button
                    appearance="primary"
                    className="!pw-text-base !pw-font-bold !pw-py-3 pw-w-full pw-ml-4"
                    onClick={() => {
                      handleSubmit();
                      onClose();
                    }}
                  >
                    {t('action.confirm')} ({selectedProducts.length}/{MAX_SELECTED})
                  </Button>
                </div>
              </div>
            </Popover>
          );
        }}
      >
        <div>
          <DebouncedInput
            value=""
            placeholder={t('placeholder.product') || ''}
            iconRight={<BsChevronDown size={18} />}
            error={!!error}
            onClick={() => whisperRef?.current?.open()}
            onChange={(value) => {
              page > 1 && setPage(1);
              setSearch(value);
            }}
          />
          {error && <p className="pw-text-red-500 pw-pt-1">{error}</p>}
        </div>
      </Whisper>
      {selectedProducts.length > 0 && (
        <div className="pw-mt-2">
          {selectedProducts.map((product) => (
            <ProductSelectItem key={product.id} product={product} onChange={handleSelect} />
          ))}
        </div>
      )}
    </>
  );
};

export default ProductSelect;
