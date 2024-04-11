import { memo } from 'react';

type Props = {
  message: string;
  reactionTag?: React.ReactNode;
};

const ImageMessage = ({ message, reactionTag }: Props) => {
  return (
    <div className="pw-rounded">
      <img className="pw-object-cover pw-max-w-xs pw-rounded-t" src={message} alt="message-image" />
      {reactionTag && <div className="pw-p-3 pw-pt-2">{reactionTag}</div>}
    </div>
  );
};

export default memo(ImageMessage);
