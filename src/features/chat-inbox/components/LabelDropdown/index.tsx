import { memo, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import { Button, Checkbox, Popover, Whisper } from 'rsuite';
import { MdExpandMore, MdLabel } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { updateCacheConversationList } from '../../utils';
import { useChatStore } from '../../hooks';
import { DebouncedInput, EmptyState, InfiniteScroll } from '~app/components';
import { useGetLabelMessageQuery } from '~app/services/queries';
import { removeDuplicates } from '~app/utils/helpers/arrayHelpers';
import { NoDataImage, EmptyStateLabelMessage } from '~app/components/Icons';
import { useUpdateConversationMutation } from '~app/services/mutations';
import { useCurrentConversation } from '~app/utils/hooks';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  onSuccess?: (id: string) => void;
};

const LabelDropdown = () => {
  const { pageId } = useParams();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const whisperRef = useRef<ExpectedAny>(null);
  const [filter] = useChatStore((store) => store.filter);
  const [pageIds] = useChatStore((store) => store.pageIds);
  const { t } = useTranslation('chat');
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [list, setList] = useState<Label[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { currentConversation, setCurrentConversation } = useCurrentConversation();
  const { data } = useGetLabelMessageQuery({ page, pageSize: 10, search });
  const { mutateAsync } = useUpdateConversationMutation();

  const next = useCallback(() => setPage((prevState) => prevState + 1), []);
  const isLastPage = useMemo(() => page >= (data?.meta?.total_pages || 1), [data?.meta?.total_pages, page]);

  useEffect(() => {
    if (currentConversation) {
      setSelectedIds(currentConversation.labels.map((label) => label.label_id));
    }
  }, [currentConversation]);

  useEffect(() => {
    if (page > 1) {
      setList((prevState) => removeDuplicates([...prevState, ...(data?.data || [])], 'id'));
    } else {
      setList(data?.data || []);
    }
  }, [data, page]);

  const handleChange = (newId: string) => {
    const existed = selectedIds.find((id) => id === newId);
    setSelectedIds(existed ? selectedIds.filter((id) => id !== newId) : [...selectedIds, newId]);
  };

  const handleSubmit = async (onClose: () => void) => {
    try {
      if (currentConversation) {
        const data = {
          title: currentConversation.title,
          avatar: currentConversation.avatar,
          label_ids: selectedIds,
        };
        const response = await mutateAsync({ id: pageId || '', data });
        if (response) {
          const newConversation = { ...currentConversation, labels: response.labels };
          setCurrentConversation(newConversation);
          updateCacheConversationList(newConversation, { ...filter, pageIds }, pageId);
          whisperRef?.current ? whisperRef?.current?.close() : onClose();
        }
      }
    } catch (error) {
      // TO DO
    }
  };

  const handleSuccess = (id: string) => {
    setSelectedIds([...selectedIds, id]);
    whisperRef?.current?.open();
  };

  const handleCreateLabel = () => {
    setModalData({
      modal: ModalTypes.LabelMessageCreate,
      placement: ModalPlacement.Right,
      size: ModalSize.Xsmall,
      onSuccess: handleSuccess,
    });
  };

  return (
    <>
      <Whisper
        placement="topEnd"
        trigger="click"
        ref={whisperRef}
        onClose={() => setSelectedIds((currentConversation?.labels || []).map((label) => label.label_id))}
        speaker={({ onClose, left, top, className }, ref) => {
          return (
            <Popover
              ref={ref}
              className={cx('!pw-rounded-none pw-w-84', className)}
              style={{ left, top }}
              arrow={false}
              full
            >
              <div className="pw-relative">
                {(search || list.length > 0) && (
                  <>
                    <DebouncedInput
                      className="pw-m-4 pw-mb-1"
                      value=""
                      icon="search"
                      onChange={(value) => {
                        page > 1 && setPage(1);
                        contentRef?.current?.scroll({ top: 0 });
                        setSearch(value);
                      }}
                      placeholder={t('placeholder.label') || ''}
                    />
                    <Button
                      className="!pw-text-blue-600 !pw-font-bold pw-ml-1"
                      appearance="subtle"
                      startIcon={<BsPlusCircleFill size={24} />}
                      onClick={() => {
                        handleCreateLabel();
                        onClose();
                      }}
                    >
                      {t('action.create_label')}
                    </Button>
                  </>
                )}
                <div
                  ref={contentRef}
                  className={cx('pw-overflow-y-auto pw-overflow-x-hidden pw-h-96', {
                    'pw-flex pw-items-center pw-justify-center': !search && list.length === 0,
                  })}
                >
                  {!search && list.length === 0 && (
                    <EmptyState
                      icon={<EmptyStateLabelMessage />}
                      textBtn={t('action.create_label_conversation') || ''}
                      description1={t('empty_state_label')}
                      onClick={() => {
                        handleCreateLabel();
                        onClose();
                      }}
                    />
                  )}
                  {search && list.length === 0 ? (
                    <div className="pw-py-3 pw-flex pw-flex-col pw-items-center pw-justify-center">
                      <NoDataImage />
                      <div className="pw-text-base">{t('common:no-data')}</div>
                    </div>
                  ) : (
                    <InfiniteScroll next={next} hasMore={!isLastPage}>
                      {list.map((label) => (
                        <div
                          key={label.id}
                          className="pw-flex pw-items-center pw-justify-between pw-ml-4 pw-py-2.5 pw-border-b pw-cursor-pointer"
                          onClick={() => handleChange(label.id)}
                        >
                          <div className="pw-flex pw-items-center">
                            <div className="pw-min-w-fit">
                              <MdLabel size={24} color={label.color} />
                            </div>
                            <span className="pw-text-base pw-ml-2 line-clamp-1">{label.name}</span>
                          </div>
                          <Checkbox
                            checked={selectedIds.some((id) => id === label.id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChange(label.id);
                            }}
                          />
                        </div>
                      ))}
                    </InfiniteScroll>
                  )}
                </div>
                {(search || list.length > 0) && (
                  <div className="pw-bg-white pw-py-3 pw-px-4 pw-absolute pw-b-0 pw-shadow-revert pw-w-full">
                    <Button
                      appearance="primary"
                      className="!pw-py-3 pw-w-full !pw-text-base !pw-font-bold"
                      onClick={() => handleSubmit(onClose)}
                    >
                      {t('common:finished')}
                    </Button>
                  </div>
                )}
              </div>
            </Popover>
          );
        }}
      >
        <Button
          className={cx('!pw-font-bold', {
            '!pw-text-blue-primary': selectedIds.length > 0,
          })}
          startIcon={<MdLabel size={20} />}
          endIcon={<MdExpandMore size={20} />}
        >
          {t('label')} {selectedIds.length > 0 && `(${selectedIds.length})`}
        </Button>
      </Whisper>
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </>
  );
};

export default memo(LabelDropdown);
