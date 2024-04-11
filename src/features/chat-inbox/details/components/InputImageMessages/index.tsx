import ImageMessage from './ImageMessage';
import { isLocalImage } from '~app/utils/helpers';
import { useCurrentConversation } from '~app/utils/hooks';

const InputImageMessages = () => {
  const { selectedImages } = useCurrentConversation();

  if (selectedImages.length === 0) return null;

  return (
    <div className="pw-flex pw-w-full pw-gap-x-4 pw-gap-y-2 pw-flex-wrap pw-px-3 pw-py-2">
      {selectedImages.map((image) => {
        const url = isLocalImage(image) ? image?.url : image;
        return <ImageMessage src={url} key={url} />;
      })}
    </div>
  );
};

export default InputImageMessages;
