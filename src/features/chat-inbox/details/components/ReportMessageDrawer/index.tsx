import { useTranslation } from 'react-i18next';
import { MdChevronRight } from 'react-icons/md';
import { DrawerBody, DrawerHeader, Message } from '~app/components';

type Props = {
  onClick?(): void;
  onClose(): void;
};

const DATA = [
  'report_message.content_not_suitable',
  'report_message.illegal_sales',
  'report_message.harass',
  'report_message.scam',
  'report_message.other',
];

const ReportMessageDrawer = ({ onClick, onClose }: Props) => {
  const { t } = useTranslation('chat');

  return (
    <>
      <DrawerHeader title={t('modal.report_message')} onClose={onClose} />
      <DrawerBody className="pw-bg-white !pw-p-0">
        <Message type="warning">
          <div className="pw-text-base">{t('select_one_of_problem')}</div>
        </Message>
        {DATA.map((option) => (
          <div
            key={option}
            className="pw-flex pw-items-center pw-justify-between pw-border-b pw-border-neutral-divider pw-p-4"
            onClick={onClick}
          >
            <span className="pw-text-base">{t(option)}</span>
            <MdChevronRight size={24} />
          </div>
        ))}
      </DrawerBody>
    </>
  );
};

export default ReportMessageDrawer;
