import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { MessageType, CardsAssistanceType } from '~app/utils/constants';
import { useCreateMessageMutation } from '~app/services/mutations';

type Props = {
  message: string;
  messageId: string;
  senderId: string;
  reactionTag?: React.ReactNode;
};

type CardAssistanceType = {
  type: string;
  content?: string;
  data?: ExpectedAny[];
};

const CardAssistanceMessage = ({ message, messageId, senderId, reactionTag }: Props) => {
  const { pageId } = useParams();
  const [messageContent, setMessageContent] = useState<CardAssistanceType>();
  const { mutateAsync } = useCreateMessageMutation();
  let slideIndex = 1;

  useEffect(() => {
    const dataMessage = JSON.parse(message);
    setMessageContent(dataMessage);
  }, []);

  useEffect(() => {
    if (messageContent?.type === CardsAssistanceType.CAROUSEL) {
      showSlide(1);
    }
  }, [messageContent]);

  const handleAction = () => {
    const itemSelected = messageContent?.data?.[slideIndex - 1];
    if (itemSelected.actions.length > 0 && itemSelected.actions[0]?.type === 'text') {
      mutateAsync({
        conversation_id: pageId || '',
        message: itemSelected.actions[0]?.value,
        message_type: MessageType.TEXT,
        sender_id: senderId,
      });
    }
  };

  // change slide with the prev/next button
  const moveSlide = (moveStep: number) => {
    showSlide((slideIndex += moveStep));
  };

  // change slide with the dots
  const currentSlide = (slidesNumber: number) => {
    showSlide((slideIndex = slidesNumber));
  };

  const showSlide = (slidesNumber: number) => {
    let index;
    const slides = document.getElementsByClassName(`pw-slide-${messageId}`);
    const dots = document.getElementsByClassName(`pw-dot-${messageId}`);

    if (slidesNumber > slides.length) {
      slideIndex = 1;
    }
    if (slidesNumber < 1) {
      slideIndex = slides.length;
    }
    if (slides && dots) {
      // hide all slides
      for (index = 0; index < slides.length; index++) {
        slides[index]?.classList.add('pw-hidden');
      }

      // remove active status from all dots
      for (index = 0; index < dots.length; index++) {
        dots[index]?.classList.remove('pw-bg-neutral-placeholder');
        dots[index]?.classList.add('pw-bg-neutral-divider');
      }

      // show the active slide
      slides[slideIndex - 1]?.classList.remove('pw-hidden');

      // highlight the active dot
      dots[slideIndex - 1]?.classList.remove('pw-bg-neutral-divider');
      dots[slideIndex - 1]?.classList.add('pw-bg-neutral-placeholder');
    }
  };

  return (
    <>
      {messageContent?.type === CardsAssistanceType.TEXT ? (
        <div className="pw-bg-neutral-divider pw-text-base pw-whitespace-pre-line pw-text-neutral-primary pw-rounded pw-py-3 pw-px-4 pw-border">
          {messageContent.content}
          <div>{reactionTag}</div>
        </div>
      ) : null}
      {messageContent?.type === CardsAssistanceType.CAROUSEL ? (
        <>
          <div
            onClick={handleAction}
            className="pw-relative pw-w-[280px] pw-mx-auto pw-rounded pw-border pw-border-neutral-divider pw-cursor-pointer pw-bg-neutral-divider"
          >
            {(messageContent?.data || []).map((item) => {
              return (
                <div className={`pw-slide-${messageId} pw-relative`}>
                  <img className="pw-w-full pw-h-[280px] pw-object-cover" src={item.image_url} />
                  <div className="pw-p-3">
                    <p className="pw-w-full pw-m-0 pw-text-sm pw-text-black pw-font-bold">{item.title}</p>
                    <p className="pw-w-full pw-m-0 pw-text-sm pw-text-black pw-font-normal">{item.description}</p>
                  </div>
                  {item.actions.length > 0 && (
                    <p className="pw-mx-3 pw-mb-3 pw-p-2 pw-text-center pw-text-sm pw-text-secondary-main-blue pw-font-bold pw-rounded pw-border pw-border-secondary-border pw-bg-neutral-white">
                      {item.actions[0].label}
                    </p>
                  )}
                </div>
              );
            })}
            {/* <!-- The previous button --> */}
            <span
              className="pw-absolute pw-left-0 pw-top-1/2 pw-p-4 -pw-translate-y-1/2 pw-bg-black/10 hover:pw-bg-black/30 pw-text-white pw-cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                moveSlide(-1);
              }}
            >
              <BsChevronLeft />
            </span>
            {/* <!-- The next button --> */}
            <span
              className="pw-absolute pw-right-0 pw-top-1/2 pw-p-4 -pw-translate-y-1/2 pw-bg-black/10 hover:pw-bg-black/30 pw-text-white pw-cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                moveSlide(1);
              }}
            >
              <BsChevronRight />
            </span>
            {reactionTag && <div className="pw-p-3 pw-pt-2">{reactionTag}</div>}
          </div>
          <br />
          {/* <!-- The dots --> */}
          <div className="pw-flex pw-justify-center pw-items-center pw-space-x-5">
            {(messageContent?.data || []).map((_, index) => {
              return (
                <div
                  className={`pw-dot-${messageId} pw-w-2 pw-h-2 pw-rounded-full pw-cursor-pointer`}
                  onClick={() => currentSlide(index + 1)}
                />
              );
            })}
          </div>
        </>
      ) : null}
    </>
  );
};

export default CardAssistanceMessage;
