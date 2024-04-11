import DynamicSelectPicker from './DynamicSelectPicker';
import StaticSelectPicker from './StaticSelectPicker';
import { SelectPickerContainerProps } from '~app/components/FormControls/SelectPicker/types';

const SelectPickerContainer = ({
  async = false,
  name,
  data,
  query,
  searchKey,
  mapFunc,
  mutateAsync,
  initStateFunc,
  label,
  ...props
}: SelectPickerContainerProps) => {
  return (
    <>
      {label ? (
        <label className="pw-block pw-mb-1 pw-text-sm" htmlFor={name}>
          {label}
        </label>
      ) : null}
      {async ? (
        <DynamicSelectPicker
          {...props}
          name={name}
          query={query}
          searchKey={searchKey}
          mapFunc={mapFunc}
          mutateAsync={mutateAsync}
          initStateFunc={initStateFunc}
        />
      ) : (
        <StaticSelectPicker {...props} name={name} data={data} />
      )}
    </>
  );
};

export default SelectPickerContainer;
