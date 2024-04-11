import PageTabItem from './PageTabItem';

type Props = {
  linkedPages: Page[];
  activePage: Page | null;
  onClick: (value: Page) => void;
};

const PageTabs = ({ linkedPages, activePage, onClick }: Props) => {
  return (
    <div className="pw-grid sm:pw-grid-cols-1 lg:pw-grid-cols-2 xl:pw-grid-cols-3 2xl:pw-grid-cols-4 pw-gap-4">
      {linkedPages.map((page) => (
        <PageTabItem key={page?.page_id || ''} page={page} activePage={activePage} onClick={onClick} />
      ))}
    </div>
  );
};

export default PageTabs;
