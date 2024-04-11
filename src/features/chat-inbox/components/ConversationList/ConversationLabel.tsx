import { Tooltip, Whisper } from 'rsuite';
import { LabelItem } from '~app/features/chat-inbox/components';

type Props = {
  labels: ChatItemLabel[];
};
const ConversationLabel = ({ labels }: Props) => {
  return (
    <div className="pw-flex pw-gap-x-1">
      {labels.map((label: ChatItemLabel, index: number) => {
        if (index < 2) {
          return (
            <Whisper
              key={label.id}
              placement="bottomStart"
              trigger="hover"
              speaker={<Tooltip arrow={false}>{label.label.name}</Tooltip>}
            >
              <div className="pw-flex pw-gap-x-1 pw-items-center pw-bg-neutral-divider pw-rounded-md pw-py-0.5 pw-px-1 pw-w-max pw-max-w-[84px]">
                <LabelItem item={label.label} />
              </div>
            </Whisper>
          );
        }
        if (index === 2) {
          return (
            <Whisper
              key={label.id}
              placement="bottomStart"
              trigger="hover"
              speaker={
                <Tooltip arrow={false}>
                  {labels.map((moreLabel, index) => {
                    if (index >= 2) {
                      return (
                        <div
                          key={moreLabel.id}
                          className="pw-flex pw-gap-x-1 pw-items-center pw-bg-neutral-divider pw-rounded-md
                           pw-py-0.5 pw-px-1 pw-mb-1 pw-w-max pw-max-w-[100px] first-of-type:pw-mt-1"
                        >
                          <LabelItem item={moreLabel.label} />
                        </div>
                      );
                    }
                  })}
                </Tooltip>
              }
            >
              <div className="pw-flex pw-gap-x-1 pw-items-center pw-bg-neutral-divider pw-rounded-md pw-py-0.5 pw-px-1 pw-w-max pw-max-w-[84px]">
                <span className="pw-text-neutral-secondary pw-text-2xs pw-font-semibold line-clamp-1">
                  +{labels.length - 2}
                </span>
              </div>
            </Whisper>
          );
        }
      })}
    </div>
  );
};

export default ConversationLabel;
