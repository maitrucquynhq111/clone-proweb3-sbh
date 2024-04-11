import { IconButton } from 'rsuite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsArrowRepeat } from 'react-icons/bs';
import { PlaceholderImage } from '~app/components';
import { usePostDetailQuery } from '~app/services/queries';
import { getPostId, getParticipant } from '~app/features/chat-inbox/utils';
import { formatDateToString } from '~app/utils/helpers';

type Props = {
  currentConversation: Conversation;
  refetch: () => void;
};

const PostInfo = ({ currentConversation, refetch }: Props) => {
  const { t } = useTranslation('chat');
  const [imgPost, setImgPost] = useState<string>();
  const { data, refetch: refetchPost } = usePostDetailQuery({
    post_id: getPostId(currentConversation) || '',
    participant_id: getParticipant(currentConversation?.participants || [], true)?.id || '',
  });
  useEffect(() => {
    refetchPost();
  }, [currentConversation]);

  useEffect(() => {
    if (data && data.attachments && data.attachments.data?.length > 0) {
      const fistImg = data.attachments.data[0];
      setImgPost(fistImg?.media.image.src);
    }
  }, [data]);

  return (
    <div className="pw-flex pw-bg-neutral-white pw-p-2 pw-rounded pw-gap-x-3 pw-justify-between pw-items-center pw-border-b pw-border-neutral-background">
      <a target="_blank" href={data?.permalink_url} className="pw-flex pw-gap-x-2">
        <PlaceholderImage
          className="!pw-w-12 !pw-h-12 pw-rounded"
          src={imgPost || currentConversation?.page_avatar}
          alt={currentConversation?.page_name}
        />
        <div className="pw-flex pw-flex-col">
          <p className="pw-text-neutral-secondary pw-text-xs pw-font-semibold">
            {currentConversation?.page_name} {t('posted_at').toLowerCase()}{' '}
            {formatDateToString(data?.created_time || new Date(), 'HH:mm dd/MM/yyyy')}
          </p>
          <p className="pw-text-neutral-primary pw-text-sm pw-font-normal hover:!pw-no-underline focus:!pw-no-underline pw-line-clamp-2">
            {data?.message}
          </p>
        </div>
      </a>
      <div>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            refetch();
          }}
          icon={<BsArrowRepeat size={20} className="pw-text-secondary-main-blue " />}
          className="pw-bg-transparent"
          appearance="subtle"
          circle
        />
      </div>
    </div>
  );
};

export default PostInfo;
