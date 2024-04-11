type EcomShop = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  ec_seller_id: string;
  seller: EcomShopSeller;
  business_id: string;
  contact_id: string;
  category_id: string;
  is_active: boolean;
};

type EcomShopSeller = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  platform_key: string;
  seller_id: string;
  seller_name: string;
  images: string[];
};
