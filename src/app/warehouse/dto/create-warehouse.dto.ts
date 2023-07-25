
  export interface CreateWarehouseDto {
    id: string;
    name_en: string;
    name_bg?: string;
    brand_name_en?: string;
    brand_name_bg?: string;
    description_en?: string;
    description_bg?: string;
    ogranizationId?: string;
    unit: string;
    quantity?: number;
    tags?: string[];
    price?: number;
  }