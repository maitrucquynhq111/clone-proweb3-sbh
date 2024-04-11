import { memo, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { BsChevronDown, BsPlusCircleFill } from 'react-icons/bs';
import { Popover, Tag, Whisper } from 'rsuite';
import ContactGroupItem from './ContactGroupItem';
import { ButtonTransparent, DebouncedInput, EmptyState, InfiniteScroll } from '~app/components';
import { useContactsGroupsQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
import { NoDataImage, EmptyStateContactGroup } from '~app/components/Icons';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  onSuccess?: (newGroup: ContactGroup) => void;
};

type Props = {
  selectedGroups: ContactGroup[];
  onChange(groups: ContactGroup[]): void;
};

const ContactGroupSelect = ({ selectedGroups, onChange }: Props) => {
  const whisperRef = useRef<ExpectedAny>(null);
  const { t } = useTranslation('contact-form');
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [list, setList] = useState<ContactGroup[]>([]);
  const { data } = useContactsGroupsQuery({ page, pageSize: 10, search });

  const next = useCallback(() => setPage((prevState) => prevState + 1), []);
  const isLastPage = useMemo(() => page >= (data?.meta?.total_pages || 1), [data?.meta?.total_pages, page]);

  useEffect(() => {
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...(data?.data || [])], 'id'));
    } else {
      setList(data?.data || []);
    }
  }, [data, page]);

  const handleChange = (selectedGroup: ContactGroup) => {
    const existed = selectedGroups.find((group) => group.id === selectedGroup.id);
    onChange(
      existed ? selectedGroups.filter((group) => group.id !== selectedGroup.id) : [...selectedGroups, selectedGroup],
    );
  };

  const handleCreateGroupSuccess = (newGroup: ContactGroup) => {
    setPage(1);
    onChange([...selectedGroups, newGroup]);
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

  return (
    <>
      <label className="!pw-text-left pw-block pw-mb-1 pw-text-sm" htmlFor={t('contact_group') || ''}>
        {t('contact_group')}
      </label>
      <Whisper
        ref={whisperRef}
        placement="bottomStart"
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
                className={cx('pw-p-4 pw-pt-0 pw-pr-0', {
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
                    <div className="pw-pt-4 pw-pr-4">
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
                      <div className="pw-flex pw-items-center pw-text-blue-primary pw-py-3">
                        <BsPlusCircleFill size={22} />
                        <span className="pw-font-bold pw-mx-1">{t('action.create_contact_group')}</span>
                      </div>
                    </ButtonTransparent>
                  </>
                )}
                {list.length > 0 && (
                  <div className="pw-overflow-y-auto pw-overflow-x-hidden pw-h-[35vh]">
                    <InfiniteScroll next={next} hasMore={!isLastPage}>
                      {list.map((group) => {
                        const checked = selectedGroups.some((selectedGroup) => selectedGroup.id === group.id);
                        return (
                          <ContactGroupItem key={group.id} group={group} checked={checked} onChange={handleChange} />
                        );
                      })}
                    </InfiniteScroll>
                  </div>
                )}
                {search && list.length === 0 && (
                  <div className="pw-h-[35vh] pw-flex pw-flex-col pw-items-center pw-justify-center">
                    <NoDataImage width={120} height={120} />
                    <div className="pw-text-base">{t('common:no-data')}</div>
                  </div>
                )}
              </div>
            </Popover>
          );
        }}
      >
        <div className="pw-border pw-border-neutral-border pw-rounded pw-py-1.5 pw-px-3.5 pw-cursor-pointer">
          {selectedGroups.length === 0 ? (
            <div className="pw-flex pw-items-center pw-justify-between">
              <span className="pw-text-base pw-text-neutral-placeholder">{t('placeholder.select_contact_group')}</span>
              <BsChevronDown size={12} />
            </div>
          ) : (
            <div className="pw-flex pw-items-center pw-flex-wrap">
              {selectedGroups.map((group) => (
                <Tag
                  key={group.id}
                  closable
                  className="pw-mb-2"
                  onClose={(e) => {
                    e.stopPropagation();
                    handleChange(group);
                  }}
                >
                  {group.name}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </Whisper>
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </>
  );
};

export default memo(ContactGroupSelect);
