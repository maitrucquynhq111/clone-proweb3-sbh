import { memo, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import { Button, Popover, Whisper } from 'rsuite';
import ContactLabelItem from './ContactLabelItem';
import { ButtonTransparent, DebouncedInput, EmptyState, InfiniteScroll } from '~app/components';
import { useContactsLabelsQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
import { NoDataImage, EmptyStateLabelMessage } from '~app/components/Icons';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { ContactLabelCreate } from '~app/features/contacts/details/components';
import { checkIsChangedLabel } from '~app/features/contacts/utils';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  onSuccess?: (newGroup: ContactLabel) => void;
};

type Props = {
  contactLabels: ContactLabel[];
  onChange(labels: ContactLabel[]): void;
};

const ContactLabelSelect = ({ contactLabels, onChange }: Props) => {
  const whisperRef = useRef<ExpectedAny>(null);
  const { t } = useTranslation('contact-form');
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [list, setList] = useState<ContactLabel[]>([]);
  const [selectedTemp, setSelectedTemp] = useState<ContactLabel[]>([]);
  const { data } = useContactsLabelsQuery({ page, pageSize: 10, name: search });

  const next = useCallback(() => setPage((prevState) => prevState + 1), []);
  const isLastPage = useMemo(() => page >= (data?.meta?.total_pages || 1), [data?.meta?.total_pages, page]);

  useEffect(() => {
    setSelectedTemp(contactLabels);
  }, []);

  useEffect(() => {
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...(data?.data || [])], 'id'));
    } else {
      setList(data?.data || []);
    }
  }, [data, page]);

  const handleChange = (selectedLabel: ContactLabel) => {
    const existed = selectedTemp.find((label) => label.id === selectedLabel.id);
    setSelectedTemp(
      existed ? selectedTemp.filter((label) => label.id !== selectedLabel.id) : [...selectedTemp, selectedLabel],
    );
  };

  const handleCreateLabelSuccess = (newLabel: ContactLabel) => {
    setPage(1);
    setSearch('');
    setSelectedTemp([...selectedTemp, newLabel]);
  };

  const handleClickManagement = () => {
    whisperRef.current?.close();
    setModalData({
      modal: ModalTypes.ContactLabels,
      placement: ModalPlacement.Right,
      size: ModalSize.Xsmall,
    });
  };

  const handleSubmit = () => {
    whisperRef.current?.close();
  };

  return (
    <>
      <Whisper
        ref={whisperRef}
        placement="autoVerticalEnd"
        trigger="click"
        onClose={() => {
          const isChanged = checkIsChangedLabel({ oldLabels: contactLabels, currentLabels: selectedTemp });
          isChanged && onChange(selectedTemp);
        }}
        speaker={({ left, top, className }, ref) => {
          return (
            <Popover
              ref={ref}
              className={cx('!pw-rounded-none pw-w-84', className)}
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
                  <>
                    {!openCreate ? (
                      <EmptyState
                        icon={<EmptyStateLabelMessage />}
                        description1={t('empty_state_contact_tag')}
                        textBtn={t('action.create_contact_label') || ''}
                        className="pw-mb-4 pw-mt-2 pw-mx-4"
                        onClick={() => setOpenCreate(true)}
                      />
                    ) : (
                      <ContactLabelCreate
                        defaultName={search}
                        onSuccess={handleCreateLabelSuccess}
                        onClose={() => setOpenCreate(false)}
                      />
                    )}
                  </>
                )}
                {(search || list.length > 0) && (
                  <>
                    <div className="pw-p-4 pw-pb-0">
                      <DebouncedInput
                        value=""
                        placeholder={t('placeholder.select_contact_label') || ''}
                        icon="search"
                        onChange={(value) => {
                          page > 1 && setPage(1);
                          setSearch(value);
                        }}
                      />
                    </div>
                    {openCreate ? (
                      <ContactLabelCreate
                        defaultName={search}
                        className="pw-py-4 pw-px-5"
                        onSuccess={handleCreateLabelSuccess}
                        onClose={() => setOpenCreate(false)}
                      />
                    ) : (
                      <ButtonTransparent onClick={() => setOpenCreate(true)}>
                        <div className="pw-flex pw-items-center pw-text-blue-primary pw-pt-4 pw-pb-3 pw-pl-4">
                          <BsPlusCircleFill size={22} />
                          <span className="pw-font-bold pw-mx-1">{`${t('action.create_label')} ${
                            search && list.length === 0 ? `"${search}"` : ''
                          }`}</span>
                        </div>
                      </ButtonTransparent>
                    )}
                  </>
                )}
                {list.length > 0 && (
                  <div
                    className={cx('pw-overflow-y-auto pw-overflow-x-hidden pw-h-[32vh] pw-pl-4', {
                      '!pw-h-[calc(32vh-150px)]': openCreate,
                    })}
                  >
                    <InfiniteScroll next={next} hasMore={!isLastPage}>
                      {list.map((label) => {
                        const checked = selectedTemp.some((selectedLabel) => selectedLabel.id === label.id);
                        return (
                          <ContactLabelItem key={label.id} label={label} checked={checked} onChange={handleChange} />
                        );
                      })}
                    </InfiniteScroll>
                  </div>
                )}
                {search && list.length === 0 && (
                  <div
                    className={cx('pw-h-[30vh] pw-flex pw-flex-col pw-items-center pw-justify-center', {
                      '!pw-h-[calc(30vh-150px)]': openCreate,
                    })}
                  >
                    <NoDataImage width={120} height={120} />
                    <div className="pw-text-base">{t('common:no-data')}</div>
                  </div>
                )}
                {(search || list.length > 0) && (
                  <div className="pw-flex pw-shadow-revert pw-p-4">
                    <Button
                      appearance="ghost"
                      size="md"
                      className="pw-w-full !pw-font-bold pw-mr-2"
                      onClick={handleClickManagement}
                    >
                      {t('contact-details:action.label_management')}
                    </Button>
                    <Button appearance="primary" size="md" className="pw-w-full !pw-font-bold" onClick={handleSubmit}>
                      {t('common:finished')}
                    </Button>
                  </div>
                )}
              </div>
            </Popover>
          );
        }}
      >
        <span
          className="pw-cursor-pointer pw-text-blue-primary"
          onClick={() => {
            setSelectedTemp(contactLabels);
            openCreate && setOpenCreate(false);
          }}
        >
          <BsPlusCircleFill size={22} />
        </span>
      </Whisper>
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </>
  );
};

export default memo(ContactLabelSelect);
