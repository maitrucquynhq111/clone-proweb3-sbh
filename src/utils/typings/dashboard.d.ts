/* eslint-disable @typescript-eslint/no-explicit-any */
type ShopOverview = {
  revenue_total: number;
  profit_total: number;
  order_complete_total: number;
  order_cancel_total: number;
  order_delivering_total: number;
  order_waiting_confirm_total: number;
};

type ProductOverview = {
  sku_id: string;
  product_name: string;
  product_images: Array<string>;
  sku_name: string;
  total_amount: number;
  total_quantity: number;
};

type InventoryOverview = {
  total_amount: number;
  total_quantity: number;
  total_can_sell_quantity: number;
  total_out_of_stock_quantity: number;
};

type VisitedCustomers = {
  chart: Array<{
    index: number;
    last_period_value: null;
    time: string;
    value: number | null;
  }>;
  customer_online: number | null;
  domain: string;
  event_date: string;
  total_user_count: { last_period_value: number; value: number };
  user_onair_count: number;
  // user_onair_list: Array<number>;
};

type CashbookAnalytics = {
  chart_data_details: CashbookChart[];
  avg_per_day: number;
  compare_avg_with_last_period: number;
  compare_cash_with_last_period: number;
  remind_cash: number;
  total_cash_in: number;
  total_cash_out: number;
  total_per_categories: CategoryOverview[];
};

type CashbookChart = {
  index: number;
  time: string;
  last_period_value: number | null;
  per_value: number | null;
  value: number | null;
};

type CategoryOverview = {
  id: string;
  name: string;
  rate: number;
  total_amount: number;
};

type Banner = {
  active: true;
  created_at: string;
  end_date: string;
  id: string;
  image: string;
  link: string;
  os: string;
  position: number;
  screen: string | null;
  start_date: string;
  sub_position: number | null;
  thumbnail: string | null;
  title: string;
  type: string;
};

type OnboardingMission = {
  id: string;
  json_value: null | JsonValueMission[];
  name: string;
  object_id: string;
  object_type: string;
  setting_key: string;
  type: string;
};

type JsonValueMission = {
  key: string;
  active: boolean;
};

declare module 'react-slideshow-image' {
  export class Zoom extends React.Component<ZoomProps & any, any> {
    goBack(): void;
    goNext(): void;
    goTo(index: number): void;
  }
  export class Fade extends React.Component<SlideshowProps & any, any> {
    goBack(): void;
    goNext(): void;
    goTo(index: number): void;
  }
  export class Slide extends React.Component<SlideshowProps & any, any> {
    goBack(): void;
    goNext(): void;
    goTo(index: number): void;
  }
  export interface SlideshowProps {
    duration?: number;
    transitionDuration?: number;
    defaultIndex?: number;
    indicators?: boolean | function;
    prevArrow?: any | function;
    nextArrow?: any | function;
    arrows?: boolean;
    autoplay?: boolean;
    infinite?: boolean;
    onChange?(oldIndex: number, newIndex: number): void;
    pauseOnHover?: boolean;
    slidesToShow?: number;
    slidesToScroll?: number;
    canSwipe?: boolean;
    easing?: string;
    cssClass?: string;
  }
  export interface ZoomProps extends SlideshowProps {
    scale: number;
  }
}
