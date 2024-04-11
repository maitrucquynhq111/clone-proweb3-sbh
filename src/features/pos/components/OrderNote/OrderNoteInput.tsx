import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { BsXCircle } from 'react-icons/bs';
import { AutoResizeInput } from '~app/components';
import { usePosStore } from '~app/features/pos/hooks/usePos';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';

type Props = {
  className?: string;
};

const OrderNoteInput = ({ className }: Props) => {
  const { t } = useTranslation('pos');
  const [, setPosStore] = usePosStore((store) => store.show_delivery_fee_modal);
  const [showNote, setStore] = useSelectedOrderStore((store) => store.show_note);
  const [note] = useSelectedOrderStore((store) => store.note);

  const handleClose = () => {
    setStore((store) => ({ ...store, note: '', show_note: false }));
  };

  if (!showNote) return null;

  return (
    <div className={cx('pw-py-1 pw-flex pw-items-center pw-justify-between', className)}>
      <div className="pw-flex pw-items-center pw-justify-center pw-gap-x-3 pw-text-sm">
        <button onClick={handleClose}>
          <BsXCircle size={20} className="pw-fill-neutral-secondary" />
        </button>
        <span>{t('note')}</span>
      </div>
      <button onClick={() => setPosStore((store) => ({ ...store, show_note_modal: true }))}>
        <AutoResizeInput
          name=""
          defaultValue={note.toString()}
          readOnly
          placeholder=""
          className="pw-cursor-pointer !pw-text-right pw-overflow-hidden pw-max-w-xs pw-truncate "
        />
      </button>
    </div>
  );
};

export default OrderNoteInput;
