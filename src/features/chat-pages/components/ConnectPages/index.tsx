import React from 'react';
import Header from './Header';
import NotConnectPage from './NotConnectPage';
import ConnectedPage from './ConnectedPage';

type Props = {
  refetch: () => void;
  isLoading: boolean;
  handleShowInital: () => void;
  providers: LinkPage[];
  canEdit: boolean;
};

const ConnectPages = ({ refetch, isLoading, handleShowInital, providers, canEdit }: Props) => {
  const [activeChannel, setActiveChannel] = React.useState<string>('all');

  const allPages = providers
    .filter((item) => (activeChannel === 'all' ? true : item.provider === activeChannel))
    .map((item) => item.pages);

  const allPagesFlatten = allPages.flat();

  const linkedPages = allPagesFlatten.filter((item) => item.active);
  const unlinkedPage = allPagesFlatten.filter((item) => !item.active);

  return (
    <>
      <Header activeTab={activeChannel} onSetActiveChannel={setActiveChannel} onAddMoreConnectPage={handleShowInital} />
      <div className="pw-grid pw-grid-cols-12 pw-gap-6">
        <NotConnectPage
          refetch={refetch}
          linkedPages={linkedPages}
          data={unlinkedPage}
          loading={isLoading}
          canEdit={canEdit}
          activeChannel={activeChannel}
          onShowInital={handleShowInital}
          className="pw-col-span-4"
        />
        <ConnectedPage
          refetch={refetch}
          data={linkedPages}
          loading={isLoading}
          canEdit={canEdit}
          className="pw-col-span-8"
        />
      </div>
    </>
  );
};

export default ConnectPages;
