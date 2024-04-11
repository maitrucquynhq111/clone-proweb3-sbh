import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'rsuite';
import { BsDownload } from 'react-icons/bs';
import { toast } from 'react-toastify';
import HeaderAction from './HeaderAction';

import { useGetPDFReportCustomerMutation } from '~app/services/mutations';
import { createDownloadElement } from '~app/utils/helpers';

const TableHeaderAction = ({ contactId }: { contactId: string }) => {
  const { t } = useTranslation('common');
  const { mutateAsync, isLoading } = useGetPDFReportCustomerMutation();

  return (
    <div className="pw-gap-1 pw-flex">
      <HeaderAction />
      <IconButton
        onClick={async () => {
          const response = await mutateAsync({
            contactId: contactId,
          } as ExpectedAny);
          if (response) {
            createDownloadElement(response);
            toast.success(t('notification:download-success'));
          }
        }}
        size="md"
        className="!pw-bg-transparent"
        loading={isLoading}
        disabled={isLoading}
        icon={<BsDownload size={18} />}
      />
    </div>
  );
};

export default memo(TableHeaderAction);
