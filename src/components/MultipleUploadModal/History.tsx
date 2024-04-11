import { useTranslation } from 'react-i18next';
import UploadFile from './UploadFile';
import { EmptyStateUpload } from '~app/components/Icons';
import { EmptyState, Loading } from '~app/components';

type Props = {
  query: ExpectedAny;
  variables?: ExpectedAny;
  detailFailQuery?: ExpectedAny;
};

const History = ({ query, variables, detailFailQuery }: Props) => {
  const { t } = useTranslation('common');
  const { data, isLoading, isFetching } = query({
    page: 1,
    pageSize: 3,
    ...variables,
  });
  if (isLoading || isFetching) return <Loading backdrop />;
  return (
    <div>
      {!data || data?.length === 0 ? (
        <EmptyState icon={<EmptyStateUpload />} description1={t('not_upload_any_file')} hiddenButton />
      ) : (
        data.map((item: MassUpload) => {
          return <UploadFile file={item} detailFailQuery={detailFailQuery} />;
        })
      )}
    </div>
  );
};

export default History;
