import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFillSuitHeartFill, BsReplyFill } from 'react-icons/bs';
import { Tooltip, Whisper } from 'rsuite';
import { updateContentCacheConversation } from '~app/features/chat-inbox/utils';
import { useReactMessageMutation } from '~app/services/mutations';
import { MessageReactType } from '~app/utils/constants';
// import { ModalPlacement, ModalRendererInline, ModalTypes, ModalSize } from '~app/modals';

type Props = {
  defaultHasReaction: boolean;
  className?: string;
  messageId?: string;
  participantId?: string;
  converstationId?: string;
  onClickReplied(): void;
};

// type ModalData = {
//   modal: ModalTypes;
//   size?: ModalSize;
//   placement?: ModalPlacement;
//   onClick(value: string): void;
// };

const MessageAction = ({
  defaultHasReaction,
  className,
  messageId,
  participantId,
  converstationId,
  onClickReplied,
}: Props) => {
  const { t } = useTranslation('chat');
  const { mutateAsync } = useReactMessageMutation();
  const [hasReaction, setHasReaction] = useState(defaultHasReaction);
  // const [modalData, setModalData] = useState<ModalData | null>(null);
  // const [selectedReport, setSelectedReport] = useState('')

  useEffect(() => {
    setHasReaction(defaultHasReaction);
  }, [defaultHasReaction]);

  const handleReaction = async () => {
    setHasReaction((prevState) => !prevState);
    try {
      const response = await mutateAsync({
        messageId,
        participantId,
        reactType: MessageReactType.LOVE,
      } as ExpectedAny);
      updateContentCacheConversation(response, converstationId);
    } catch (error) {
      setHasReaction(false);
    }
  };

  // const handleClickReport = (value: string) => {
  //   setSelectedReport(value);
  // }

  // const handleReport = () => {
  //   setModalData({
  //     modal: ModalTypes.ReportMessage,
  //     size: ModalSize.Xsmall,
  //     placement: ModalPlacement.Right,
  //     onClick: handleClickReport
  //   });
  // };

  return (
    <div className={cx('pw-flex pw-bg-neutral-white', className)}>
      <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>{t('action.like')}</Tooltip>}>
        <button
          className="pw-rounded-l pw-border pw-border-solid pw-border-neutral-divider pw-p-1.5"
          onClick={handleReaction}
        >
          <BsFillSuitHeartFill
            size={16}
            className={hasReaction ? 'pw-fill-error-active' : 'pw-fill-neutral-placeholder'}
          />
        </button>
      </Whisper>
      {/* <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>{t('action.report')}</Tooltip>}>
        <button
          className="pw-border pw-border-l-0 pw-border-r-0 pw-border-solid pw-border-neutral-divider pw-p-1.5 pw-group"
          onClick={handleReport}
        >
          <BsExclamationTriangleFill
            size={16}
            className="pw-fill-neutral-placeholder group-hover:pw-fill-warning-active"
          />
        </button>
      </Whisper> */}
      <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>{t('action.reply')}</Tooltip>}>
        <button
          className="pw-rounded-r pw-border pw-border-solid pw-border-neutral-divider pw-p-1.5 pw-group"
          onClick={onClickReplied}
        >
          <BsReplyFill size={16} className="pw-fill-neutral-placeholder group-hover:pw-fill-secondary-main-blue" />
        </button>
      </Whisper>
      {/* {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />} */}
    </div>
  );
};

export default MessageAction;
