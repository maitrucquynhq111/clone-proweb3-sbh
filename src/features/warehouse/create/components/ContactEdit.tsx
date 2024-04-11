import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { BsTrash } from 'react-icons/bs';
import { Divider, IconButton } from 'rsuite';
import { formatCurrency } from '~app/utils/helpers';
import { PlaceholderImage } from '~app/components';

type Props = {
  className?: string;
  onRemoveContact(): void;
};

const ContactEdit = ({ className, onRemoveContact }: Props) => {
  const { t } = useTranslation('purchase-order');
  const { watch } = useFormContext<PendingInventoryCreate>();
  const debtAmount = watch('contact_debt_amount') || 0;
  const isReceive = (watch('contact_debt_amount') || 0) > 0;

  return (
    <div className={className}>
      <div className="pw-flex pw-gap-2 pw-relative pw-gap-x-4 pw-items-center pw-justify-between">
        <div className="pw-flex pw-flex-1 pw-items-center pw-gap-2">
          <div className="!pw-w-10 !pw-h-10">
            <PlaceholderImage
              className="pw-bg-cover pw-rounded-full !pw-w-10 !pw-h-10 pw-object-cover"
              src={watch('contact_avatar')}
              alt={watch('contact_name')}
              isAvatar={true}
            />
          </div>
          <div className="pw-w-full">
            <span className="pw-font-bold pw-text-left pw-text-base pw-text-black">{watch('contact_name')}</span>
            <div className="pw-flex pw-items-center pw-text-neutral-500 pw-text-sm pw-font-normal pw-text-left pw-mt-1">
              <span>{watch('contact_phone')}</span>
              {debtAmount > 0 && (
                <>
                  <Divider vertical />
                  <div>
                    <span className="pw-font-normal pw-text-sm">{isReceive ? t('must-receive') : t('must-pay')}:</span>
                    <span
                      className={cx('pw-font-bold pw-ml-0.5 pw-text-sm', {
                        'pw-text-red-600': isReceive,
                        'pw-text-green-600': !isReceive,
                      })}
                    >
                      {formatCurrency(debtAmount)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <IconButton
          appearance="subtle"
          icon={<BsTrash className="pw-fill-neutral-secondary pw-w-6 pw-h-6" />}
          onClick={onRemoveContact}
        />
      </div>
    </div>
  );
};

export default ContactEdit;
