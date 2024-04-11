import cx from 'classnames';
import { BsClock, BsCurrencyDollar } from 'react-icons/bs';
import { MdDeck } from 'react-icons/md';
import { enUS, vi } from 'date-fns/locale';
import { formatDistanceToNowStrict } from 'date-fns';
import { Tooltip, Whisper } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { TableStatus } from '~app/features/table/constants';
import { numberFormat } from '~app/configs';
import { Language } from '~app/i18n/enums';

const TableItem = ({ item, onClick }: { item: TableItem; onClick(item: TableItem): void }) => {
  const { i18n } = useTranslation('table');
  return (
    <Whisper
      placement="autoVertical"
      trigger="hover"
      speaker={<Tooltip arrow={false}>{item.title}</Tooltip>}
      onClick={() => onClick(item)}
    >
      <div
        className={cx('pw-rounded pw-cursor-pointer pw-bg-white pw-text-black pw-p-3', {
          '!pw-bg-primary-main pw-text-white': item.status === TableStatus.USING,
        })}
      >
        <div className="pw-font-bold pw-text-base line-clamp-1 !pw-block pw-text-ellipsis">{item.title}</div>
        <div className="pw-h-20 pw-pt-4">
          {item.status === TableStatus.USING ? (
            <>
              <div className="pw-flex pw-items-center pw-mb-2">
                <div className="pw-mr-2">
                  <BsClock size="16" />
                </div>
                <div className="pw-font-semibold pw-text-base">
                  {formatDistanceToNowStrict(new Date(item?.reservation?.created_at || ''), {
                    addSuffix: true,
                    locale: i18n.language === Language.VI ? vi : enUS,
                  })}
                </div>
              </div>
              <div className="pw-flex pw-items-center">
                <div className="pw-mr-2 ">
                  <BsCurrencyDollar size="16" />
                </div>
                <div className="pw-font-semibold pw-text-base">
                  {numberFormat.format(item.reservation?.order_info.total_price || 0)}
                </div>
              </div>
            </>
          ) : (
            <div className="pw-flex pw-items-center pw-justify-center">
              <div className="pw-flex pw-items-center">
                <div className="pw-mr-2 pw-text-2xl">
                  <MdDeck size="40" className="pw-text-neutral-disable" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Whisper>
  );
};

export default TableItem;
