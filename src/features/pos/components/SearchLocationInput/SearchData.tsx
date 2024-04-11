import { useTranslation } from 'react-i18next';
import { FixedSizeList as List } from 'react-window';

type Props = {
  data: AddressLocation[];
  onClick(value?: AddressLocation): void;
};
function SearchData({ data, onClick }: Props) {
  const { t } = useTranslation('pos');
  // return (

  //   <div className="pw-overflow-auto pw-max-h-80">
  //     {(data?.length > 0 &&
  //       data.map((item: AddressLocation) => {
  //         return (
  //   <div
  //     key={item.id}
  //     className="pw-p-3 pw-cursor-pointer pw-text-sm pw-border-b"
  //     onClick={() => onClick(item)}
  //   >
  //     {item?.full_name}
  //   </div>
  // );
  //       })) || <div className="pw-p-3 pw-text-sm">{t('error.no_search_location')}</div>}
  //   </div>
  // );

  const Row = ({ index, style }: ExpectedAny) => {
    const item = data[index];
    return (
      <div style={style}>
        <div
          key={item?.id}
          className="pw-px-3 pw-py-1 pw-flex pw-items-center pw-h-full pw-cursor-pointer pw-text-sm pw-border-b"
          onClick={() => onClick(item)}
        >
          {item?.full_name}
        </div>
      </div>
    );
  };

  return data?.length > 0 ? (
    <List height={300} itemCount={data.length} itemSize={52} width={380}>
      {Row}
    </List>
  ) : (
    <div className="pw-overflow-auto pw-max-h-80">
      <div className="pw-p-3 pw-text-sm">{t('error.no_search_location')}</div>
    </div>
  );
}

export default SearchData;
