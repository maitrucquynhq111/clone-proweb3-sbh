import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from 'rsuite';
import { useNetworkState } from 'react-use';
import { PaymentSettingType } from '~app/features/pos/constants';
import { usePosStore } from '~app/features/pos/hooks/usePos';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';

const PromotionIcon = () => {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_939_70695)">
        <path
          d="M8.25 0.9C8.25 0.825 8.25 0.825 8.25 0.75H1.35C0.6 0.75 0 1.35 0 2.1V3.6C0 3.9 0.225 4.2 0.6 4.2C1.5 4.125 2.25 4.875 2.25 5.85C2.25 6.825 1.5 7.5 0.6 7.5C0.225 7.5 0 7.725 0 8.1V9.6C0 10.35 0.6 10.95 1.35 10.95H8.25C8.25 10.875 8.25 10.875 8.25 10.8V0.9Z"
          fill="#8F61F2"
        />
        <path
          d="M14.1 4.1248C14.4 4.1248 14.7 3.8998 14.7 3.5248V2.0248C14.7 1.2748 14.1 0.674805 13.35 0.674805H9.375C9.375 0.749805 9.375 0.749805 9.375 0.824805V10.7248C9.375 10.7998 9.375 10.7998 9.375 10.8748H13.35C14.1 10.8748 14.7 10.2748 14.7 9.5248V8.0248C14.7 7.7248 14.475 7.4248 14.1 7.4248C13.2 7.4248 12.45 6.6748 12.45 5.7748C12.45 4.8748 13.125 4.1248 14.1 4.1248Z"
          fill="#8F61F2"
        />
      </g>
      <defs>
        <clipPath id="clip0_939_70695">
          <rect width="14.625" height="10.125" fill="white" transform="translate(0 0.75)" />
        </clipPath>
      </defs>
    </svg>
  );
};

const TagIcon = () => {
  return (
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.08303 0.665463C6.88466 0.467035 6.61559 0.355529 6.33501 0.355469H1.91277C1.63216 0.355469 1.36305 0.46694 1.16463 0.66536C0.966208 0.86378 0.854736 1.1329 0.854736 1.4135V5.83574C0.854796 6.11632 0.966313 6.3854 1.16474 6.58377L7.91474 13.3338C8.11315 13.5321 8.38222 13.6435 8.66277 13.6435C8.94333 13.6435 9.2124 13.5321 9.41081 13.3338L13.833 8.91154C14.0314 8.71313 14.1428 8.44406 14.1428 8.1635C14.1428 7.88295 14.0314 7.61387 13.833 7.41546L7.08303 0.665463ZM5.41245 4.91337C5.70129 4.62453 5.86356 4.23278 5.86356 3.8243C5.86356 3.41582 5.70129 3.02407 5.41245 2.73523C5.12361 2.44639 4.73186 2.28412 4.32338 2.28412C3.9149 2.28412 3.52315 2.44639 3.23431 2.73523C2.94547 3.02407 2.7832 3.41582 2.7832 3.8243C2.7832 4.23278 2.94547 4.62453 3.23431 4.91337C3.52315 5.20221 3.9149 5.36448 4.32338 5.36448C4.73186 5.36448 5.12361 5.20221 5.41245 4.91337ZM4.59802 3.54966C4.67085 3.6225 4.71177 3.72129 4.71177 3.8243C4.71177 3.92731 4.67085 4.02609 4.59802 4.09893C4.52518 4.17177 4.42639 4.21269 4.32338 4.21269C4.22037 4.21269 4.12158 4.17177 4.04875 4.09893C3.97591 4.02609 3.93499 3.92731 3.93499 3.8243C3.93499 3.72129 3.97591 3.6225 4.04875 3.54966C4.12158 3.47682 4.22037 3.4359 4.32338 3.4359C4.42639 3.4359 4.52518 3.47682 4.59802 3.54966Z"
        fill="#EA7330"
      />
    </svg>
  );
};

