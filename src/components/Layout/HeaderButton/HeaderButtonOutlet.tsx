import React from 'react';

export type HeaderButtonOutletProps = {
  id?: string;
};

const HeaderButtonOutlet: React.FunctionComponent<HeaderButtonOutletProps> = ({ id = 'default-header-button' }) => {
  return <div id={id} />;
};

export default HeaderButtonOutlet;
