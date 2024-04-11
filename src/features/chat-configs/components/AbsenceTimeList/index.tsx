import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import { BsPlusCircleFill } from 'react-icons/bs';
import { ScheduleItem } from './components';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { defaultAbsenceMessage } from '~app/features/chat-configs/AbsenceMessage/config';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  dataForm: ReturnType<typeof defaultAbsenceMessage>;
  detail?: PendingTimeSelected | null;
  onChange(name: string, value: ExpectedAny): void;
};

type Props = {
  dataForm: ReturnType<typeof defaultAbsenceMessage>;
  onChange(name: string, value: ExpectedAny): void;
};

const AbsenceTimeList = ({ dataForm, onChange }: Props) => {
  const { t } = useTranslation('chat');
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const handleClick = (scheduleDetail?: PendingTimeSelected) => {
    setModalData({
      modal: ModalTypes.AbsenceTimeSelectDetails,
      placement: ModalPlacement.Right,
      size: ModalSize.Xsmall,
      dataForm,
      detail: scheduleDetail || null,
      onChange,
    });
  };

  return (
    <div>
      <div className="pw-flex pw-items-center pw-justify-between pw-mt-6 pw-mb-3">
        <p className="pw-font-bold pw-text-sm">{t('absence_weekly')}</p>
        {dataForm.absent_schedule.length > 0 && (
          <Button
            appearance="subtle"
            className="!pw-text-blue-primary !pw-font-bold"
            startIcon={<BsPlusCircleFill size={24} />}
            onClick={() => handleClick()}
          >
            {t('action.add_absence')}
          </Button>
        )}
      </div>
      {dataForm.absent_schedule.length === 0 ? (
        <div className="pw-flex pw-flex-col pw-justify-center pw-items-center">
          <p className="pw-text-neutral-placeholder pw-mb-2">{t('absence_description')}</p>
          <Button
            appearance="primary"
            size="md"
            className="!pw-bg-blue-primary !pw-font-bold"
            onClick={() => handleClick()}
          >
            {t('action.add_absence')}
          </Button>
        </div>
      ) : (
        <div className="pw-grid pw-grid-cols-3 pw-gap-4 pw-max-h-44 pw-overflow-y-auto">
          {dataForm.absent_schedule.map((schedule) => (
            <ScheduleItem key={schedule.id} schedule={schedule} onClick={() => handleClick(schedule)} />
          ))}
        </div>
      )}
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </div>
  );
};

export default AbsenceTimeList;