const ShippingBoxIcon = () => {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.01465 3.125C6.01465 2.77982 6.28166 2.5 6.61105 2.5H16.1534C16.4828 2.5 16.7498 2.77982 16.7498 3.125V10C16.7498 10.6904 16.2158 11.25 15.557 11.25H7.20744C6.54868 11.25 6.01465 10.6904 6.01465 10V3.125Z"
        fill="#4A94EC"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.28471 0.629826C7.49708 0.240357 7.8923 0 8.32034 0H14.4441C14.8722 0 15.2674 0.240357 15.4798 0.629827L16.6712 2.81491C16.7767 3.00835 16.776 3.24601 16.6692 3.4387C16.5625 3.6314 16.366 3.75 16.1534 3.75H6.61105C6.39845 3.75 6.20192 3.6314 6.09522 3.4387C5.98851 3.24601 5.98775 3.00835 6.09323 2.81491L7.28471 0.629826Z"
        fill="#4A94EC"
      />
      <path
        d="M6.21444 5.12467H2.71557C2.39749 5.12467 2.15894 4.87467 2.15894 4.54134C2.15894 4.20801 2.39749 3.95801 2.71557 3.95801H6.21444V5.12467Z"
        fill="#4A94EC"
      />
      <path
        d="M6.691 7.62467H3.19214C2.87406 7.62467 2.6355 7.37467 2.6355 7.04134C2.6355 6.70801 2.87406 6.45801 3.19214 6.45801H6.691V7.62467Z"
        fill="#4A94EC"
      />
      <path
        d="M6.13446 9.875H0.806638C0.488559 9.875 0.25 9.54167 0.25 9.20833C0.25 8.875 0.488559 8.625 0.806638 8.625H6.13446V9.875Z"
        fill="#4A94EC"
      />
    </svg>
  );
};

const NoteIcon = () => {
  return (
    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.63194 12.1545C4.74765 12.2118 4.8483 12.295 4.92593 12.3976L6.68519 14.7213C6.78006 14.8467 6.90308 14.9484 7.0445 15.0185C7.18593 15.0885 7.34188 15.125 7.5 15.125C7.65812 15.125 7.81407 15.0885 7.95549 15.0185C8.09692 14.9484 8.21994 14.8467 8.31482 14.7213L10.0741 12.3976C10.1517 12.295 10.2523 12.2118 10.3681 12.1545C10.4838 12.0971 10.6114 12.0673 10.7407 12.0673H13.0556C13.5713 12.0673 14.0658 11.8643 14.4305 11.503C14.7951 11.1417 15 10.6517 15 10.1408V2.80154C15 2.29059 14.7951 1.80057 14.4305 1.43927C14.0658 1.07797 13.5713 0.875 13.0556 0.875H1.94444C1.42875 0.875 0.934169 1.07797 0.569515 1.43927C0.204861 1.80057 0 2.29059 0 2.80154V10.1408C0 10.6517 0.204861 11.1417 0.569515 11.503C0.934169 11.8643 1.42875 12.0673 1.94444 12.0673H4.25926C4.38863 12.0673 4.51622 12.0971 4.63194 12.1545ZM2.94043 3.78842C2.83624 3.89165 2.77771 4.03166 2.77771 4.17764C2.77771 4.32363 2.83624 4.46363 2.94043 4.56686C3.04462 4.67009 3.18592 4.72808 3.33327 4.72808H11.6666C11.8139 4.72808 11.9552 4.67009 12.0594 4.56686C12.1636 4.46363 12.2222 4.32363 12.2222 4.17764C12.2222 4.03166 12.1636 3.89165 12.0594 3.78842C11.9552 3.68519 11.8139 3.6272 11.6666 3.6272H3.33327C3.18592 3.6272 3.04462 3.68519 2.94043 3.78842ZM2.94043 6.08193C2.83624 6.18515 2.77771 6.32516 2.77771 6.47115C2.77771 6.61713 2.83624 6.75714 2.94043 6.86037C3.04462 6.96359 3.18592 7.02159 3.33327 7.02159H11.6666C11.8139 7.02159 11.9552 6.96359 12.0594 6.86037C12.1636 6.75714 12.2222 6.61713 12.2222 6.47115C12.2222 6.32516 12.1636 6.18515 12.0594 6.08193C11.9552 5.9787 11.8139 5.92071 11.6666 5.92071H3.33327C3.18592 5.92071 3.04462 5.9787 2.94043 6.08193ZM2.94043 8.37543C2.83624 8.47866 2.77771 8.61867 2.77771 8.76465C2.77771 8.91064 2.83624 9.05064 2.94043 9.15387C3.04462 9.2571 3.18592 9.31509 3.33327 9.31509H7.9629C8.11024 9.31509 8.25154 9.2571 8.35573 9.15387C8.45992 9.05064 8.51845 8.91064 8.51845 8.76465C8.51845 8.61867 8.45992 8.47866 8.35573 8.37543C8.25154 8.2722 8.11024 8.21421 7.9629 8.21421H3.33327C3.18592 8.21421 3.04462 8.2722 2.94043 8.37543Z"
        fill="#D96285"
      />
    </svg>
  );
};

