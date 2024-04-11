import { OrderHasRefundStateType } from '~app/utils/constants';

export const columnsConfig = ({ t }: { t: ExpectedAny }) => {
  return [
    {
      key: 'order_number',
      name: 'order_number',
      label: t('refund_order_number'),
      flexGrow: 1,
    },
    {
      key: 'id',
      name: 'id',
      label: t('refund_amount'),
      cell: ({ rowData }: { rowData: Order }) => {
        const refundState = rowData?.order_has_refund?.state;
        return (
          <div className="pw-px-3">
            {refundState === OrderHasRefundStateType.FULL_REFUND ? t('refunded') : null}
            {refundState === OrderHasRefundStateType.NO_REFUND_YET && rowData.amount_paid > 0
              ? t('partial_refund')
              : null}
            {refundState === OrderHasRefundStateType.NO_REFUND_YET && rowData.amount_paid === 0
              ? t('no_refund_yet')
              : null}
          </div>
        );
      },
    },
  ];
};
