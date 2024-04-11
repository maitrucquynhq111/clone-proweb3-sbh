import { memo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { BsCaretDownFill, BsCaretUpFill } from 'react-icons/bs';

const NavigationIcon = memo(() => {
  return (
    <div className="pw-inline-flex pw-gap-x-2">
      <BsCaretDownFill size={20} className="pw-fill-brown" />
      <BsCaretUpFill size={20} className="pw-fill-brown" />
    </div>
  );
});

const QuickMessageInstruction = () => {
  const { t } = useTranslation('chat');
  return (
    <div className="pw-py-3 pw-px-4 pw-bg-neutral-white pw-inline-flex pw-gap-x-2 pw-flex-wrap pw-text-brown pw-w-full">
      <Trans
        t={t}
        i18nKey="instruction.using_navigation_key"
        components={{
          icon: <NavigationIcon />,
          strong: <strong />,
        }}
      />
    </div>
  );
};

export default memo(QuickMessageInstruction);
