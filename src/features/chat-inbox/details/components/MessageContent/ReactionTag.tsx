import { BsFillSuitHeartFill } from 'react-icons/bs';
import { Tag } from 'rsuite';

type Props = {
  reactions?: Reaction[];
  participants?: Participant[];
};

const ReactionTag = ({ reactions, participants }: Props) => {
  const dataReactions = participants
    ?.map((item) => {
      const allReactionIs = (reactions || []).map((reaction) => reaction.participant_id);
      return item?.info?.id && allReactionIs.includes(item.id) ? item.info.name : null;
    })
    .filter((item) => item)
    .join(', ');

  return (
    <Tag className="pw-mt-1 !pw-bg-neutral-border !pw-rounded-[4px]">
      <div className="pw-flex pw-gap-1 pw-items-center">
        <BsFillSuitHeartFill size="12" className="pw-fill-error-active" />
        <span className="pw-text-xs pw-text-neutral-secondary">{dataReactions}</span>
      </div>
    </Tag>
  );
};

export default ReactionTag;
