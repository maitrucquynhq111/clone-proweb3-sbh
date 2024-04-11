import { useTranslation } from 'react-i18next';
import { BsChevronDown, BsPlusCircleFill } from 'react-icons/bs';
import { Button } from 'rsuite';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ProductSelectItem from './ProductSelectItem';
import { ButtonTransparent, DebouncedInput, EmptyState, InfiniteScroll } from '~app/components';
import { EmptyStateProduct, NoDataImage } from '~app/components/Icons';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals';
import { useProductsQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';

type Props = { onChange(value: string[]): void; onClose(): void };

const ProductSelect = ({ onChange, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('chat');
  const contentRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [list, setList] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const { data } = useProductsQuery({
    page,
    pageSize: 20,
    name: search,
  });

  const memoizedData = useMemo(() => {
    if (data?.data) return data.data;
    return [];
  }, [data]);

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
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...memoizedData], 'id'));
    } else {
      setList(memoizedData);
    }
  }, [memoizedData, page]);

  useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  const handleSelect = (product: Product, checked: boolean) => {
    if (checked) {
      return setSelectedProducts([...selectedProducts, product]);
    }
    setSelectedProducts(selectedProducts.filter((selectedProduct) => selectedProduct.id !== product.id));
  };

  const handleOpenCreate = () => {
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
    onChange(selectedProducts.map((product) => product.id));
    onClose();
  };

  return (
    <>
      {!search && list.length === 0 && (
        <EmptyState
          icon={<EmptyStateProduct size="120" />}
          description1={t('empty_state_product')}
          textBtn={t('action.create_product') || ''}
          className="pw-mb-4 pw-mt-2 pw-mx-4"
          onClick={() => handleOpenCreate()}
        />
      )}
      {(search || list.length > 0) && (
        <div className="pw-p-4">
          <DebouncedInput
            value=""
            onChange={(value) => {
              page > 1 && setPage(1);
              contentRef?.current?.scroll({ top: 0 });
              setSearch(value);
            }}
            placeholder={t('placeholder.product') || ''}
          />
        </div>
      )}
      <div className="pw-p-4 pw-pt-0 pw-pr-0 pw-w-150">
        <ButtonTransparent onClick={() => handleOpenCreate()}>
          <div className="pw-flex pw-items-center pw-text-blue-primary pw-py-3">
            <BsPlusCircleFill size={22} />
            <span className="pw-font-bold pw-mx-2">{t('action.create_product')}</span>
            <BsChevronDown size={22} />
          </div>
        </ButtonTransparent>
        {list.length > 0 ? (
          <div ref={contentRef} className="pw-overflow-y-auto pw-overflow-x-hidden pw-h-[35vh]">
            <InfiniteScroll next={next} hasMore={!isLastPage}>
              {list.map((product) => {
                const checked = selectedProducts.some((selectedProduct) => selectedProduct.id === product.id);
                return (
                  <ProductSelectItem key={product.id} product={product} checked={checked} onChange={handleSelect} />
                );
              })}
            </InfiniteScroll>
          </div>
        ) : (
          <div className="pw-h-[35vh] pw-flex pw-flex-col pw-items-center pw-justify-center">
            <NoDataImage width={120} height={120} />
            <div className="pw-text-base">{t('common:no-data')}</div>
          </div>
        )}
        <div className="pw-flex pw-pt-4 pw-pr-6 pw-bg-white pw-shadow-sm">
          <Button
            appearance="ghost"
            className="!pw-text-neutral-primary !pw-border-neutral-border !pw-text-base !pw-font-bold !pw-py-3 pw-w-full"
            disabled={selectedProducts.length === 0}
            onClick={() => setSelectedProducts([])}
          >
            {t('action.delete_selected')}
          </Button>
          <Button
            appearance="primary"
            className="!pw-text-base !pw-font-bold !pw-py-3 pw-w-full pw-ml-4"
            disabled={selectedProducts.length === 0}
            onClick={handleSubmit}
          >
            {t('common:send')} {selectedProducts.length > 0 ? `(${selectedProducts.length})` : ''}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductSelect;
