import React from 'react';

export type ResultOutletProps = {
  id?: string;
};

const ResultOutlet: React.FunctionComponent<ResultOutletProps> = ({ id = 'result-filter' }) => {
  return <div id={id} />;
};

export default ResultOutlet;
