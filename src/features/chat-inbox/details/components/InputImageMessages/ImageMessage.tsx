import { BsX } from 'react-icons/bs';
import { IconButton } from 'rsuite';
import { isLocalImage, revokeObjectUrl } from '~app/utils/helpers';
import { useCurrentConversation } from '~app/utils/hooks';

type Props = {
  src?: string;
};

const ImageMessage = ({ src }: Props) => {
  const { setSelectedImages } = useCurrentConversation();

  const handleRemove = () => {
    setSelectedImages((prevState) => {
      const newState = [...prevState];
      return newState.filter((item) => {
        if (isLocalImage(item)) {
          return item?.url !== src;
        }
        return item !== src;
      });
    });
    revokeObjectUrl(src || '');
  };

  return (
    <div className="pw-w-20 pw-h-20 pw-relative pw-rounded">
      <img src={src} className="pw-w-full pw-max-w-full pw-h-full pw-object-cover pw-rounded" />
      <IconButton
        icon={<BsX className="pw-fill-white" />}
        circle
        size="xs"
        className="!pw-absolute pw-top-1 pw-right-1 !pw-p-1 !pw-bg-neutral-placeholder "
        onClick={handleRemove}
      />
    </div>
  );
};

export default ImageMessage;
