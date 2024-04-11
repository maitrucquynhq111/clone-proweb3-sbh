import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { BsGlobe2, BsImages, BsTagsFill, BsTextLeft } from 'react-icons/bs';
import { ButtonTransparent } from '~app/components';
import { FrequentlyQuestionType } from '~app/features/chat-configs/FrequentlyQuestion/utils';

type Props = { questionType: string; onChange(value: FrequentlyQuestionType): void };

const DATA = [
  { type: FrequentlyQuestionType.Text, icon: <BsTextLeft size={24} className="pw-text-success-active" /> },
  { type: FrequentlyQuestionType.Image, icon: <BsImages size={24} className="pw-text-pink" /> },
  { type: FrequentlyQuestionType.Product, icon: <BsTagsFill size={24} className="pw-text-gold" /> },
  { type: FrequentlyQuestionType.Web, icon: <BsGlobe2 size={24} className="pw-text-blue-primary" /> },
];

const QuestionType = ({ questionType, onChange }: Props): JSX.Element => {
  const { t } = useTranslation('chat');

  return (
    <>
      <p className="pw-text-sm pw-font-bold pw-mb-3">{t('answer_after_press_button')}</p>
      <div className="pw-flex pw-gap-4 pw-mb-4">
        {DATA.map((option) => (
          <ButtonTransparent key={option.type} className="!pw-w-24" onClick={() => onChange(option.type)}>
            <div
              className={cx('pw-flex pw-flex-col pw-items-center pw-py-3 pw-bg-neutral-background', {
                'pw-bg-primary-background pw-border pw-border-primary-border pw-rounded-md':
                  option.type === questionType,
              })}
            >
              <div className="pw-mb-2">{option.icon}</div>
              <div
                className={cx('pw-font-bold pw-text-neutral-primary', {
                  'pw-text-primary-main': option.type === questionType,
                })}
              >
                {t(option.type)}
              </div>
            </div>
          </ButtonTransparent>
        ))}
      </div>
    </>
  );
};

export default QuestionType;
