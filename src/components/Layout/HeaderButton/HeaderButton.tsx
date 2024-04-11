import React, { useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

type HeaderButtonProps = {
  headerButtonOutletId?: string;
  link?: string;
  children: React.ReactNode;
};

const HeaderButton = ({ headerButtonOutletId = 'default-header-button', children }: HeaderButtonProps): JSX.Element => {
  const [headerButtonOutlet, setHeaderButtonOutlet] = useState<HTMLOListElement>();

  useLayoutEffect(() => {
    const outletElement = document.getElementById(headerButtonOutletId) as HTMLOListElement;
    if (outletElement) {
      setHeaderButtonOutlet(outletElement);
    }
  }, [headerButtonOutletId]);

  if (!headerButtonOutlet) {
    return <></>;
  }

  return createPortal(<div className="pw-grid-cols-2 pw-space-x-1">{children}</div>, headerButtonOutlet);
};

export default HeaderButton;
