import React, { useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

type ResultProps = {
  resultOutletId?: string;
  children: React.ReactNode;
};

const Result = ({ resultOutletId = 'result-filter', children }: ResultProps): JSX.Element => {
  const [resultOutlet, setResultOutlet] = useState<HTMLElement>();

  useLayoutEffect(() => {
    const outletElement = document.getElementById(resultOutletId) as HTMLElement;
    if (outletElement) {
      setResultOutlet(outletElement);
    }
  }, [resultOutletId]);

  if (!resultOutlet) {
    return <></>;
  }

  return createPortal(<div className="pw-grid-cols-2 pw-space-x-1">{children}</div>, resultOutlet);
};

export default Result;
