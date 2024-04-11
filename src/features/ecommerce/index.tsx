import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'rsuite';
import { useLocation, useSearchParams } from 'react-router-dom';
import { BenefitPopup, TableHeaderAction } from './components';
import { columnOptions } from './config';
import { CommingSoonModal, Message, Table } from '~app/components';
import { FIRST_TIME_ECOMMERCE } from '~app/configs';
import {
  useShopeeAccessTokenQuery,
  useLazadaAccessTokenQuery,
  useTiktokAccessTokenQuery,
  useEcommerceAuthLinkQuery,
  useEcomShopsQuery,
} from '~app/services/queries';
import { getQueryParams } from '~app/utils/helpers';
import { EmptyStateEcommerce } from '~app/components/Icons';

export enum PlatformKey {
  SHOPEE = 'Shopee',
  LAZADA = 'Lazada',
  TIKTOK = 'Tiktok',
}

export enum ActionType {
  SYNC_PRODUCT = 'sync_product',
  SYNC_ORDER = 'sync_order',
  SYNC_SETTING = 'sync_setting',
  CONNECT_STORE = 'connect_store',
}

const Ecommerce = () => {
  const { t } = useTranslation('ecommerce');
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const tableRef = useRef<ExpectedAny>();
  const firstTime = localStorage.getItem(FIRST_TIME_ECOMMERCE);
  const [openModal, setOpenModal] = useState(!firstTime ? true : false);
  const [platform, setPlatform] = useState('');
  const [commingSoon, setCommingSoon] = useState(false);
  const [paramsAccessToken, setParamsAccessToken] = useState<ExpectedAny>(null);
  const { data: shopeeAccessToken } = useShopeeAccessTokenQuery({ ...paramsAccessToken });
  const { data: lazadaAccessToken } = useLazadaAccessTokenQuery({
    ...paramsAccessToken,
    enabled: paramsAccessToken && Object.keys(paramsAccessToken).length === 1,
  });
  const { data: tiktokAccessToken } = useTiktokAccessTokenQuery({ ...paramsAccessToken });
  const { data: authLink } = useEcommerceAuthLinkQuery(platform);

  useEffect(() => {
    if (authLink) {
      // change redirect url
      const urlObject = getQueryParams(authLink);
      if (platform === PlatformKey.SHOPEE) {
        urlObject.redirect = window.location.href;
        const preAuthLink = authLink.split('?');
        const paramsAuthLink = new URLSearchParams(urlObject).toString();
        const newAuthLink = preAuthLink[0] + '?' + paramsAuthLink;
        window.open(newAuthLink, '_self');
        return;
      }
      window.open(authLink, '_self');
    }
  }, [authLink]);

  useEffect(() => {
    if (location.search) {
      // get all params from redirect url
      const code = searchParams.get('code') as string;
      const shop_id = searchParams.get('shop_id') as string;
      const state = searchParams.get('state') as string;
      setParamsAccessToken({ code, shop_id, state });
    }
  }, [platform, location.search]);

  useEffect(() => {
    // reset url (remove params ecommerce)
    if (shopeeAccessToken || lazadaAccessToken || tiktokAccessToken) {
      window.history.pushState({}, '', window.location.origin + window.location.pathname);
    }
  }, [shopeeAccessToken, lazadaAccessToken, tiktokAccessToken]);

  const handleClose = () => {
    setOpenModal(false);
    !firstTime && localStorage.setItem(FIRST_TIME_ECOMMERCE, 'false');
  };

  const handleClick = () => {
    setCommingSoon(true);
  };

  return (
    <div>
      <Message type="info" className="pw-rounded pw-py-2.5 pw-mb-2">
        <div className="pw-flex pw-items-center pw-justify-between pw-w-full">
          <span className="pw-text-sm">{t('message_description')}</span>
          <Button
            appearance="primary"
            className="!pw-text-sm !pw-font-bold !pw-bg-info-active !pw-px-4"
            onClick={() => setOpenModal(true)}
          >
            {t('action.benefit_details')}
          </Button>
        </div>
      </Message>
      <Table<ExpectedAny, ExpectedAny>
        ref={tableRef}
        columnOptions={columnOptions({ onClick: handleClick })}
        query={useEcomShopsQuery}
        emptyIcon={<EmptyStateEcommerce />}
        emptyDescription={t('empty_ecommerce')}
        headerButton={<TableHeaderAction setPlatform={setPlatform} />}
      />
      {openModal && <BenefitPopup open={openModal} setPlatform={setPlatform} onClose={handleClose} />}
      {commingSoon && <CommingSoonModal open={true} onClose={() => setCommingSoon(false)} />}
    </div>
  );
};

export default Ecommerce;
