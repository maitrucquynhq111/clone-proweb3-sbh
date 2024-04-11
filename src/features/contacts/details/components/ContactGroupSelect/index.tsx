import { memo, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import { Button, Popover, Whisper } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import ContactGroupItem from '~app/features/contacts/components/ContactGroupSelect/ContactGroupItem';
import { ButtonTransparent, DebouncedInput, EmptyState, InfiniteScroll } from '~app/components';
import { useContactsGroupsQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
import { NoDataImage, EmptyStateContactGroup } from '~app/components/Icons';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { MainRouteKeys } from '~app/routes/enums';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  onSuccess?: (newGroup: ContactGroup) => void;
};

type Props = {
  contactId: string;
  contactGroups: ContactGroup[];
  onChange(groups: ContactGroup[]): void;
};

const ContactGroupSelect = ({ contactId, contactGroups, onChange }: Props) => {
  const navigate = useNavigate();
  const whisperRef = useRef<ExpectedAny>(null);
  const { t } = useTranslation('contact-form');
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [list, setList] = useState<ContactGroup[]>([]);
  const [selectedTemp, setSelectedTemp] = useState<ContactGroup[]>([]);
  const { data } = useContactsGroupsQuery({ page, pageSize: 10, search });

  const next = useCallback(() => setPage((prevState) => prevState + 1), []);
  const isLastPage = useMemo(() => page >= (data?.meta?.total_pages || 1), [data?.meta?.total_pages, page]);

  useEffect(() => {
    setSelectedTemp(contactGroups);
  }, []);

  useEffect(() => {
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...(data?.data || [])], 'id'));
    } else {
      setList(data?.data || []);
    }
  }, [data, page]);

  const handleChange = (selectedGroup: ContactGroup) => {
    const existed = selectedTemp.find((group) => group.id === selectedGroup.id);
    setSelectedTemp(
      existed ? selectedTemp.filter((group) => group.id !== selectedGroup.id) : [...selectedTemp, selectedGroup],
    );
  };

  const handleCreateGroupSuccess = (newGroup: ContactGroup) => {
    setPage(1);
    const existed = (newGroup?.contacts || []).find((contact) => contact.id === contactId);
    if (existed) {
      setSelectedTemp([...selectedTemp, newGroup]);
    }
    whisperRef.current?.open();
  };

  const handleOpenCreate = (onClose: () => void) => {
    setModalData({
      modal: ModalTypes.ContactGroupCreate,
      placement: ModalPlacement.Right,
      size: ModalSize.Full,
      onSuccess: handleCreateGroupSuccess,
    });
    onClose();
  };

  const handleSubmit = () => {
    onChange(selectedTemp);
    whisperRef.current?.close();
  };

  return (
    <>
      <Whisper
        ref={whisperRef}
        placement="autoVerticalEnd"
        trigger="click"
        speaker={({ onClose, left, top, className }, ref) => {
          return (
            <Popover
              ref={ref}
              className={cx('!pw-rounded-none pw-w-106', className)}
              style={{ left, top }}
              arrow={false}
              full
            >
              <div
                className={cx({
                  '!pw-p-4': !search && list.length === 0,
                })}
              >
                {!search && list.length === 0 && (
                  <EmptyState
                    icon={<EmptyStateContactGroup size="120" />}
                    description1={t('empty_state_contact_group')}
                    textBtn={t('action.create_contact_group') || ''}
                    className="pw-mb-4 pw-mt-2 pw-mx-4"
                    onClick={() => handleOpenCreate(onClose)}
                  />
                )}
                {(search || list.length > 0) && (
                  <>
                    <div className="pw-p-4 pw-pb-0">
                      <DebouncedInput
                        value=""
                        placeholder={t('placeholder.select_contact_group') || ''}
                        icon="search"
                        onChange={(value) => {
                          page > 1 && setPage(1);
                          setSearch(value);
                        }}
                      />
                    </div>
                    <ButtonTransparent onClick={() => handleOpenCreate(onClose)}>
                      <div className="pw-flex pw-items-center pw-text-blue-primary pw-py-3 pw-pl-4">
                        <BsPlusCircleFill size={22} />
                        <span className="pw-font-bold pw-mx-1">{t('action.create_contact_group')}</span>
                      </div>
                    </ButtonTransparent>
                  </>
                )}
                {list.length > 0 && (
                  <div className="pw-overflow-y-auto pw-overflow-x-hidden pw-h-[32vh] pw-pl-4">
                    <InfiniteScroll next={next} hasMore={!isLastPage}>
                      {list.map((group) => {
                        const checked = selectedTemp.some((selectedGroup) => selectedGroup.id === group.id);
                        return (
                          <ContactGroupItem key={group.id} group={group} checked={checked} onChange={handleChange} />
                        );
                      })}
                    </InfiniteScroll>
                  </div>
                )}
                {search && list.length === 0 && (
                  <div className="pw-h-[32vh] pw-flex pw-flex-col pw-items-center pw-justify-center">
                    <NoDataImage width={120} height={120} />
                    <div className="pw-text-base">{t('common:no-data')}</div>
                  </div>
                )}
                <div className="pw-flex pw-shadow-revert pw-p-4">
                  <Button
                    appearance="ghost"
                    size="md"
                    className="pw-w-full !pw-font-bold pw-mr-2"
                    onClick={() => navigate(MainRouteKeys.ContactsGroup)}
                  >
                    {t('contact-details:action.group_management')}
                  </Button>
                  <Button appearance="primary" size="md" className="pw-w-full !pw-font-bold" onClick={handleSubmit}>
                    {t('common:finished')}
                  </Button>
                </div>
              </div>
            </Popover>
          );
        }}
      >
        <span className="pw-cursor-pointer pw-text-blue-primary" onClick={() => setSelectedTemp(contactGroups)}>
          <BsPlusCircleFill size={22} />
        </span>
      </Whisper>
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </>
  );
};

export default memo(ContactGroupSelect);
