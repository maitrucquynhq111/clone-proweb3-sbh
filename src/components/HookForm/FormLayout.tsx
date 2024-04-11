import { FormSchema } from '~app/components/HookForm/types';
import { formLayoutRenderer } from '~app/components/HookForm/utils';

type Props = {
  formSchema: FormSchema;
};

const FormLayout = ({ formSchema }: Props) => {
  return <div className={formSchema.className}>{formLayoutRenderer(formSchema)}</div>;
};

export default FormLayout;
