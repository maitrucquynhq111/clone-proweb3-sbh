import { FormProvider as Form, UseFormReturn } from 'react-hook-form';

type Props = {
  children: React.ReactNode;
  className?: string;
  methods: UseFormReturn<ExpectedAny>;
  onSubmit?: VoidFunction;
};

export default function FormProvider({ children, onSubmit, methods, className = '' }: Props) {
  return (
    <Form {...methods}>
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onSubmit?.();
        }}
        className={className}
      >
        {children}
      </form>
    </Form>
  );
}
