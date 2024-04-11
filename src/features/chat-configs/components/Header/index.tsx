import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pagination } from 'rsuite';
import { PageTabs } from '~app/features/chat-configs/components';

type Props = {
  title?: string;
  linkedPages: Page[];
  activePage: Page | null;
  onClick: (value: Page) => void;
};

const FBPAGE_PER_PAGE = 3;

const Header = ({ title = 'title.fb_apply_page', linkedPages, activePage, onClick }: Props) => {
  const { t } = useTranslation('chat');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalItems = linkedPages?.length || 0;
  const showPagination = totalItems > 0;

  const dataTable = linkedPages.filter((v, i) => {
    const start = FBPAGE_PER_PAGE * (currentPage - 1);
    const end = start + FBPAGE_PER_PAGE;
    return i >= start && i < end;
  });

  useEffect(() => {
    dataTable?.[0] && onClick(dataTable[0]);
  }, [currentPage]);

  return (
    <div className="pw-border pw-border-b-0 pw-rounded pw-rounded-b-none pw-border-neutral-divider pw-bg-neutral-background pw-pt-4 pw-px-6">
      <div className="pw-flex pw-items-centetr pw-justify-between pw-mb-4">
        <div className="pw-text-base pw-font-bold">{t(title)}</div>
        {showPagination && (
          <Pagination
            total={linkedPages?.length}
            limit={FBPAGE_PER_PAGE}
            onChangePage={setCurrentPage}
            activePage={currentPage}
          />
        )}
      </div>
      <PageTabs linkedPages={dataTable} activePage={activePage} onClick={onClick} />
    </div>
  );
};

export default memo(Header);
