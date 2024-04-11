import cx from 'classnames';
import PageItem from '../PageItem';

type Props = { data: ExpectedAny; selected?: ExpectedAny; onSelect?: (data: string) => void; disabled?: boolean };

const ConnectedItem = ({ data, selected, disabled, onSelect }: Props) => {
  const handleSelect = (page: ExpectedAny) => {
    onSelect?.(selected?.id === page.id ? null : page);
  };
  return (
    <div
      onClick={() => !disabled && handleSelect(data)}
      className={cx('pw-border pw-rounded-md pw-h-fit pw-py-2 pw-px-4 pw-cursor-pointer', {
        ['pw-border-neutral-divider']: selected?.id !== data?.id,
        ['pw-border-blue-primary']: selected?.id === data?.id,
        ['pw-bg-secondary-background']: selected?.id === data?.id,
      })}
    >
      <PageItem data={data} />
    </div>
  );
};

export default ConnectedItem;
