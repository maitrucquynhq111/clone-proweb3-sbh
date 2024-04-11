import React from 'react';

export type HeaderActionOutletProps = {
  id?: string;
};

const HeaderActionOutlet: React.FunctionComponent<HeaderActionOutletProps> = ({ id = 'default-header-action' }) => {
  return <div id={id} />;
};

export default HeaderActionOutlet;
