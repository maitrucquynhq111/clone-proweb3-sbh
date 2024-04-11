import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import { DrawerBody, DrawerFooter, DrawerHeader } from '~app/components';

type Props = { detail: ExpectedAny; onClose: () => void };

const ChatbotPreview = ({ detail, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('chat');
  console.log(detail);
  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={t(detail.value)} onClose={onClose} />
      <DrawerBody className="pw-bg-white">Preview</DrawerBody>
      <DrawerFooter className="!pw-border-none !pw-shadow-revert">
        <Button type="submit" className="pw-button-primary !pw-py-3 !pw-px-6">
          <span className="pw-text-base pw-font-bold pw-text-neutral-white">{t('action.use')}</span>
        </Button>
      </DrawerFooter>
    </div>
  );
};

export default ChatbotPreview;
