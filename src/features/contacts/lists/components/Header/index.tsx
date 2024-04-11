import { IconButton, Button, Whisper, Popover, Dropdown, ButtonGroup } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { BsPlusLg, BsUpload } from 'react-icons/bs';
import { MdExpandMore } from 'react-icons/md';
import { useState } from 'react';
import { HeaderButton, MultipleUploadModal } from '~app/components';
import { ModalTypes, ModalPlacement, ModalSize } from '~app/modals/types';
import { MASS_UPLOAD_CONTACT_FILE } from '~app/configs';
import {
  CONTACTS_KEY,
  useGetContactMassUploadFailedDetailsQuery,
  useGetMassUploadContactFileQuery,
} from '~app/services/queries';
import { useUploadContactsFileMutation } from '~app/services/mutations';

const Header = () => {
  const { t } = useTranslation('header-button');
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
  };

  return (
    <HeaderButton>
      <Whisper
        placement="bottomEnd"
        trigger="click"
        speaker={({ onClose, left, top, className }, ref) => {
          const handleSelect = () => {
            onClose();
          };
          return (
            <Popover ref={ref} className={className} style={{ left, top }} full>
              <Dropdown.Menu onSelect={handleSelect}>
                <Dropdown.Item
                  onClick={() => {
                    handleSelect();
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
                    handleSelect();
                    setOpen(!open);
                  }}
                  className="!pw-flex pw-items-center pw-gap-2"
                >
                  <BsUpload />
                  <span>{t('contacts-table.create-multi')}</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Popover>
          );
        }}
      >
        <ButtonGroup>
          <Button appearance="primary" size="lg">
            <span className="pw-font-bold">{t('contacts-table.create')}</span>
          </Button>

          <IconButton color="green" size="lg" appearance="primary" icon={<MdExpandMore size="22" />} />
        </ButtonGroup>
      </Whisper>
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
    </HeaderButton>
  );
};

export default Header;
