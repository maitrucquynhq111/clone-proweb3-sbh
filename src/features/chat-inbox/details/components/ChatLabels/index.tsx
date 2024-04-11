import { useCurrentConversation } from '~app/utils/hooks';
import { LabelDropdown, LabelItem } from '~app/features/chat-inbox/components';
import { isShowLabelSection } from '~app/features/chat-inbox/utils';

const ChatLabels = () => {
  const { currentConversation } = useCurrentConversation();

  if (!isShowLabelSection(currentConversation?.type || '')) return null;

  return (
    <div className="pw-flex pw-items-center pw-justify-between pw-pb-3">
      {currentConversation?.labels && (
        <div className="pw-flex pw-items-center">
          {(currentConversation?.labels || []).map((label) => (
            <div
              key={label.id}
              className="pw-flex pw-gap-x-1 pw-items-center pw-bg-neutral-divider pw-rounded-md pw-py-0.5 pw-px-1 pw-w-max pw-max-w-[120px] pw-mr-2"
            >
              <LabelItem item={label.label} className="pw-text-xs" />
            </div>
          ))}
        </div>
      )}
      <div className="pw-flex pw-justify-end">
        <LabelDropdown />
      </div>
    </div>
  );
};

export default ChatLabels;
