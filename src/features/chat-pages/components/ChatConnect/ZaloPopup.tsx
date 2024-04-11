import NewWindow from 'react-new-window';

type Props = {
  open: boolean;
  requestUrl: string;
  onClose: ExpectedAny;
};
const ZaloPopup = ({ open, requestUrl, onClose }: Props) => {
  return (
    (open && (
      <NewWindow features={{ width: 600, height: 650, top: 100, left: 100 }} url={requestUrl} onUnload={onClose} />
    )) || <></>
  );
};
export default ZaloPopup;
