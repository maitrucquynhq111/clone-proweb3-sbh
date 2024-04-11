import DynamicCheckPicker from './DynamicCheckPicker';
import StaticCheckPicker from './StaticCheckPicker';
import { CheckPickerContainerProps } from '~app/components/FormControls/CheckPicker/types';

const CheckPickerContainer = ({
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
}: CheckPickerContainerProps) => {
  return (
    <>
      {label ? (
        <label className="pw-block pw-mb-1 pw-text-sm" htmlFor={name}>
          {label}
        </label>
      ) : null}
      {async ? (
        <DynamicCheckPicker
          {...props}
          name={name}
          query={query}
          searchKey={searchKey}
          mapFunc={mapFunc}
          mutateAsync={mutateAsync}
          initStateFunc={initStateFunc}
        />
      ) : (
        <StaticCheckPicker {...props} name={name} data={data} />
      )}
    </>
  );
};

export default CheckPickerContainer;
