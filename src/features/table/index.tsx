import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TableTabs from './components/TableTabs';
import TableStatus from './components/TableStatus';
import Tables from './components/Tables';
import { SelectedTableProvider } from './hooks/useSelectedTable';
import { SelectedOrderProvider } from '~app/features/pos/hooks/useSelectedOrder';
import { PosProvider } from '~app/features/pos/hooks/usePos';
import { Header } from '~app/features/pos/components';
import { useGetPosSetting } from '~app/services/queries';
import { CommingSoonModal, ConfirmModal } from '~app/components';
import EmptyState from '~app/components/EmptyState';
import { EmptyStateTable } from '~app/components/Icons';

const Table = () => {
  const { t } = useTranslation('table');
  const navigate = useNavigate();
  const { data: posSettings } = useGetPosSetting();
  const [openCommingSoon, setOpenCommingSoon] = useState(false);
  const fnb_active = posSettings?.fnb_active || false;

  return (
    <div className="pw-h-screen pw-overflow-hidden pw-flex pw-flex-col">
      <SelectedTableProvider>
        <PosProvider>
          <SelectedOrderProvider>
            <Header classNameNavbar="!-pw-mb-2" />
          </SelectedOrderProvider>
        </PosProvider>
        <div className="pw-grid pw-grid-cols-12 pw-border-b-gray-200 pw-border-b pw-border-solid">
          {!fnb_active ? (
            <div />
          ) : (
            <>
              <TableTabs className="2xl:pw-col-span-9 xl:pw-col-span-8 lg:pw-col-span-7 md:pw-col-span-6" />
              <TableStatus className="2xl:pw-col-span-3 xl:pw-col-span-4 lg:pw-col-span-5 md:pw-col-span-6" />
            </>
          )}
        </div>
        <div className="pw-ml-4 pw-my-4 pw-pr-4 pw-overflow-auto">
          {!fnb_active ? (
            <EmptyState
              icon={<EmptyStateTable />}
              description1={t('empty_state_1')}
              description2={t('empty_state_2') || ''}
              textBtn={t('create_table') || ''}
              className="pw-mt-6"
              onClick={() => setOpenCommingSoon(true)}
            />
          ) : (
            <Tables />
          )}
        </div>
      </SelectedTableProvider>
      {posSettings && !fnb_active && (
        <ConfirmModal
          open={true}
          title={t('open_fnb')}
          description={t('description_open_fnb')}
          onConfirm={() => navigate(-1)}
          onClose={() => navigate(-1)}
        />
      )}
      {openCommingSoon && <CommingSoonModal open={openCommingSoon} onClose={() => setOpenCommingSoon(false)} />}
    </div>
  );
};

export default Table;
