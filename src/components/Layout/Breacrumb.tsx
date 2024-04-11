import { Children, HTMLAttributes, useMemo, ElementType, ReactNode } from 'react';
import Breadcrumb from 'rsuite/Breadcrumb';
import AngleRightIcon from '@rsuite/icons/legacy/AngleRight';

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  component?: ElementType;
  separator?: string | ReactNode;
}

interface BreadcrumbsDefaultProps {
  component: ElementType;
}

const defaultProps: BreadcrumbsDefaultProps = {
  component: 'nav',
};

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const {
    component: Component,
    className,
    children,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const transformItems = (child: ReactNode) => {
    if (!child) return <></>;
    return <Breadcrumb.Item className="">{child}</Breadcrumb.Item>;
  };

  const contentOfItems = useMemo(() => Children.map(children, transformItems), [children, transformItems]);

  return (
    <Component {...rest} className={className}>
      <Breadcrumb separator={<AngleRightIcon />}>{contentOfItems}</Breadcrumb>
    </Component>
  );
};

export default Breadcrumbs;
