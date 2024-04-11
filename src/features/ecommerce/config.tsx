import { useTranslation } from 'react-i18next';
import { BsArrowRepeat, BsBoxSeam, BsFileEarmarkText } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';
import { RiLinkM } from 'react-icons/ri';
import { IconButton, Tag, Tooltip, Whisper } from 'rsuite';
import { TypeAttributes } from 'rsuite/esm/@types/common';
import { IconLazada, IconShopeeWhite, IconTiktokNoName } from '~app/components/Icons';
import { ActionType, PlatformKey } from '~app/features/ecommerce/index';

const generateIconEcom = (rowData: EcomShop) => {
  switch (rowData.seller.platform_key) {
    case PlatformKey.SHOPEE:
      return (
        <div>
          <IconShopeeWhite size="20" />
        </div>
      );
    case PlatformKey.LAZADA:
      return (
        <div>
          <IconLazada size="20" />
        </div>
      );
    default:
      return (
        <div>
          <IconTiktokNoName size="20" />
        </div>
      );
  }
};

type TooltipButtonProps = {
  type: string;
  placement?: TypeAttributes.Placement | undefined;
  onClick(): void;
};

const generateTooltipTitle = (type: string) => {
  const { t } = useTranslation('ecommerce');
  switch (type) {
    case ActionType.SYNC_PRODUCT:
      return t('action.sync_product');
    case ActionType.SYNC_ORDER:
      return t('action.sync_order');
    case ActionType.SYNC_SETTING:
      return t('action.sync_setting');
    default:
      return t('action.connect_store');
  }
};

const generateIconAction = (type: string) => {
  switch (type) {
    case ActionType.SYNC_PRODUCT:
      return <BsBoxSeam size={18} />;
    case ActionType.SYNC_ORDER:
      return <BsFileEarmarkText size={18} />;
    case ActionType.SYNC_SETTING:
      return <BsArrowRepeat size={18} />;
    default:
      return <RiLinkM size={18} />;
  }
};

const TooltipButton = ({ type, placement = 'autoVertical', onClick }: TooltipButtonProps) => {
  return (
    <Whisper placement={placement} trigger="hover" speaker={<Tooltip>{generateTooltipTitle(type)}</Tooltip>}>
      <IconButton className="!pw-bg-transparent" icon={generateIconAction(type)} onClick={onClick} />
    </Whisper>
  );
};

const generateStatus = () => {
  const { t } = useTranslation('ecommerce');
  switch (true) {
    default:
      return <Tag className="!pw-bg-success-active !pw-text-white pw-font-semibold">{t('status.connected')}</Tag>;
  }
};

type Props = {
  onClick({ type, rowData }: { type: string; rowData: EcomShop }): void;
};

export const columnOptions = ({ onClick }: Props) => {
  const { t } = useTranslation('ecommerce');

  return {
    seller_name: {
      label: t('table.name'),
      flexGrow: 1,
      cell: ({ rowData }: { rowData: EcomShop }) => {
        return (
          <div className="pw-w-full pw-py-2 pw-px-4 pw-text-left">
            <p className="pw-text-blue-primary pw-mb-1">{rowData?.seller?.seller_name}</p>
            <div className="pw-flex pw-items-center">
              {generateIconEcom(rowData)}
              <span className="pw-text-sm pw-ml-2">{rowData.seller.platform_key}</span>
            </div>
          </div>
        );
      },
    },
    sync_product: {
      label: t('table.sync_product'),
      className: 'pw-text-center',
      width: 180,
      cell: () => {
        // return <div className="pw-text-center pw-px-2 pw-text-success-active">{<BsCheckLg size={20} />}</div>;
        return <div className="pw-text-center pw-px-2 pw-text-error-active">{<MdClose size={20} />}</div>;
      },
    },
    sync_inventory: {
      label: t('table.sync_inventory'),
      className: 'pw-text-center',
      width: 180,
      cell: () => {
        return <div className="pw-text-center pw-px-2 pw-text-error-active">{<MdClose size={20} />}</div>;
      },
    },
    sync_order: {
      label: t('table.sync_order'),
      className: 'pw-text-center',
      width: 180,
      cell: () => {
        return <div className="pw-text-center pw-px-2 pw-text-error-active">{<MdClose size={20} />}</div>;
      },
    },
    status: {
      width: 158,
      label: t('table.status'),
      className: 'pw-text-center',
      cell: () => {
        return <div className="pw-text-center pw-px-2 pw-text-error-active">{generateStatus()}</div>;
      },
    },
    action: {
      width: 164,
      label: t('table.action'),
      className: 'pw-text-center',
      cell: ({ rowData }: { rowData: EcomShop }) => {
        return (
          <div className="pw-flex pw-justify-around">
            <TooltipButton
              type={ActionType.SYNC_PRODUCT}
              onClick={() => onClick({ type: ActionType.SYNC_PRODUCT, rowData })}
            />
            <TooltipButton
              type={ActionType.SYNC_ORDER}
              onClick={() => onClick({ type: ActionType.SYNC_ORDER, rowData })}
            />
            <TooltipButton
              type={ActionType.SYNC_SETTING}
              onClick={() => onClick({ type: ActionType.SYNC_SETTING, rowData })}
            />
            <TooltipButton
              placement="autoVerticalEnd"
              type={ActionType.CONNECT_STORE}
              onClick={() => onClick({ type: ActionType.CONNECT_STORE, rowData })}
            />
          </div>
        );
      },
    },
  };
};
