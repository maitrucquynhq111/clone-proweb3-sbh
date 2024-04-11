import { memo } from 'react';
import DynamicTagPicker from './DynamicTagPicker';
import StaticTagPicker from './StaticTagPicker';
import { TagPickerContainerProps } from '~app/components/FormControls/TagPicker/types';

const TagPickerContainer = ({
  async = false,
  name,
  data,
  query,
  searchKey,
  mapFunc,
  mutateAsync,
  initStateFunc,
  type,
  ...props
}: TagPickerContainerProps) => {
  return (
    <>
      {props.label ? (
        <label className="pw-block pw-mb-1 pw-text-sm" htmlFor={name}>
          {props.label}
        </label>
      ) : null}
      {async ? (
        <DynamicTagPicker
          {...props}
          name={name}
          query={query}
          searchKey={searchKey}
          mapFunc={mapFunc}
          mutateAsync={mutateAsync}
          initStateFunc={initStateFunc}
        />
      ) : (
        <StaticTagPicker {...props} name={name} data={data} />
      )}
    </>
  );
};

export default memo(TagPickerContainer);
