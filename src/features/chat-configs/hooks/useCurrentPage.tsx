import { useEffect, useMemo, useState } from 'react';
import { useGetCurrentLinkPage } from '~app/services/queries';

function useCurrentPage() {
  const { data, isError } = useGetCurrentLinkPage({});
  const [activePage, setActivePage] = useState<Page | null>(null);
  const [firstActivePage, setFirstActivePage] = useState<Page | null>(null);

  const linkedPages = useMemo(() => {
    return (data?.pages || []).filter((item: ExpectedAny) => item.active);
  }, [data]);
  const unlinkedPage = useMemo(() => {
    return (data?.pages || []).filter((item: ExpectedAny) => !item.active);
  }, [data]);
  const isConnectedFB = useMemo(() => {
    return !!data && !isError;
  }, [data, isError]);
  const isEmpty = useMemo(() => {
    return !isConnectedFB || linkedPages.length === 0;
  }, [isConnectedFB, linkedPages]);

  useEffect(() => {
    if (!linkedPages) return;
    if (!linkedPages?.[0]) return;
    if (firstActivePage?.business_id === linkedPages?.[0]?.business_id) return;
    setFirstActivePage(linkedPages[0]);
  }, [linkedPages, firstActivePage]);

  useEffect(() => {
    setActivePage(firstActivePage);
  }, [firstActivePage]);

  return { data, linkedPages, unlinkedPage, isConnectedFB, isEmpty, activePage, setActivePage };
}

export { useCurrentPage };
