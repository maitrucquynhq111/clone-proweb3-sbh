import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { BsChevronDown, BsPlus, BsPlusCircleFill } from 'react-icons/bs';
import { Button, Placeholder, Popover, Whisper } from 'rsuite';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ContactSelectItem from './ContactSelectItem';
import { ButtonTransparent, EmptyState, InfiniteScroll } from '~app/components';
import { EmptyStateProduct, NoDataImage } from '~app/components/Icons';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals';
import { useContactsQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';

type Props = {
  contacts: Contact[];
  onChange(value: ExpectedAny): void;
};

const ContactSelectInUpdate = ({ contacts = [], onChange }: Props): JSX.Element => {
  const { t } = useTranslation('contact-group-form');
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [list, setList] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const { data, isLoading } = useContactsQuery({
    page,
    pageSize: 10,
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
    if (contacts.length > 0) {
      setSelectedContacts(contacts);
    }
  }, [contacts]);

  useEffect(() => {
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...(data?.data || [])], 'id'));
    } else {
      setList(data?.data || []);
    }
  }, [data?.data, page]);

  const handleSelect = (contact: Contact, checked: boolean, isDelete?: boolean) => {
    if (checked) {
      return setSelectedContacts([...selectedContacts, contact]);
    }
    const newSelected = selectedContacts.filter((selectedProduct) => selectedProduct.id !== contact.id);
    setSelectedContacts(newSelected);
    if (isDelete) onChange(newSelected);
  };

  const handleOpenCreate = (onClose: () => void) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.ContactCreate,
        placement: ModalPlacement.Right,
        size: ModalSize.Small,
      })}`,
    });
    onClose();
  };

  return (
    <Whisper
      placement="bottomEnd"
      trigger="click"
      speaker={({ onClose, left, top, className }, ref) => {
        return (
          <Popover
            ref={ref}
            className={cx('!pw-rounded-none pw-w-xs', className)}
            style={{ left, top }}
            arrow={false}
            full
          >
            {list.length === 0 && (
              <EmptyState
                icon={<EmptyStateProduct size="120" />}
                description1={t('empty_state_contact')}
                textBtn={t('action.create_contact') || ''}
                className="pw-mb-4 pw-mt-2 pw-mx-4"
                onClick={() => handleOpenCreate(onClose)}
              />
            )}
            <div className="pw-p-4 pw-pt-0 pw-pr-0">
              <ButtonTransparent onClick={() => handleOpenCreate(onClose)}>
                <div className="pw-flex pw-items-center pw-text-blue-primary pw-py-3">
                  <BsPlusCircleFill size={22} />
                  <span className="pw-font-bold pw-mx-1">{t('action.create_contact')}</span>
                  <BsChevronDown size={22} />
                </div>
              </ButtonTransparent>
              {isLoading ? (
                <div className="pw-mt-3">
                  <Placeholder.Graph active className="pw-rounded" height={200} />
                </div>
              ) : list.length > 0 ? (
                <div className="pw-overflow-y-auto pw-overflow-x-hidden pw-max-h-[40vh]">
                  <InfiniteScroll next={next} hasMore={!isLastPage}>
                    {list.map((contact) => {
                      const checked = selectedContacts.some((selectedProduct) => selectedProduct.id === contact.id);
                      return (
                        <ContactSelectItem
                          key={contact.id}
                          contact={contact}
                          checked={checked}
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
                  onClick={() => {
                    onChange([]);
                    setSelectedContacts([]);
                    onClose();
                  }}
                >
                  {t('action.delete_selected')}
                </Button>
                <Button
                  appearance="primary"
                  className="!pw-text-base !pw-font-bold !pw-py-3 pw-w-full pw-ml-4"
                  onClick={() => {
                    onChange(selectedContacts);
                    onClose();
                  }}
                >
                  {t('action.confirm')} ({selectedContacts.length})
                </Button>
              </div>
            </div>
          </Popover>
        );
      }}
    >
      <Button appearance="primary" startIcon={<BsPlus size={24} />} className="!pw-font-bold">
        {t('action.add_contact')}
      </Button>
    </Whisper>
  );
};

export default ContactSelectInUpdate;
