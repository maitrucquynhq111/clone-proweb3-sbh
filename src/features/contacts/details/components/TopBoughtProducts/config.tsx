import { formatCurrency } from '~app/utils/helpers';
import { ImageTextCell } from '~app/components';

type Params = {
  t: ExpectedAny;
};

export function columnOptions({ t }: Params) {
  return [
    {
      key: 'index',
      label: t('top_bought_products.index'),
      align: 'center',
      className: 'pw-text-base',
      width: 60,
      cell: (props: ExpectedAny) => {
        const { rowIndex } = props;
        return <span>{rowIndex + 1}</span>;
      },
    },
    {
      key: 'product_name',
      name: 'product_name',
      label: t('top_bought_products.product'),
      align: 'left',
      flexGrow: 1,
      cell: (props: ExpectedAny) => {
        const { rowData } = props;
        return <ImageTextCell image={rowData?.product_images?.[0]} text={rowData.product_name} />;
      },
    },
    {
      key: 'count',
      name: 'count',
      label: t('top_bought_products.number_of_bought'),
      flexGrow: 0.5,
      align: 'right',
      cell: (props: ExpectedAny) => {
        const { rowData } = props;
        return <span className="pw-px-4">{formatCurrency(rowData.count)}</span>;
      },
    },
  ];
}
