import { Tooltip, Whisper } from 'rsuite';

type Props = {
  tags: ContactLabel[];
};
const ContactTagLabel = ({ tags }: Props) => {
  return (
    <div className="pw-w-full pw-flex pw-flex-wrap pw-px-4 pw-gap-1">
      {tags.map((tag: ContactLabel, index: number) => {
        if (index < 3) {
          return (
            <Whisper
              key={tag.id}
              placement="autoVerticalStart"
              trigger="hover"
              speaker={<Tooltip arrow={false}>{tag.name}</Tooltip>}
            >
              <div className="pw-flex pw-items-center pw-bg-neutral-divider pw-rounded-md pw-py-0.5 pw-px-1 pw-w-max pw-max-w-xs">
                <LabelItem name={tag.name} />
              </div>
            </Whisper>
          );
        }
        if (index === 3) {
          return (
            <Whisper
              key={tag.id}
              placement="autoVerticalStart"
              trigger="hover"
              speaker={
                <Tooltip arrow={false}>
                  {tags.map((moreLabel, index) => {
                    if (index >= 2) {
                      return (
                        <div
                          key={moreLabel.id}
                          className="pw-flex pw-gap-x-1 pw-items-center pw-bg-neutral-divider pw-rounded-md pw-py-0.5 pw-px-1 pw-mb-1 pw-w-max pw-max-w-[100px] first-of-type:pw-mt-1"
                        >
                          <LabelItem name={moreLabel.name} />
                        </div>
                      );
                    }
                  })}
                </Tooltip>
              }
            >
              <div className="pw-flex pw-gap-x-1 pw-items-center pw-bg-neutral-divider pw-rounded-md pw-py-0.5 pw-px-1 pw-w-max pw-max-w-xs">
                <span className="pw-text-neutral-secondary pw-text-xs pw-font-semibold line-clamp-1">
                  +{tags.length - 3}
                </span>
              </div>
            </Whisper>
          );
        }
      })}
    </div>
  );
};

const LabelItem = ({ name }: { name: string }): JSX.Element => {
  return <span className="pw-text-neutral-secondary pw-text-xs pw-font-semibold line-clamp-1">{name}</span>;
};

export default ContactTagLabel;
