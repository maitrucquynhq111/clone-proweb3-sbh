import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from '~app/components';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';

const OrderNote = () => {
  const { t } = useTranslation('orders-form');
  const [isEdit] = usePosStore((store) => store.is_edit_order);
  const [note, setNote] = useSelectedOrderStore((store) => store.note);

  const handleChange = (value: string) => {
    setNote((store) => ({ ...store, note: value }));
  };

  return note || isEdit ? (
    <div className="pw-p-6 pw-rounded pw-bg-white pw-mt-4">
      <h4 className="pw-pb-4 pw-text-base pw-font-bold pw-tracking-tighter">{t('note')}</h4>
      {isEdit ? (
        <TextInput
          name=""
          isForm={false}
          as="textarea"
          value={note}
          onChange={handleChange}
          placeholder={t('placeholder.note') || ''}
        />
      ) : (
        <span className="pw-text-base pw-text-neutral-placeholder">{note}</span>
      )}
    </div>
  ) : null;
};

export default memo(OrderNote);
