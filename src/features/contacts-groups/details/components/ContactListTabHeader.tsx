import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BsArrowRepeat, BsDownload } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import { Loading } from '~app/components';
import { queryClient } from '~app/configs/client';
import { useExportContactMutation, useRevalidateGroupOfContactSettingMutation } from '~app/services/mutations';
import { CONTACTS_KEY } from '~app/services/queries';

function download(arrayBuffer: ExpectedAny, t: ExpectedAny) {
  const byteArray = new Uint8Array(arrayBuffer);
  const newBlob = new Blob([byteArray], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(newBlob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = t('route:contacts.contactsList.title');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

const ContactListTabHeader = () => {
  const { t } = useTranslation('contact-group-form');
  const { control } = useFormContext<PendingContactGroupSetting>();
  const { mutateAsync, isLoading } = useExportContactMutation();
  const { mutateAsync: revalidateGroupOfContactSetting } = useRevalidateGroupOfContactSettingMutation();

  const id = useWatch({
    control,
    name: 'id',
    defaultValue: '',
  });

  const name = useWatch({
    control,
    name: 'name',
    defaultValue: '',
  });

  const number_of_contact = useWatch({
    control,
    name: 'number_of_contact',
    defaultValue: 0,
  });

  const handleRefresh = async () => {
    try {
      await revalidateGroupOfContactSetting(id || '');
      queryClient.invalidateQueries([CONTACTS_KEY], { exact: false });
    } catch (error) {
      // TO DO
    }
  };

  const handleDownload = async () => {
    try {
      const response = await mutateAsync(id || '');
      download(response, t);
      toast.success(t('contacts-groups-table:success.export'));
    } catch (error) {
      // TO DO
    }
  };

  return (
    <div className="pw-flex pw-justify-between">
      <h4 className="pw-py-2 pw-text-xl pw-font-bold">
        {name} ({number_of_contact})
      </h4>
      <div className="pw-flex pw-gap-x-2 pw-items-center">
        <Button className="!pw-flex pw-button-secondary pw-py-2 pw-px-4 pw-gap-x-2" onClick={handleRefresh}>
          <BsArrowRepeat size={20} className="pw-text-neutral-primary" />
          <span className="pw-text-sm pw-text-neutral-primary pw-font-bold">{t('action.refresh')}</span>
        </Button>
        <Button className="!pw-flex pw-button-secondary pw-py-2 pw-px-4 pw-gap-x-2" onClick={handleDownload}>
          <BsDownload size={20} className="pw-text-neutral-primary" />
          <span className="pw-text-sm pw-text-neutral-primary pw-font-bold">{t('action.donwload_contact')}</span>
        </Button>
      </div>
      {isLoading ? <Loading backdrop className="pw-z-200" /> : null}
    </div>
  );
};

export default ContactListTabHeader;
