import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import { Button } from 'rsuite';
import { useState } from 'react';
import Loading from '../../Loading';
import ConnectedItem from './ConnectedItem';
import { ConfirmModal, EmptyState } from '~app/components';
import { EmptyStateProduct } from '~app/components/Icons';
import { useDeactiveFBPageMutation } from '~app/services/mutations';
import { MainRouteKeys } from '~app/routes/enums';

type Props = {
  className?: string;
  loading?: boolean;
  data: ExpectedAny;
  canEdit: boolean;
  refetch?: () => void;
};

const ConnectedPage = ({ className, loading, refetch, data, canEdit }: Props) => {
  const { t } = useTranslation('chat');
  const { mutateAsync, isLoading } = useDeactiveFBPageMutation();

  const [selected, setSelected] = useState<ExpectedAny>(null);
  const [openDisconnect, setOpenDisconnect] = useState(false);

  const disabled = !selected || isLoading;

  const handleUnlinkPage = async () => {
    if (!disabled) {
      await mutateAsync(selected.id as ExpectedAny);
      refetch?.();
      setSelected(null);
      setOpenDisconnect(false);
    }
  };

  return (
    <div className={cx(className)}>
      <div className="pw-border-neutral-divider pw-rounded pw-border">
        <div className="pw-bg-neutral-background pw-py-2 pw-px-4 pw-text-sm pw-font-bold">
          {t('page_connected')} ({data?.length || 0})
        </div>
        <div className="pw-h-96 pw-relative pw-overflow-hidden">
          {loading ? (
            <Loading />
          ) : data?.length > 0 ? (
            <div
              className={cx('pw-h-[calc(100%-78px)] pw-border-b', {
                '!pw-h-full pw-border-none': !canEdit,
              })}
            >
              <div className="pw-grid sm:pw-grid-cols-1 lg:pw-grid-cols-2 xl:pw-grid-cols-3 2xl:pw-grid-cols-4 pw-gap-4 pw-overflow-auto pw-p-4">
                {data.map((item: ExpectedAny) => {
                  return (
                    <ConnectedItem
                      key={item.id}
                      disabled={isLoading}
                      selected={selected}
                      onSelect={setSelected}
                      data={item}
                    />
                  );
                })}
              </div>
              {canEdit && (
                <div className="pw-flex !pw-absolute pw-w-full pw-justify-end pw-bottom-0 pw-py-4 pw-pr-6">
                  <Button
                    className="!pw-font-bold !pw-border-neutral-border !pw-text-neutral-primary !pw-py-3 pw-mr-4"
                    appearance="ghost"
                    disabled={disabled}
                    onClick={() => !disabled && setOpenDisconnect(true)}
                  >
                    {t('action.disconnect')}
                  </Button>
                  <NavLink to={MainRouteKeys.ChatInbox}>
                    <Button disabled={disabled} className="!pw-font-bold !pw-py-3" appearance="primary">
                      {t('action.visit_page')}
                    </Button>
                  </NavLink>
                </div>
              )}
            </div>
          ) : (
            <EmptyState className="pw-mt-3" icon={<EmptyStateProduct />} description1={t('empty_page')} hiddenButton />
          )}
        </div>
      </div>
      {openDisconnect && !disabled && (
        <ConfirmModal
          open={true}
          title={t('modal.disconnect_title')}
          description={`${t('modal.disconnect_description')} Trang ${selected.page_name} ?`}
          cancelText={t('common:back') || ''}
          confirmText={t('action.disconnect') || ''}
          onConfirm={handleUnlinkPage}
          onClose={() => setOpenDisconnect(false)}
        />
      )}
    </div>
  );
};

export default ConnectedPage;
