import { useTranslation } from 'react-i18next';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Button, Placeholder } from 'rsuite';
import { PlaceholderImage } from '~app/components';
import { getParticipant } from '~app/features/chat-inbox/utils';
import { ModalTypes } from '~app/modals';
import { useProductDetailQuery } from '~app/services/queries';
import { getRangePrice } from '~app/utils/helpers';

type Props = {
  productId: string;
  participants: Participant[];
  reactionTag?: React.ReactNode;
};

const ProductMessage = ({ productId, reactionTag, participants }: Props) => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();
  const { data: productDetail, isFetching } = useProductDetailQuery(productId ? productId : '', false);

  const handleClick = () => {
    const senderInfo = getParticipant(participants, true)?.info;
    const otherParticipantInfo = getParticipant(participants, false)?.info;
    if (senderInfo?.id === productDetail?.business_id) {
      navigate({
        pathname: location.pathname,
        search: `?${createSearchParams({
          modal: ModalTypes.ProductDetails,
          id: productId,
        })}`,
      });
    } else {
      const url = `https://${otherParticipantInfo?.domain}/p/${productDetail?.id}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div>
      {isFetching ? (
        <div className="pw-flex pw-items-center pw-ml-3 pw-mr-5 pw-mb-2">
          <Placeholder.Graph className="pw-rounded pw-mr-2" active width={18} height={18} />
          <Placeholder.Graph active className="pw-rounded" height={18} />
        </div>
      ) : null}
      {productDetail ? (
        <div className="pw-flex pw-flex-col pw-max-w-xs">
          <PlaceholderImage
            src={productDetail?.images?.[0]}
            alt={productDetail.name}
            className="pw-min-h-64 pw-aspect-square "
          />
          <div className="pw-py-3 pw-px-4">
            <h4 className="pw-font-bold pw-text-sm pw-text-neutral-primary pw-mb-1">{productDetail.name}</h4>
            <h5 className="pw-font-normal pw-text-sm pw-text-neutral-primary pw-mb-3">
              {getRangePrice(productDetail)}
            </h5>
            <Button block className="pw-button-secondary-outline !pw-py-1.5 !pw-px-6" onClick={handleClick}>
              {t('view-detail')}
            </Button>
          </div>
        </div>
      ) : null}
      {reactionTag && <div className="pw-p-3 pw-pt-2">{reactionTag}</div>}
    </div>
  );
};

export default ProductMessage;
