import { toast } from 'react-toastify';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useFormContext, useWatch } from 'react-hook-form';
import { Pagination } from 'rsuite';
import { columnsConfig } from './config';
import { OrderPermission, OtherPermision, useHasPermissions } from '~app/utils/shield';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals';
import { StaticTable } from '~app/components';
import { PageSizeDropdown } from '~app/components/Table/components';
import { MainRouteKeys } from '~app/routes/enums';
import { queryClient } from '~app/configs/client';
import { useDeleteContactMutation } from '~app/services/mutations';
import { useContactsQuery } from '~app/services/queries';

const ContactTable = () => {
  const { t } = useTranslation('contacts-table');
  const location = useLocation();
  const navigate = useNavigate();
  const { control } = useFormContext<PendingContactGroupSetting>();
  const { mutateAsync } = useDeleteContactMutation();

  const canCreateOrder = useHasPermissions([OrderPermission.ORDER_CART_CREATE]);
  const canDeleteContact = useHasPermissions([OtherPermision.CUSTOMER_CUSTOMERDETAIL_DELETE]);
  const canViewOrder = useHasPermissions([OrderPermission.ORDER_ORDERLIST_VIEW]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const id = useWatch({
    control,
    name: 'id',
    defaultValue: '',
  });

  const { data, isFetching, queryKey } = useContactsQuery({
    page,
    pageSize: limit,
    has_analytic: true,
    contact_group_ids: [id],
  });

  const handleOpenOrderDetail = useCallback((data: Contact) => {
    if (!canViewOrder) return;
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.OrderDetails,
        id: data.last_order?.order_number || '',
      })}`,
    });
  }, []);

  const handleDeleteContact = useCallback(
    async (row: Contact) => {
      try {
        await mutateAsync(row.id);
        queryClient.invalidateQueries(queryKey, { exact: true });
        toast.success(t('success.delete'));
      } catch (error) {
        // TO DO
      }
    },
    [id],
  );

  const handleChangeLimit = (limitSize: number) => {
    setPage(1);
    setLimit(limitSize);
  };

  const handleClick = useCallback(
    (row: Contact, action: string) => {
      if (action === 'create_order') {
        navigate(MainRouteKeys.Pos, { state: { contactId: row.id } });
        return;
      }
      if (action === 'edit') {
        navigate({
          pathname: location.pathname,
          search: `?${createSearchParams({
            modal: ModalTypes.ContactUpdate,
            placement: ModalPlacement.Right,
            size: ModalSize.Small,
            id: row.id,
          })}`,
        });
        return;
      }
      if (action === 'delete') return handleDeleteContact(row);
    },
    [handleDeleteContact],
  );

  const columns = useMemo(() => {
    return columnsConfig({
      canCreateOrder,
      canDeleteContact,
      onClick: handleClick,
      onOpenOrderDetail: handleOpenOrderDetail,
    });
  }, [handleOpenOrderDetail, handleClick]);

  console.log(data?.meta.total_pages);
  return (
    <>
      <StaticTable columnConfig={columns} data={data?.data || []} rowKey="id" loading={isFetching} />
      <div className="pw-flex pw-py-4 pw-justify-between pw-items-center">
        <PageSizeDropdown value={limit} onChange={(value: number | null) => handleChangeLimit(value || 10)} />
        <Pagination
          total={data?.meta.total_rows || 0}
          limit={limit}
          onChangePage={setPage}
          activePage={page}
          prev
          next
          first
          last
          ellipsis
          maxButtons={5}
          layout={['-', 'pager']}
        />
      </div>
    </>
  );
};

export default ContactTable;
