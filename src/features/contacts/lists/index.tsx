import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { BsTrash } from 'react-icons/bs';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { TableHeaderAction, ContactAnalytics } from './components';
import { initFilterValues, columnOptions, filterOptions, convertFilter } from './config';
import { Table, Filter, ConfirmModal } from '~app/components';
import { CONTACTS_KEY, CONTACT_ANALYTIC_KEY, useContactsQuery } from '~app/services/queries';
import { CustomerPermission, useHasPermissions } from '~app/utils/shield';
import { useDeleteContactMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals';
import { MainRouteKeys } from '~app/routes/enums';
import { ContactProvider } from '~app/features/contacts/hooks';
import { TabKeyType } from '~app/features/contacts/details/components/ContactTabs/utils';

const ContactsList = (): JSX.Element => {
  const { t } = useTranslation('contacts-table');
  const navigate = useNavigate();
  const location = useLocation();
  const canCreateCustomer = useHasPermissions([CustomerPermission.CUSTOMER_CUSTOMERLIST_CREATE]);
  const tableRef = useRef<ExpectedAny>();
  const [selected, setSelected] = useState<Contact | null>(null);
  const [filterValues, setFilterValues] = useState(initFilterValues);
  const { mutateAsync } = useDeleteContactMutation();

  const handleFilter = useCallback(
    (values: ExpectedAny) => {
      tableRef?.current?.setVariables(
        convertFilter({ ...filterValues, ...values, option_analytic: filterValues.primary.option_analytic }),
      );
      setFilterValues({ ...filterValues, ...values, option_analytic: filterValues.primary.option_analytic });
    },
    [filterValues],
  );

  const handleFilterOption = useCallback(
    (option_analytic: ExpectedAny) => {
      const variables = { ...filterValues, option_analytic };
      variables.primary.option_analytic = option_analytic;
      setFilterValues(variables);
      tableRef?.current?.setVariables(variables);
    },
    [filterValues],
  );

  const handleClick = (row: Contact, action: string) => {
    if (action === 'create_order') {
      navigate(MainRouteKeys.Pos, { state: { contactId: row.id } });
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
    }
    if (action === 'delete') setSelected(row);
  };

  const onRowClick = (rowData: Contact) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.ContactDetails,
        tab: TabKeyType.OVERVIEW,
        id: rowData.id,
      })}`,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (selected) {
        await mutateAsync(selected.id);
        queryClient.invalidateQueries([CONTACTS_KEY], { exact: false });
        queryClient.invalidateQueries([CONTACT_ANALYTIC_KEY], { exact: false });
        toast.success(t('success.delete'));
        setSelected(null);
      }
    } catch (error) {
      // TO DO
    }
  };

  return (
    <div>
      <ContactProvider>
        <Table<ExpectedAny, ExpectedAny>
          ref={tableRef}
          columnOptions={columnOptions({ onClick: handleClick })}
          subHeader={
            <ContactAnalytics filterValues={filterValues.primary.option_analytic} onChange={handleFilterOption} />
          }
          headerFilter={<Filter initValues={filterValues} onFilter={handleFilter} filterOptions={filterOptions()} />}
          headerButton={
            <TableHeaderAction
              filterValues={filterValues.primary.option_analytic}
              onChange={handleFilterOption}
              canCreateCustomer={canCreateCustomer}
            />
          }
          variables={{ ...initFilterValues.primary, ...initFilterValues.secondary }}
          query={useContactsQuery}
          onRowClick={onRowClick}
          dataKey="id"
          compact
        />
      </ContactProvider>
      {selected && (
        <ConfirmModal
          open={true}
          title={t('delete_contact')}
          description={t(
            selected.debt_amount ? 'delete_contact_transaction_description' : 'delete_contact_description',
          )}
          iconTitle={<BsTrash size={24} />}
          isDelete
          onConfirm={handleConfirmDelete}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};
export default ContactsList;
