export type SkuSearch = Sku & {
  product_id: string;
  product_name: string;
  sold_quantity: number;
  product_images: string[];
  product_type: string;
};
