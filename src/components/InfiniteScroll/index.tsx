import { memo, ReactNode, useEffect, useRef } from 'react';

type Props = {
  next: (...args: ExpectedAny[]) => void;
  hasMore: boolean;
  children: ReactNode;
  className?: string;
};

const InfiniteScroll = ({ next, hasMore, children, className }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries?.[0]?.isIntersecting) next();
    });
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [hasMore]);

  return (
    <div className={className}>
      {children}
      {hasMore ? <div ref={ref} /> : null}
    </div>
  );
};

export default memo(InfiniteScroll);