const PaymentSetting = () => {
  const { t } = useTranslation('pos');
  const { online } = useNetworkState();
  const [, setStore] = usePosStore((store) => store);
  const [promotionCode] = useSelectedOrderStore((store) => store.promotion_code);
  const [showOtherDiscount] = useSelectedOrderStore((store) => store.show_other_discount);
  const [showDeliveryFee] = useSelectedOrderStore((store) => store.show_delivery_fee);
  const [showNote] = useSelectedOrderStore((store) => store.show_note);

  const handleClick = (value: PaymentSettingType) => {
    // Promotion
    if (value === PaymentSettingType.PROMOTION) {
      return setStore((store) => ({ ...store, show_promotion_modal: true }));
    }
    // Other discount
    if (value === PaymentSettingType.OTHER_DISCOUNT) {
      return setStore((store) => ({ ...store, show_other_discount_modal: true }));
    }
    // Delivery fee
    if (value === PaymentSettingType.DELIVERY_FEE) {
      return setStore((store) => ({ ...store, show_delivery_fee_modal: true }));
    }
    // Note
    if (value === PaymentSettingType.NOTE) {
      return setStore((store) => ({ ...store, show_note_modal: true }));
    }
  };

  return (
    <div className="pw-grid pw-grid-cols-2 pw-gap-2 xl:pw-grid-cols-4 pw-gap-x-2">
      <Button
        className={cx('!pw-flex  pw-items-center pw-justify-center pw-col-span-1 !pw-border !pw-border-solid', {
          'pw-text-neutral-primary !pw-border-transparent': !promotionCode,
          '!pw-text-green-600 !pw-border-green-600 !pw-bg-primary-background': promotionCode,
        })}
        onClick={() => {
          if (!online) return toast.warning(t('error.no_network_promotion'));
          handleClick(PaymentSettingType.PROMOTION);
        }}
      >
        <div className="pw-text-xl pw-cursor-pointer">
          <PromotionIcon />
        </div>
        {/* <div className="pw-text-xs pw-font-bold">{t('promotion_short')}</div> */}
      </Button>
      <Button
        className={cx('!pw-flex  pw-items-center pw-justify-center pw-col-span-1 !pw-border !pw-border-solid', {
          'pw-text-neutral-primary !pw-border-transparent': !showOtherDiscount,
          '!pw-text-green-600 !pw-border-green-600 !pw-bg-primary-background': showOtherDiscount,
        })}
        onClick={() => handleClick(PaymentSettingType.OTHER_DISCOUNT)}
      >
        <div className="pw-text-xl pw-cursor-pointer">
          <TagIcon />
        </div>
        {/* <div className="pw-text-xs pw-text-neutral-primary pw-font-bold">{t('other_discount')}</div> */}
      </Button>
      <Button
        className={cx('!pw-flex  pw-items-center pw-justify-center pw-col-span-1 !pw-border !pw-border-solid', {
          'pw-text-neutral-primary !pw-border-transparent': !showDeliveryFee,
          '!pw-text-green-600 !pw-border-green-600 !pw-bg-primary-background': showDeliveryFee,
        })}
        onClick={() => handleClick(PaymentSettingType.DELIVERY_FEE)}
      >
        <div className="pw-text-xl pw-cursor-pointer">
          <ShippingBoxIcon />
        </div>
        {/* <div className="pw-text-xs pw-text-neutral-primary pw-font-bold">{t('delivery')}</div> */}
      </Button>
      <Button
        className={cx('!pw-flex  pw-items-center pw-justify-center pw-col-span-1 !pw-border !pw-border-solid', {
          'pw-text-neutral-primary !pw-border-transparent': !showNote,
          '!pw-text-green-600 !pw-border-green-600 !pw-bg-primary-background': showNote,
        })}
        onClick={() => handleClick(PaymentSettingType.NOTE)}
      >
        <div className="pw-text-xl pw-cursor-pointer">
          <NoteIcon />
        </div>
        {/* <div className="pw-text-xs pw-font-bold">{t('note')}</div> */}
      </Button>
    </div>
  );
};

export default PaymentSetting;
