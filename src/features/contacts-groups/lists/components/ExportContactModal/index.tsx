import { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Radio, RadioGroup } from 'rsuite';
import { toast } from 'react-toastify';
import ContactGroupSelect from './ContactGroupSelect';
import { Loading } from '~app/components';
import { useExportContactMutation } from '~app/services/mutations';

type Props = {
  onClose(): void;
};

enum Options {
  ALL = 'all',
  BY_GROUP = 'by_group',
}

const ExportContactModal = ({ onClose }: Props) => {
  const { t } = useTranslation('contacts-groups-table');
  const [selectedOption, setSelectedOption] = useState<Options>(Options.ALL);
  const [selectedGroups, setSelectedGroups] = useState<ContactGroup[]>([]);
  const { mutateAsync, isLoading } = useExportContactMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      let contact_group_ids = '';
      if (selectedOption === 'by_group') {
        if (selectedGroups.length === 0) {
          toast.error(t('error.not_select_group'));
          return;
        }
        contact_group_ids = selectedGroups.map((group) => group.id).join(',');
      }
      const response = await mutateAsync(contact_group_ids);
      download(response);
    } catch (error) {
      //
    }
  };

  function download(arrayBuffer: ExpectedAny) {
    const byteArray = new Uint8Array(arrayBuffer);
    const newBlob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(newBlob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'export-contacts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success(t('success.export'));
    onClose();
  }

  return (
    <Modal
      open={true}
      keyboard={false}
      className="!pw-flex !pw-absolute !-pw-translate-x-1/2 xl:-pw-translate-y-1/2 xl:pw-top-1/2 pw-left-1/2
        pw-items-center pw-justify-center xl:!pw-my-0 center-modal"
      backdropClassName="!pw-z-1050"
    >
      <form onSubmit={handleSubmit}>
        <div className="pw-w-full">
          <h6 className="pw-text-lg pw-font-bold pw-text-neutral-primary pw-mb-6">{t('export_contact.title')}</h6>
          <RadioGroup
            value={selectedOption}
            className="pw-text-sm"
            onChange={(value) => setSelectedOption(value as Options)}
          >
            <Radio value={Options.ALL} className="!pw-ml-0 pw-mb-2">
              {t('export_contact.export_all')}
            </Radio>
            <Radio value={Options.BY_GROUP} className="!pw-ml-0">
              {t('export_contact.export_by_group')}
            </Radio>
          </RadioGroup>
          {selectedOption === Options.BY_GROUP && (
            <ContactGroupSelect selectedGroups={selectedGroups} onChange={(groups) => setSelectedGroups(groups)} />
          )}
          <div className="pw-flex pw-justify-end pw-items-center pw-gap-x-3 pw-mt-4">
            <Button
              appearance="ghost"
              type="button"
              size="md"
              className="!pw-text-neutral-primary !pw-border-neutral-divider !pw-font-bold"
              onClick={onClose}
            >
              {t('common:close')}
            </Button>
            <Button appearance="primary" type="submit" size="md" className="!pw-font-bold">
              {t('common:modal-confirm')}
            </Button>
          </div>
        </div>
      </form>
      {isLoading && <Loading backdrop className="pw-z-50" />}
    </Modal>
  );
};

export default memo(ExportContactModal);
