import { useSyncExternalStore, memo, useMemo } from 'react';
import { Popover, Whisper } from 'rsuite';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@rsuite/icons/Search';
import SearchData from './SearchData';
import { locationStore } from '~app/features/pos/stores';
import { DebouncedInput, TextInput } from '~app/components';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { useSelectedOrderStore } from '~app/features/pos/hooks';
import { formatSelectLocation, initialLocation } from '~app/features/pos/utils';
import { generateFullLocation } from '~app/utils/helpers';
import { RequestType } from '~app/features/pos/constants';

const SearchLocationInput = () => {
  const { t } = useTranslation('pos');
  const { offlineModeWorker } = useOfflineContext();
  const [buyerInfo, setBuyerInfo] = useSelectedOrderStore((store) => store.buyer_info);
  const locations = useSyncExternalStore(locationStore.subscribe, locationStore.getSnapshot);

  const fullLocation = useMemo(
    () => generateFullLocation({ location: buyerInfo?.address_info, showAddress: false }),
    [buyerInfo],
  );

  const handleChangeAddressDetail = (value: string) => {
    setBuyerInfo((prevState) => {
      return {
        ...prevState,
        buyer_info: {
          ...prevState.buyer_info,
          address_info: {
            ...(prevState.buyer_info.address_info || initialLocation(prevState.buyer_info.address_info)),
            address: value,
          },
        },
      };
    });
  };

  return (
    <div>
      <Whisper
        placement="autoVerticalEnd"
        trigger="click"
        speaker={({ onClose, left, top, className }, ref) => {
          return (
            <Popover
              ref={ref}
              className={cx('!pw-rounded-none pw-w-96', className)}
              style={{ left, top }}
              arrow={false}
              full
            >
              <DebouncedInput
                className="pw-m-4 pw-mb-1"
                value=""
                icon="search"
                onChange={(value) => {
                  offlineModeWorker.postMessage({
                    action: RequestType.SEARCH_LOCATION,
                    value: value,
                  });
                }}
                placeholder={t('placeholder.input_location') || ''}
              />
              <SearchData
                data={locations}
                onClick={(newLocation: AddressLocation) => {
                  const location = formatSelectLocation(newLocation);
                  const newAddressInfo = buyerInfo.address_info
                    ? { ...buyerInfo.address_info, ...location }
                    : initialLocation();
                  setBuyerInfo((prevState) => ({
                    ...prevState,
                    buyer_info: {
                      ...prevState.buyer_info,
                      address_info: newAddressInfo,
                    },
                  }));
                  onClose();
                }}
              />
            </Popover>
          );
        }}
      >
        <div className="pw-flex pw-items-center pw-mb-3 pw-border pw-neutral-border pw-rounded-md pw-py-1.5 pw-px-3 pw-cursor-pointer">
          <SearchIcon className="pw-mr-3" />
          <div className={cx('', { 'pw-text-neutral-placeholder': !fullLocation })}>
            {fullLocation || t('placeholder.select_location')}
          </div>
        </div>
      </Whisper>
      <TextInput
        name=""
        value={buyerInfo.address_info?.address}
        onChange={handleChangeAddressDetail}
        isForm={false}
        placeholder={t('address_detail') || ''}
      />
    </div>
  );
};

export default memo(SearchLocationInput);
