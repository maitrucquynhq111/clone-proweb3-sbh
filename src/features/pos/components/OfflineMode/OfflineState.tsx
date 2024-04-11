import { BsWifiOff, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const OfflineState = () => {
  const { t } = useTranslation('pos');
  const [toggle, setToggle] = useState<boolean>(false);
  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className="pw-px-4 pw-shadow pw-py-2 pw-bg-error-background">
      <div className="pw-flex pw-text-sm pw-items-center pw-text-red5 pw-justify-between">
        <div className="pw-flex pw-text-base pw-items-center pw-gap-2">
          <BsWifiOff size={22} /> <span>{t('offline-mode.offline.title')}</span>
        </div>
        <span onClick={handleToggle} className="pw-p-1 pw-cursor-pointer">
          {toggle ? <BsChevronUp /> : <BsChevronDown />}
        </span>
      </div>
      {toggle && (
        <div className="pw-px-5 pw-text-sm pw-pt-2">
          <ul className="pw-list-disc pw-text-neutral-600">
            <li>{t('offline-mode.offline.description')}</li>
            <li>{t('offline-mode.offline.notice')}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default OfflineState;
