import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContactDetailQuery } from '~app/services/queries';

function useContactDetails() {
  const [searchParams] = useSearchParams();
  const contact_id = searchParams.get('id') as string;
  const { data, isLoading } = useContactDetailQuery(contact_id, 'most_order_product|contact_tag');

  const contactDetail = useMemo(() => data, [contact_id, data]);

  return { data: contactDetail, isLoading };
}

export { useContactDetails };
