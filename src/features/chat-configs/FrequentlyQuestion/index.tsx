import { useTranslation } from 'react-i18next';
import { Button, Toggle } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FrequentlyQuestionsList from './lists';
import { toPendingFrequentlyQuestion } from './utils';
import { useUpdateFrequentlyQuestionMutation } from '~app/services/mutations';
import { Header } from '~app/features/chat-configs/components';
import { EmptyStateConnectFB, EmptyStatePhone, FrequentlyQuestionPhone } from '~app/components/Icons';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { CURRENT_LINK_PAGE_KEY, useGetCurrentLinkPage, useGetFrequentlyQuestion } from '~app/services/queries';
import { EmptyState } from '~app/components';
import { queryClient } from '~app/configs/client';
import { MainRouteKeys } from '~app/routes/enums';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  pageId: string;
  suggestMessageEnable: boolean;
  detail?: FrequentlyQuestion;
  questions: FrequentlyQuestion[];
};

const MAX_QUESTIONS = 4;

const AutoMessage = () => {
  const { t } = useTranslation('chat');
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<Page | null>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [applyQuestion, setApplyQuestion] = useState(false);
  const { mutateAsync } = useUpdateFrequentlyQuestionMutation();
  const { data, isError } = useGetCurrentLinkPage({});
  const { data: frequentlyQuestions } = useGetFrequentlyQuestion({
    business_has_page_id: activePage?.id || '',
  });
  const linkedPages = (data?.pages || []).filter((item: ExpectedAny) => item.active);
  const isConnectedFacebook = !!data && !isError;
  useEffect(() => {
    if (!activePage && linkedPages.length > 0 && linkedPages?.[0]) {
      setActivePage(linkedPages[0]);
      setApplyQuestion(linkedPages[0].business_has_page_setting.suggest_message_enable);
    }
  }, [linkedPages]);

  const handleClickCreate = () => {
    setModalData({
      modal: ModalTypes.FrequentlyQuestionCreate,
      placement: ModalPlacement.Right,
      size: ModalSize.Xsmall,
      pageId: activePage?.id || '',
      suggestMessageEnable: activePage?.business_has_page_setting?.suggest_message_enable || false,
      questions: frequentlyQuestions?.data || [],
    });
  };

  const handleChange = async (value: boolean) => {
    setApplyQuestion(value);
    if (frequentlyQuestions?.data && activePage) {
      try {
        const data = frequentlyQuestions.data.map((question) => toPendingFrequentlyQuestion(question));
        await mutateAsync({ business_has_page_id: activePage.id, data, suggest_message_enable: value });
        queryClient.invalidateQueries([CURRENT_LINK_PAGE_KEY], { exact: false });
        toast.success(t('success.update_question'));
      } catch (error) {
        setApplyQuestion(!value);
      }
    }
  };
  if (!isConnectedFacebook || linkedPages.length === 0) {
    return (
      <EmptyState
        icon={<EmptyStateConnectFB />}
        description1={t('empty_state_connect_fb')}
        textBtn={t('action.connect_now') || ''}
        onClick={() => navigate(MainRouteKeys.ChatConfigsPages)}
      />
    );
  }
  return (
    <div className="pw-border pw-rounded pw-border-neutral-divider">
      <Header linkedPages={linkedPages} activePage={activePage} onClick={setActivePage} />
      {frequentlyQuestions?.data?.length === 0 ? (
        <EmptyState
          className="pw-mt-3 pw-mb-8 pw-mx-auto pw-w-80"
          icon={<EmptyStatePhone />}
          description1={t('empty_state_frequently_question')}
          textBtn={t('action.create_question') || ''}
          onClick={handleClickCreate}
        />
      ) : (
        <div className="pw-grid pw-grid-cols-12 pw-p-6 pw-gap-4">
          <div className="md:pw-col-span-12 xl:pw-col-span-8">
            <div className="pw-flex pw-justify-between pw-mb-5">
              <div className="pw-text-base pw-font-bold">{t('apply_frequently_question')}</div>
              <Toggle checked={applyQuestion} onChange={handleChange} />
            </div>
            <div className="pw-flex pw-items-center pw-justify-between -pw-mb-4">
              <div className="pw-font-bold">{t('question_list')}</div>
              {(frequentlyQuestions?.data?.length || 0) < MAX_QUESTIONS && (
                <Button
                  className="!pw-text-base !pw-font-bold !pw-py-3 !pw-px-4"
                  appearance="primary"
                  startIcon={<PlusIcon />}
                  onClick={handleClickCreate}
                >
                  {t('action.create_question')} ({frequentlyQuestions?.data?.length}/{MAX_QUESTIONS})
                </Button>
              )}
            </div>
            <FrequentlyQuestionsList
              activePage={activePage}
              questions={frequentlyQuestions?.data || []}
              setModalData={setModalData}
            />
          </div>
          <div className="md:pw-col-span-12 xl:pw-col-span-4 pw-flex pw-justify-end">
            <FrequentlyQuestionPhone />
          </div>
        </div>
      )}
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </div>
  );
};

export default AutoMessage;
