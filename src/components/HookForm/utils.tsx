import {
  DebouncedInput,
  DateRangeInput,
  DateRangeFormInput,
  DateInput,
  TagPickerContainer,
  CheckPickerContainer,
  CurrencyInput,
  TextInput,
  FormLabel,
  SelectPickerContainer,
  RadioPicker,
  Checkbox,
  TagInput,
  DecimalInput,
} from '~app/components/FormControls';
import { FormSchema, RHFToggle } from '~app/components/HookForm';
import FormBlock from '~app/components/HookForm/FormBlock';
import FormBlockContainer from '~app/components/HookForm/FormBlockContainer';

export enum ComponentType {
  DebounceText = 'debouncetext',
  Text = 'text',
  Number = 'number',
  DateRange = 'daterange',
  DateRangeForm = 'daterangeform',
  Date = 'date',
  Custom = 'custom',
  TagPicker = 'tagpicker',
  CheckPicker = 'checkpicker',
  SelectPicker = 'selectpicker',
  RadioPicker = 'radiopicker',
  Currency = 'currency',
  DemicalInput = 'demicalInput',
  Toggle = 'toggle',
  Label = 'label',
  Checkbox = 'checkbox',
  TagInput = 'taginput',
}

export const componentRenderer = (key: string, props: ExpectedAny, onChange: ExpectedAny) => {
  const { visible, additionalComponent, inputWrapperClassName, ...rest } = props;
  const type = props.type as ExpectedAny;
  const Component = props?.component || null;
  switch (type) {
    case ComponentType.Text:
      return (
        <TextInput
          {...rest}
          additionalComponent={additionalComponent}
          name={props.name}
          inputWrapperClassName={inputWrapperClassName}
        />
      );
    case ComponentType.DebounceText:
      return <DebouncedInput {...rest} name={props.name} />;
    case ComponentType.Currency:
      return <CurrencyInput {...rest} additionalComponent={additionalComponent} name={props.name} />;
    case ComponentType.DemicalInput:
      return <DecimalInput {...rest} additionalComponent={additionalComponent} name={props.name} />;
    case ComponentType.TagPicker:
      return <TagPickerContainer name={props.name} {...rest} />;
    case ComponentType.CheckPicker:
      return <CheckPickerContainer name={props.name} {...rest} />;
    case ComponentType.SelectPicker:
      return <SelectPickerContainer name={props.name} {...rest} />;
    case ComponentType.RadioPicker:
      return <RadioPicker name={props.name} {...rest} />;
    case ComponentType.Toggle:
      return <RHFToggle name={props.name} {...rest} />;
    case ComponentType.Number:
      return <DebouncedInput key={key} {...rest} onChange={(e) => onChange(key, e)} />;
    case ComponentType.DateRange:
      return <DateRangeInput key={key} {...rest} onChange={(e: ExpectedAny) => onChange(key, e)} />;
    case ComponentType.DateRangeForm:
      return <DateRangeFormInput key={key} {...rest} />;
    case ComponentType.Date:
      return <DateInput key={key} {...rest} onChange={(e: ExpectedAny) => onChange(key, e)} />;
    case ComponentType.Custom:
      return <Component key={key} {...rest} onChange={onChange} />;
    case ComponentType.Label:
      return <FormLabel key={key} {...rest} />;
    case ComponentType.Checkbox:
      return <Checkbox key={key} {...rest} />;
    case ComponentType.TagInput:
      return <TagInput key={key} {...rest} />;
    default:
      return null;
  }
};

export const formLayoutRenderer = (data: FormSchema) => {
  return (
    <>
      {data?.children &&
        data.children.map((item: FormSchema) => {
          if (item?.visible === false) return null;
          if (item.type !== 'block-container' && item.type !== 'block') {
            return (
              <div key={item.key || item.name} className={item?.className || ''}>
                {componentRenderer(item.name, item, item?.onChange)}
              </div>
            );
          }
          if (item.type === 'block-container') {
            return (
              <FormBlockContainer key={item.name} className={item?.className}>
                {item?.children && formLayoutRenderer(item)}
              </FormBlockContainer>
            );
          }
          return (
            <FormBlock
              blockClassName={item?.blockClassName || ''}
              className={item?.className || ''}
              key={item.name}
              title={item.title}
              titleClassName={item?.titleClassName || ''}
              subTitle={item.subTitle}
            >
              {item?.children && formLayoutRenderer(item)}
            </FormBlock>
          );
        })}
    </>
  );
};
