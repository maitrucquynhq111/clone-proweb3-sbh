import cx from 'classnames';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPlusCircleFill } from 'react-icons/bs';
import EditableCustomerInfo from './EditableCustomerInfo';

type Props = {
  selected: string;
  hasContact?: boolean;
  listContactDelivering?: ContactDeliveringAddress[];
  onCreateAddress(): void;
  onEditAddress(value: ContactDeliveringAddress): void;
  onSelect(value: ContactDeliveringAddress): void;
};

const SelectCustomerInfo = ({
  selected,
  hasContact,
  listContactDelivering = [],
  onCreateAddress,
  onEditAddress,
  onSelect,
}: Props) => {
  const { t } = useTranslation('chat');

  return (
    <div className="pw-bg-neutral-white pw-max-w-sm pw-min-w-sm">
      {hasContact ? (
        <button
          className={cx('pw-flex pw-items-center pw-justify-center pw-gap-x-2 pw-px-4 ', {
            'pw-py-2': listContactDelivering.length === 0,
            'pw-pt-4 pw-pb-2': listContactDelivering.length > 0,
          })}
          type="button"
          onClick={onCreateAddress}
        >
          <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={20} />
          <span className="pw-text-secondary-main-blue pw-text-sm pw-font-bold">{t('action.create_address')}</span>
        </button>
      ) : null}

      {listContactDelivering.map((item, index) => {
        return (
          <div
            key={item.id}
            className={cx('pw-py-3 pw-px-3 pw-flex pw-justify-between pw-gap-x-3 ', {
              'pw-border-t pw-border-solid pw-border-neutral-divider': index !== 0,
            })}
          >
            <div className="pw-flex pw-gap-x-2 pw-w-full">
              <button onClick={() => onSelect(item)}>
                <div className="pw-wrapper-custom-radio_green !pw-pr-6">
                  <input checked={selected === item.id} type="radio" readOnly />
                  <span className="pw-checkmark-custom-radio_green" />
                </div>
              </button>
              <EditableCustomerInfo
                id={item.id}
                name={item.name}
                phoneNumber={item.phone_number}
                addressInfo={item.address_info}
                onClick={() => onEditAddress(item)}
                className="pw-w-full"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(SelectCustomerInfo);
