import { useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import PlusIcon from '@rsuite/icons/Plus';
import { BsEnvelope } from 'react-icons/bs';
import { Tooltip, Whisper, Button } from 'rsuite';
import PageSelect from '../PageSelect';
import { filterOptions, formatFilterValues, getSecondaryFilterValues, initFilterValues } from './config';
import { FilterResult } from './components';
import { MainRouteKeys } from '~app/routes/enums';
import { HeaderAction, Filter } from '~app/components';
import { useChatStore } from '~app/features/chat-inbox/hooks';
import { ChatStatus } from '~app/utils/constants';
import { useGetAllCurrentLinkPage } from '~app/services/queries';

const ConversationFilter = () => {
  const { data, isLoading, isError } = useGetAllCurrentLinkPage();
  const { t } = useTranslation('chat');
  const [filter, setFilter] = useChatStore((store) => store.filter);
  const [, setPageIds] = useChatStore((store) => store.pageIds);
  const initValues = useMemo(() => formatFilterValues(initFilterValues), [initFilterValues]);
  const isUnread = useMemo(() => filter.status === ChatStatus.UNREAD, [filter.status]);

  const allPages = (data || []).map((item) => item.pages);

  const allPagesFlatten = allPages.flat();

  const linkedPages = (allPagesFlatten || []).filter((item: ExpectedAny) => item.active);

  const handleFilter = (values: ExpectedAny) => {
    setFilter((prevState) => ({ ...prevState, filter: values }));
  };

  // useEffect(() => {
  //   if (!isLoading) {
  //     const linkedPages = data?.data?.pages.filter((item: ExpectedAny) => item.active);
  //     setPageIds((prevState) => ({
  //       ...prevState,
  //       pageIds: linkedPages.map((item: ExpectedAny) => item.page_id),
  //     }));
  //   }
  // }, [isLoading]);

  useEffect(() => {
    return () => {
      setPageIds((prevState) => ({
        ...prevState,
        pageIds: [],
      }));
    };
  }, []);

  const isDirty =
    JSON.stringify(formatFilterValues(initFilterValues)) !== JSON.stringify(getSecondaryFilterValues(filter));

  return (
    <div className="pw-px-5">
      {linkedPages?.length > 0 && !isLoading && !isError && (
        <HeaderAction>
          <PageSelect
            data={linkedPages || []}
            onChange={(value) =>
              setPageIds((prevState) => ({
                ...prevState,
                pageIds: value,
              }))
            }
          />
        </HeaderAction>
      )}
      {linkedPages?.length === 0 && (
        <HeaderAction>
          <NavLink to={MainRouteKeys.ChatConfigsPages}>
            <Button
              appearance="ghost"
              startIcon={<PlusIcon className="pw-text-secondary-main-blue" />}
              className="!pw-font-bold !pw-py-2 !pw-border !pw-border-secondary-border !pw-border-solid !pw-text-secondary-main-blue"
            >
              {t('multi_chat_connection')}
            </Button>
          </NavLink>
        </HeaderAction>
      )}
      <div className="pw-flex pw-items-center pw-gap-6 pw-pt-3">
        <div className="pw-w-[182px]">
          {/* <DebouncedInput
            value={filter.name}
            icon="search"
            onChange={(value) =>
              setFilter((prevState) => ({ ...prevState, filter: { ...prevState.filter, name: value } }))
            }
            placeholder={t('placeholder.contact') || ''}
          /> */}
        </div>
        <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip>{t('unread')}</Tooltip>}>
          <div
            className={cx('pw-cursor-pointer', {
              'pw-text-blue-primary': isUnread,
            })}
            onClick={() =>
              setFilter((prevState) => ({
                ...prevState,
                filter: {
                  ...prevState.filter,
                  status: isUnread ? ChatStatus.ALL : ChatStatus.UNREAD,
                },
              }))
            }
          >
            <BsEnvelope size={24} />
          </div>
        </Whisper>
        <Filter
          initValues={initFilterValues}
          currentFilter={getSecondaryFilterValues(filter)}
          showFilterData={false}
          onFilter={handleFilter}
          filterOptions={filterOptions()}
        />
      </div>
      {isDirty && <FilterResult initValues={initValues} />}
    </div>
  );
};

export default ConversationFilter;
