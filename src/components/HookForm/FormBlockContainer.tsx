import { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

const FormBlockContainer = ({ className = '', children }: Props) => {
  return <div className={className}>{children}</div>;
};

export default FormBlockContainer;
