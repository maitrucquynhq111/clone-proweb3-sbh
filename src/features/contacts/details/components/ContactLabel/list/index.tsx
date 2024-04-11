import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { Button } from 'rsuite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BsPlusCircleFill } from 'react-icons/bs';
import { contactLabelsFormSchema } from './config';
import {
  ButtonTransparent,
  DebouncedInput,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  InfiniteScroll,
} from '~app/components';
import FormLayout from '~app/components/HookForm/FormLayout';
import { useContactsLabelsQuery } from '~app/services/queries';
import ContactLabelCreate from '~app/features/contacts/details/components/ContactLabel/create';
import { toDefaultContactLabel } from '~app/features/contacts/utils';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';

type Props = {
  onClose: () => void;
};
const ContactLabels = ({ onClose }: Props): JSX.Element => {
  const { t } = useTranslation('contact-form');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [list, setList] = useState<PendingContactLabel[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const { data } = useContactsLabelsQuery({ page, pageSize: 10, name: search });

  const next = useCallback(() => setPage((prevState) => prevState + 1), []);
  const isLastPage = useMemo(() => page >= (data?.meta?.total_pages || 1), [data?.meta?.total_pages, page]);

  const handleClose = () => {
    onClose();
  };

  const handleCreateLabelSuccess = () => {
    setPage(1);
    setSearch('');
  };

  useEffect(() => {
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...toDefaultContactLabel(data?.data || [])], 'id'));
    } else {
      setList(toDefaultContactLabel(data?.data || []));
    }
  }, [data, page]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t('contact_label')} onClose={handleClose} />
      <div className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden">
        <div className="pw-p-4 pw-pb-0">
          <div className={cx({ 'pw-mb-3': openCreate })}>
            <DebouncedInput
              value={search}
              placeholder={t('placeholder.select_contact_label') || ''}
              icon="search"
              onChange={(value) => {
                page > 1 && setPage(1);
                setSearch(value);
              }}
            />
          </div>
          {openCreate && (
            <ContactLabelCreate
              defaultName={search}
              className="pw-py-6 pw-border-y pw-border-y-neutral-divider"
              onSuccess={handleCreateLabelSuccess}
              onClose={() => setOpenCreate(false)}
            />
          )}
        </div>
        <DrawerBody className="pw-bg-white pw-overflow-y-auto pw-overflow-x-hidden">
          {!openCreate && (
            <ButtonTransparent onClick={() => setOpenCreate(true)}>
              <div className="pw-flex pw-items-center pw-text-blue-primary pw-pt-2 pw-pb-6">
                <BsPlusCircleFill size={22} />
                <span className="pw-font-bold pw-mx-1">{t('action.create_contact_label')}</span>
              </div>
            </ButtonTransparent>
          )}
          <InfiniteScroll next={next} hasMore={!isLastPage}>
            <FormLayout
              formSchema={contactLabelsFormSchema({
                list,
                setPage,
              })}
            />
          </InfiniteScroll>
        </DrawerBody>
        <DrawerFooter>
          <Button appearance="ghost" onClick={handleClose}>
            {t('common:cancel')}
          </Button>
          <Button appearance="primary" onClick={handleClose}>
            <span>{t('common:update')}</span>
          </Button>
        </DrawerFooter>
      </div>
    </div>
  );
};

export default ContactLabels;
