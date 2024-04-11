import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import cx from 'classnames';
import { useNavigate } from 'react-router-dom';
import { BsChevronDown } from 'react-icons/bs';
import { Avatar, AvatarGroup, Button, Popover, Whisper } from 'rsuite';
import PageItem from './PageItem';
import { PlaceholderImage } from '~app/components';
import { removeItemString } from '~app/utils/helpers/arrayHelpers';
import { MainRouteKeys } from '~app/routes/enums';

const PageSelect = ({ onChange, data }: { onChange: (value: string[]) => void; data: ExpectedAny }): JSX.Element => {
  const { t } = useTranslation('chat');
  const navigate = useNavigate();
  const allPageIds = data.map((item: ExpectedAny) => item.page_id);
  const [listPageId, setListPageId] = useState<string[]>(allPageIds);
  const [listPageSelected, setListPageSelected] = useState<ExpectedAny[]>(data);
  const linkedPages = data?.filter((item: ExpectedAny) => item.active);

  const handleSubmit = () => {
    const values = data.filter((page: ExpectedAny) => listPageId.includes(page.page_id));
    setListPageSelected(values?.length === 0 ? data : values);
    onChange(listPageId);
  };

  const onSelected = ({ id, value }: { id: string; value: boolean }) => {
    if (value) {
      setListPageId((prevState: ExpectedAny) => [...prevState, id]);
    } else {
      setListPageId(removeItemString([...listPageId], id));
    }
  };

  const handleTogoPageManagement = () => {
    navigate(MainRouteKeys.ChatConfigsPages);
  };

  return (
    <>
      <Whisper
        placement="bottomStart"
        trigger="click"
        speaker={({ onClose, left, top, className }, ref) => {
          return (
            <Popover
              ref={ref}
              className={cx('!pw-rounded-none pw-w-xs', className)}
              style={{ left, top }}
              arrow={false}
              full
            >
              <div>
                <div className="pw-overflow-y-auto pw-overflow-x-hidden pw-max-h-68">
                  {linkedPages.map((page: ExpectedAny) => {
                    return <PageItem pageInfo={page} onSelected={onSelected} listPageId={listPageId} />;
                  })}
                </div>
                <div className="pw-grid pw-grid-cols-2 pw-p-2 pw-bg-white pw-gap-2 pw-shadow-revert">
                  <div className="pw-col-span-1">
                    <Button
                      className="pw-button-secondary !pw-font-bold pw-w-full"
                      block
                      onClick={handleTogoPageManagement}
                    >
                      <span className="pw-font-bold pw-text-neutral-primary">{t('action.goto_page_management')}</span>
                    </Button>
                  </div>
                  <div className="pw-col-span-1">
                    <Button
                      appearance="primary"
                      className="!pw-font-bold pw-w-full"
                      block
                      onClick={() => {
                        handleSubmit();
                        onClose();
                      }}
                    >
                      {t('action.confirm')}
                    </Button>
                  </div>
                </div>
              </div>
            </Popover>
          );
        }}
      >
        <div className="pw-flex pw-items-center pw-justify-between pw-border pw-rounded pw-border-neutral-border pw-pl-4 pw-cursor-pointer pw-w-68">
          <div className="pw-flex pw-items-center pw-my-1.5">
            <AvatarGroup stack>
              {listPageSelected.slice(0, 2).map((page: ExpectedAny) => {
                return (
                  <PlaceholderImage
                    className="!pw-w-6 !pw-h-6 pw-bg-white pw-rounded-full"
                    isAvatar={true}
                    src={page.page_avatar || ''}
                    alt={page.page_name}
                  />
                );
              })}
              {listPageSelected.length > 2 && (
                <Avatar
                  circle
                  className="!pw-w-6 !pw-h-6 !pw-bg-blue-primary !pw-text-xs pw-font-semibold pw-rounded-full"
                >
                  {listPageSelected.length - 2}
                </Avatar>
              )}
            </AvatarGroup>
            <div className="!pw-text-sm !pw-font-bold pw-ml-2.5">
              <Trans
                i18nKey="chat:action.selected_page"
                values={{ number: listPageSelected?.length, totalPages: linkedPages?.length }}
              />
            </div>
          </div>
          <div className="pw-bg-neutral-background pw-rounded-r pw-p-2">
            <BsChevronDown size={20} />
          </div>
        </div>
      </Whisper>
    </>
  );
};

export default PageSelect;
