import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { ButtonTransparent } from '~app/components';
import { useCreateUomMutation } from '~app/services/mutations';

type Props = {
  search: string;
  onChange(value: ExpectedAny): void;
  onClose?(): void;
};

const CreateUomButton = ({ search, onChange, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('ingredients-form');
  const { mutateAsync } = useCreateUomMutation();

  const handleCreate = async () => {
    try {
      const response = await mutateAsync(search);
      onChange(response);
      onClose?.();
      toast.success(t('success.create_uom'));
    } catch (error) {
      // TO DO
    }
  };

  return (
    <ButtonTransparent onClick={handleCreate}>
      <div className="pw-flex pw-items-center pw-text-blue-primary pw-py-3">
        <BsPlusCircleFill size={22} />
        <span className="pw-font-bold pw-ml-2">{`${t('action.create_uom')} "${search}"`}</span>
      </div>
    </ButtonTransparent>
  );
};

export default CreateUomButton;
