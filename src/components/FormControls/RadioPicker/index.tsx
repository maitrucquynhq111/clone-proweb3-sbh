import cx from 'classnames';
import { memo } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { Popover, Whisper } from 'rsuite';
import { RadioSelectProps } from './type';
import DynamicRadioPicker from './DynamicRadioPicker';
import TextInput from '~app/components/FormControls/Input/TextInput';

const RadioSelect = ({
  name,
  labelName,
  placeholder,
  query,
  label,
  labelKey,
  valueKey,
  initStateFunc,
  creatable,
  createText,
  className,
  createComponent,
  createButton,
  customRadioItem,
  onChange,
  ...props
}: RadioSelectProps) => {
  return (
    <Whisper
      trigger="click"
      placement="autoVerticalEnd"
      speaker={({ onClose, left, top, className: classNameWhisper }, ref) => {
        const inputElement = document.querySelector(`input[name="${labelName}"]`) as HTMLInputElement;
        const inputWidth = inputElement ? inputElement.getBoundingClientRect().width : 0;
        return (
          <Popover
            ref={ref}
            className={cx('!pw-rounded-none', classNameWhisper, className)}
            style={{ left, top, minWidth: inputWidth }}
            arrow={false}
            full
          >
            <DynamicRadioPicker
              name={name}
              labelName={labelName}
              query={query}
              labelKey={labelKey}
              valueKey={valueKey}
              initStateFunc={initStateFunc}
              creatable={creatable}
              placeholder={placeholder}
              createComponent={createComponent}
              createButton={createButton}
              customRadioItem={customRadioItem}
              createText={createText}
              onClose={onClose}
              onChange={onChange}
              searchKey={props.searchKey}
              searchable={props.searchable}
            />
          </Popover>
        );
      }}
    >
      <TextInput
        name={labelName}
        label={label}
        readOnly
        isRequired={props.isRequired}
        placeholder={placeholder}
        transparentIcon={true}
        PrefixIcon={<BsChevronDown />}
      />
    </Whisper>
  );
};

export default memo(RadioSelect);
