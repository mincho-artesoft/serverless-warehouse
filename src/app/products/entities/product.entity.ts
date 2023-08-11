import { Entity, Column,ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { ObjectId } from 'mongodb';

@Entity('products')
export class Product {

  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  id: number;

  @Column()
  product_code: string;

  @Column()
  name_bg: string;

  @Column()
  name_en: string;

  @Column()
  brand_name_bg: string;

  @Column()
  brand_name_en: string;

  @Column()
  times_sold_1m: number;

  @Column()
  quantity_sold_1m: number;

  @Column()
  description_bg: string;

  @Column()
  description_en: string;

  @Column()
  unit_weight_text_value_en: string;

  @Column()
  unit_weight_text_value_bg: string;

  @Column()
  unit_weight_value: number;

  @Column()
  url_slug_bg: string;

  @Column()
  url_slug_en: string;

  @Column()
  status: number;

  @Column()
  flags: number;

  @Column()
  is_available: boolean;

  @Column()
  price: number;

  @Column()
  price_promo: number;

  @Column()
  current_price: number;

  @Column()
  unit_type_value: number;

  @Column()
  unit_delta_value: number;

  @Column()
  unit_min_value: number;

  @Column()
  unit_max_value: number;

  @Column()
  unit_type_override: boolean;

  @Column()
  is_new: boolean;

  @Column()
  is_farm_product: boolean;

  @Column()
  is_bio: boolean;

  @Column()
  is_freshly_harvested: boolean;

  @Column()
  is_promo: boolean;

  @Column()
  is_frozen: boolean;

  @Column()
  is_craft: boolean;

  @Column()
  show_promo: boolean;

  @Column()
  show_offer: boolean;

  @Column()
  expected_supply_date: Date;

  @Column('json')
  hierarchical_categories_bg:{
    lv1: string;
    lv2: string;
    lv3: string;
  };

  @Column('json')
  hierarchical_categories_en:{
    lv1: string;
    lv2: string;
    lv3: string;
  };

  @Column('simple-array')
  categories_ids_ls: number[];

  @Column()
  main_category_id: number;

  @Column()
  promo_period: string;

  @Column()
  main_image_id: number;

  @Column()
  country_of_origin_bg: string;

  @Column()
  country_of_origin_en: string;

  @Column()
  expiry_date: string;

  @Column()
  image_count: number;

  @Column()
  will_delay_delivery: boolean;

  @Column()
  seo_category_bg: string;

  @Column()
  seo_category_en: string;

  @Column()
  delayed_delivery: number;

  @Column()
  product_image_absolute_url: string;

  @Column()
  available_quantity: number;

  @Column()
  vendor_ptr_id: number;

  @Column()
  category_index_lvl1: number;

  @Column()
  category_index_lvl2: number;

  @Column()
  category_index_lvl3: number;

  @Column()
  category_index_lvl4: number;

  @Column()
  objectID: string;

  @Column('json')
  _highlightResult:{
    product_code: {
        value: string,
        matchLevel: string,
        matchedWords: string[]
      },
      name_bg: {
        value: string,
        matchLevel: string,
        matchedWords: string[]
      },
      name_en: {
        value: string,
        matchLevel: string,
        matchedWords: string[]
      },
      brand_name_bg: {
        value: string,
        matchLevel: string,
        matchedWords: string[]
      },
      brand_name_en: {
        value: string,
        matchLevel: string,
        matchedWords: string[]
      },
      url_slug_bg: {
        value: string,
        matchLevel: string,
        matchedWords: string[]
      }
  };
}
