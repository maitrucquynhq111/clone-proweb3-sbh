import { Drawer } from 'rsuite';
import { CONTACT_DETAIL } from '~app/services/queries';
import { queryClient } from '~app/configs/client';
import { ModalPlacement, ModalSize } from '~app/modals';
import ContactUpdate from '~app/features/contacts/update';

type Props = {
  hideDelete?: boolean;
  onClose(): void;
};

const ContactUpdateInline = ({ hideDelete = false, onClose }: Props) => {
  return (
    <Drawer
      backdrop="static"
      keyboard={false}
      placement={ModalPlacement.Right}
      size={ModalSize.Small}
      open={true}
      onClose={onClose}
      className="pw-h-screen"
    >
      <ContactUpdate
        isRedirect
        hideDelete={hideDelete}
        onSuccess={() => queryClient.invalidateQueries([CONTACT_DETAIL], { exact: false })}
        onClose={onClose}
      />
    </Drawer>
  );
};

export default ContactUpdateInline;
