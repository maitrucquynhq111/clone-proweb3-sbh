import { FaMoneyBill, FaMoneyCheckAlt } from 'react-icons/fa';
import { IconHDbank, IconMBbank, IconBIDV, IconMastercard } from '~app/components/Icons';

export enum PaymentMethod {
  HDB = 'HDB',
  MB = 'MB',
  BIDV = 'BIDV',
  COD = 'cod',
  ATM = 'ATM',
  CC = 'CC',
  MOMO = 'momo',
  BANKING = 'banking',
}

export type PaymentMethodType = {
  payment_type: PaymentMethod;
  icon: JSX.Element;
  name: string;
};

export const DEFAULT_BANK: PaymentMethodType[] = [
  {
    payment_type: PaymentMethod.HDB,
    icon: <IconHDbank />,
    name: 'HDBank',
  },
  {
    payment_type: PaymentMethod.MB,
    icon: <IconMBbank />,
    name: 'MBBank',
  },
  {
    payment_type: PaymentMethod.BIDV,
    icon: <IconBIDV />,
    name: 'BIDV',
  },
];

export const DIRECT_PAYMENT_METHOD: PaymentMethodType[] = [
  {
    payment_type: PaymentMethod.COD,
    icon: <FaMoneyBill size={24} className="pw-text-neutral-placeholder" />,
    name: 'cod_payment',
  },
];

export const NEOX_PAYMENT_METHOD: PaymentMethodType[] = [
  {
    payment_type: PaymentMethod.ATM,
    icon: <FaMoneyCheckAlt size={24} className="pw-text-secondary-main-blue" />,
    name: 'atm_payment',
  },
  {
    payment_type: PaymentMethod.CC,
    icon: <IconMastercard />,
    name: 'cc_payment',
  },
];
