import { useTranslation } from 'react-i18next';
import { useState, useSyncExternalStore } from 'react';
import { useDebounce } from 'react-use';
import { Modal, Button, CheckboxGroup, Checkbox, Input } from 'rsuite';
import { useOfflineContext } from '../../context/OfflineContext';
import { filterProductStore } from '../../stores';
import { RequestType } from '../../constants';

type Props = {
  categories: Array<ExpectedAny>;
  currentCategories: Array<ExpectedAny>;
  open: boolean;
  onClose(): void;
};

const CategoryListModal = ({ open, onClose, categories, currentCategories }: Props) => {
  const { t } = useTranslation('common');
  const [selectCategories, setSelectCategories] = useState(currentCategories);
  const [listCategories, setListCategories] = useState(categories);
  const [searchValue, setSearchValue] = useState<string>('');
  const filter = useSyncExternalStore(filterProductStore.subscribe, filterProductStore.getSnapshot);
  const { offlineModeWorker } = useOfflineContext();

  const handleSearch = (value: ExpectedAny) => {
    setSearchValue(value);
  };

  useDebounce(
    () => {
      const newCategory = categories.filter((item) =>
        searchValue ? item.name.toLowerCase().includes(searchValue.toLowerCase()) : true,
      );
      setListCategories(newCategory);
    },
    300,
    [searchValue],
  );

  const onSubmit = () => {
    filterProductStore.setFilter({
      category: selectCategories,
    });
    offlineModeWorker.postMessage({
      action: RequestType.FILTER_PRODUCT,
      value: { ...filter, category: selectCategories },
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      keyboard={true}
      onClose={onClose}
      className="!pw-flex !pw-absolute !-pw-translate-x-1/2 !-pw-translate-y-1/2 pw-top-1/2 pw-left-1/2
        pw-items-center pw-justify-center !pw-my-0 center-modal pw-h-3/5"
      backdropClassName="!pw-z-[1050]"
      dialogClassName="pw-h-full pw-bg-neutral-white pw-rounded-md pw-dialog-category-list-pos"
    >
      <Modal.Body className="pw-flex pw-flex-col pw-gap-y-4 pw-items-start pw-justify-start pw-bg-neutral-white pw-h-full">
        <div className="pw-text-xl pw-font-bold">{t('select-quick-category')}</div>
        <Input size="lg" className="!pw-w-full" onChange={handleSearch} placeholder={t('search-category') || ''} />
        <CheckboxGroup
          name="checkboxList"
          className="pw-overflow-auto pw-w-full pw-flex-1"
          value={selectCategories}
          onChange={(value) => {
            setSelectCategories(value);
          }}
        >
          {listCategories.map((category: ExpectedAny) => {
            return <Checkbox value={category.id}>{category.name}</Checkbox>;
          })}
        </CheckboxGroup>
        <div className="pw-flex pw-justify-end pw-w-full pw-gap-x-2">
          <Button appearance="ghost" type="button" onClick={onClose}>
            {t('back')}
          </Button>
          <Button appearance="primary" type="button" onClick={onSubmit}>
            {t('modal-confirm')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CategoryListModal;
