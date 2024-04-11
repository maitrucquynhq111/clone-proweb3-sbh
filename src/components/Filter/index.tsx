//TODO: Using ExpectedAny for now, but should be replaced with the correct type in the future.
import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { TypeAttributes } from 'rsuite/esm/@types/common';
import SecondaryFilter from './SecondaryFilter';
import { ResultOutlet } from './Result';
import { componentRenderer } from './utils';

type Props = {
  filterOptions: ExpectedAny;
  currentFilter?: ExpectedAny;
  onFilter?: (values: ExpectedAny) => void;
  initValues?: ExpectedAny;
  showFilterData?: boolean;
  placement?: TypeAttributes.Placement;
  secondaryFilterClassName?: string;
};

const Filter = forwardRef(
  (
    {
      filterOptions,
      currentFilter,
      onFilter,
      initValues,
      placement,
      showFilterData = true,
      secondaryFilterClassName,
    }: Props,
    ref,
  ) => {
    const secondaryFilterRef = useRef<ExpectedAny>();
    const { primary, secondary } = filterOptions;

    const [primaryVariables, setPrimaryVariables] = useState<ExpectedAny>(initValues?.primary || {});
    const [secondaryVariables, setSecondaryVariables] = useState<ExpectedAny>(initValues?.secondary || {});

    useImperativeHandle(ref, () => ({
      setValueSecondaryFilter: (name: string, value: ExpectedAny) => secondaryFilterRef?.current?.setValue(name, value),
      handleSetSecondaryVariables: (value: ExpectedAny) => handleSetSecondaryVariables(value),
    }));

    const handleFilter = () => {
      typeof onFilter === 'function' &&
        onFilter({
          ...primaryVariables,
          ...secondaryVariables,
        });
    };

    const handleSetPrimaryVariables = (key: string, value: string) => {
      setPrimaryVariables({
        ...primaryVariables,
        [key]: value,
      });
    };

    const handleSetSecondaryVariables = (value: ExpectedAny) => {
      setSecondaryVariables({
        ...secondaryVariables,
        ...value,
      });
    };

    useEffect(() => {
      handleFilter();
    }, [primaryVariables, secondaryVariables]);

    if (!filterOptions) return null;

    return (
      <div>
        <div className="pw-flex pw-gap-2 pw-flex-1 pw-flex-wrap">
          {primary &&
            Object.keys(primary).map((item: ExpectedAny) => {
              return componentRenderer(item, filterOptions.primary[item], handleSetPrimaryVariables);
            })}
          {secondary && (
            <SecondaryFilter
              ref={secondaryFilterRef}
              initValues={initValues.secondary}
              currentFilter={currentFilter}
              options={secondary}
              showFilterData={showFilterData}
              placement={placement}
              className={secondaryFilterClassName}
              onFilter={handleSetSecondaryVariables}
            />
          )}
        </div>
        <ResultOutlet />
      </div>
    );
  },
);

export default Filter;
