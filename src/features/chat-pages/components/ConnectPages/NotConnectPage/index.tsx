import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { Button, CheckboxGroup } from 'rsuite';
import { useState, useCallback } from 'react';
import { ValueType } from 'rsuite/esm/Checkbox';
import Loading from '../../Loading';
import FacebookBtn from '../../ChatConnect/FacebookBtn';
import ZaloBtn from '../../ChatConnect/ZaloBtn';
import NotConnectItem from './NotConnectItem';
import { EmptyState, UpgradePackageModal } from '~app/components';
import { EmptyStateProduct } from '~app/components/Icons';
import { useActiveMultipleFBPageMutation } from '~app/services/mutations';
import { usePackage } from '~app/utils/shield/usePackage';
import { PackageKey } from '~app/utils/constants';
import { validateCanAccess } from '~app/features/chat-pages/utils';

type Props = {
  className?: string;
  loading?: boolean;
  data: ExpectedAny;
  linkedPages: ExpectedAny;
  canEdit: boolean;
  refetch?: () => void;
  activeChannel?: string;
  onShowInital?: () => void;
};

const NotConnectPage = ({
  className,
  loading,
  refetch,
  data,
  linkedPages,
  canEdit,
  activeChannel,
  onShowInital,
}: Props) => {
  const { t } = useTranslation('chat');
  const [value, setValue] = useState<ValueType[]>([]);
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const { mutateAsync, isLoading } = useActiveMultipleFBPageMutation();
  const { currentPackage, description } = usePackage(
    [PackageKey.PLUS, PackageKey.PLUS_ADVANCE, PackageKey.PRO],
    'customer_connect_fanpage',
  );
  const disabled = value.length === 0 || isLoading;

  const handleChange = (value: ValueType[]) => {
    setValue(value);
  };
  const disableLinkPage = linkedPages.length + value.length >= 999;

  const handleLinkPage = useCallback(async () => {
    if (!disabled || !disableLinkPage) {
      const canAccess = validateCanAccess({ linkedPages, currentPackage });
      if (!canAccess) return setOpenUpgrade(true);
      await mutateAsync(value as ExpectedAny);
      refetch?.();
      setValue([]);
    }
  }, [value, disableLinkPage]);

  return (
    <div className={cx('pw-border-neutral-divider pw-rounded pw-border pw-h-fit', className)}>
      <div className="pw-bg-neutral-background pw-py-2 pw-px-4 pw-text-sm pw-font-bold">
        {t('page_not_connect')} ({data?.length || 0})
      </div>
      <div className="pw-h-96 pw-relative pw-overflow-hidden">
        {loading ? (
          <Loading />
        ) : data?.length > 0 ? (
          <>
            <div
              className={cx('pw-overflow-auto pw-h-[calc(100%-76px)]', {
                '!pw-h-full': !canEdit,
              })}
            >
              <CheckboxGroup name="checkboxList" value={value} onChange={handleChange}>
                {data.map((item: ExpectedAny) => {
                  return (
                    <NotConnectItem
                      key={item.id}
                      selected={value}
                      disableLink={disableLinkPage}
                      disabled={isLoading}
                      data={item}
                    />
                  );
                })}
              </CheckboxGroup>
            </div>
            {canEdit && (
              <div className="!pw-absolute pw-w-full pw-bottom-0 pw-p-4 pw-bg-white">
                <Button
                  disabled={disabled}
                  className="pw-w-full !pw-font-bold !pw-py-3"
                  appearance="primary"
                  onClick={handleLinkPage}
                >
                  {t('action.connect_page')}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div>
            <EmptyState
              className="pw-mt-3"
              icon={<EmptyStateProduct size="80" />}
              description1={t('empty_page')}
              hiddenButton
            />
            <div className="pw-px-4">
              {activeChannel === 'meta' ? (
                <FacebookBtn isCommingSoon={false} isReady={false} block={true} linkedPages={linkedPages} />
              ) : activeChannel === 'zalo' ? (
                <ZaloBtn isCommingSoon={false} isReady={false} block={true} />
              ) : (
                <Button
                  appearance="primary"
                  onClick={onShowInital}
                  size="md"
                  color="green"
                  className="!pw-font-bold"
                  block
                  startIcon={<></>}
                >
                  {t('action.connect_page')}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      {openUpgrade && (
        <UpgradePackageModal
          description={description}
          onConfirm={() => setOpenUpgrade(false)}
          onClose={() => setOpenUpgrade(false)}
        />
      )}
    </div>
  );
};

export default NotConnectPage;
