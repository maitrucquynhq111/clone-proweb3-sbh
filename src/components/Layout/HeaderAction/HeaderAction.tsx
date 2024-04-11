import React, { useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

type HeaderActionProps = {
  headerActionOutletId?: string;
  link?: string;
  children: React.ReactNode;
};

const HeaderAction = ({ headerActionOutletId = 'default-header-action', children }: HeaderActionProps): JSX.Element => {
  const [headerActionOutlet, setHeaderButtonOutlet] = useState<HTMLElement>();

  useLayoutEffect(() => {
    const outletElement = document.getElementById(headerActionOutletId) as HTMLElement;
    if (outletElement) {
      setHeaderButtonOutlet(outletElement);
    }
  }, [headerActionOutletId]);

  if (!headerActionOutlet) {
    return <></>;
  }

  return createPortal(<div>{children}</div>, headerActionOutlet);
};

export default HeaderAction;
