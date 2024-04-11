import { useEffect, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'rsuite';
import { TextInput } from '~app/components';
import { usePosStore } from '~app/features/pos/hooks/usePos';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';

const OrderNoteModal = () => {
  const { t } = useTranslation(['pos', 'common']);
  const [showNoteModal, setPosStore] = usePosStore((store) => store.show_note_modal);
  const [note, setSelectedOrderStore] = useSelectedOrderStore((store) => store.note);

  const [value, setValue] = useState('');

  const handleClose = () => {
    setValue('');
    setPosStore((store) => ({ ...store, show_note_modal: false }));
  };

  const handleChange = (value: string) => {
    setValue(value);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // if (value) {
    setSelectedOrderStore((store) => ({
      ...store,
      note: value,
      show_note: !!value,
    }));
    handleClose();
    // }
  };

  useEffect(() => {
    if (showNoteModal) {
      setValue(note);
    }
  }, [note, showNoteModal]);

  return (
    <Modal
      open={showNoteModal}
      keyboard={false}
      className="!pw-flex !pw-absolute !-pw-translate-x-1/2 xl:-pw-translate-y-1/2 xl:pw-top-1/2 pw-left-1/2
        pw-items-center pw-justify-center xl:!pw-my-0 center-modal"
    >
      <form onSubmit={handleSubmit}>
        <div className="pw-w-full pw-p-1">
          <label className="pw-inline-block pw-text-sm pw-font-normal pw-text-neutral-primary pw-mb-1">
            {t('note')}
          </label>
          <TextInput
            name=""
            value={value}
            onChange={handleChange}
            isForm={false}
            autoFocus={true}
            rows={3}
            as="textarea"
            inputClassName="!pw-h-20"
            placeholder={t('placeholder.enter_note') || ''}
          />
          <div className="pw-flex pw-justify-end pw-items-center pw-gap-x-3 pw-mt-4">
            <Button appearance="ghost" type="button" onClick={handleClose}>
              {t('common:cancel')}
            </Button>
            <Button appearance="primary" type="submit">
              {t('common:modal-confirm')}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default memo(OrderNoteModal);
