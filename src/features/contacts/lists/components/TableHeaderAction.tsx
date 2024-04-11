import { useState, memo, useRef } from 'react';
import { IconButton, Button, Whisper, Popover, Dropdown, ButtonGroup } from 'rsuite';
import { OverlayTriggerHandle } from 'rsuite/esm/Overlay/OverlayTrigger';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { BsPlusLg, BsUpload } from 'react-icons/bs';
import { MdExpandMore } from 'react-icons/md';
import AnalyticOptionSelect from './AnalyticOptionSelect';
import { MultipleUploadModal } from '~app/components';
import { ModalTypes, ModalPlacement, ModalSize } from '~app/modals/types';
import { MASS_UPLOAD_CONTACT_FILE } from '~app/configs';
import {
  CONTACTS_KEY,
  useGetContactMassUploadFailedDetailsQuery,
  useGetMassUploadContactFileQuery,
} from '~app/services/queries';
import { useUploadContactsFileMutation } from '~app/services/mutations';

type Props = {
  filterValues: string;
  onChange(value: ExpectedAny): void;
  canCreateCustomer: boolean;
};

const TableHeaderAction = ({ filterValues, onChange, canCreateCustomer }: Props) => {
  const { t } = useTranslation('header-button');
  const whisperRef = useRef<OverlayTriggerHandle>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = () => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.ContactCreate,
        placement: ModalPlacement.Right,
        size: ModalSize.Small,
      })}`,
    });
    whisperRef?.current?.close();
  };

  return (
    <div className="pw-gap-4 pw-flex">
      {canCreateCustomer && (
        <Whisper
          ref={whisperRef}
          placement="bottomEnd"
          trigger="hover"
          enterable
          speaker={
            <Popover full>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    handleClick();
                  }}
                  className="!pw-flex pw-items-center pw-gap-2"
                >
                  <BsPlusLg />
                  <span>{t('contacts-table.new_contact')}</span>
                </Dropdown.Item>
                <Dropdown.Item divider />

                <Dropdown.Item
                  onClick={() => {
                    setOpen(!open);
                  }}
                  className="!pw-flex pw-items-center pw-gap-2"
                >
                  <BsUpload />
                  <span>{t('contacts-table.create-multi')}</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Popover>
          }
        >
          <ButtonGroup
            onClick={() => {
              handleClick();
            }}
          >
            <Button appearance="primary" size="lg">
              <span className="pw-font-bold">{t('contacts-table.create')}</span>
            </Button>
            <IconButton color="green" size="lg" appearance="primary" icon={<MdExpandMore size="22" />} />
          </ButtonGroup>
        </Whisper>
      )}
      <AnalyticOptionSelect filterValues={filterValues} onChange={onChange} />
      {open && (
        <MultipleUploadModal
          sampleFile={MASS_UPLOAD_CONTACT_FILE}
          queryKey={CONTACTS_KEY}
          open={open}
          historyQuery={useGetMassUploadContactFileQuery}
          mutation={useUploadContactsFileMutation}
          detailFailQuery={useGetContactMassUploadFailedDetailsQuery}
          setOpen={setOpen}
        />
      )}
    </div>
  );
};

export default memo(TableHeaderAction);
