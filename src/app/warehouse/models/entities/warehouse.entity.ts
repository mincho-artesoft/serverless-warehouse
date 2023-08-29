import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ObjectId } from 'mongodb';

@Entity('warehouse')
export class Warehouse {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column('json', { default: {}, nullable: false })
  name: any;

  @Column({ default: '', nullable: false })
  brand_name: string;

  @Column('json', { default: {}, nullable: false })
  description: any;

  @Column({ default: 'global', nullable: false })
  organizationId: string;

  @Column({ nullable: false })
  unit: string;

  @Column({ default: 0, nullable: false })
  quantity: number;

  @Column('simple-array', { default: [''], nullable: false })
  tags: string[];

  @Column({ default: 0, nullable: false })
  price: number;

  @Column('json', { default: [], nullable: false })
  currentProducts: { quantity: number; expirationDate: Date }[];

  @Column('json', { default: [], nullable: false })
  ingredients: { quantity: number; productId: string }[];

  @Column('json', { default: [] })
  images: { key: string; value: string }[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

/* import * as dynamoose from 'dynamoose';

const warehouseSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    name: {
      type: Array,
      default: [],
      schema: [
        {
          type: Object,
          schema: {
            key: String,
            value: String,
          },
        },
      ],
      required: true,
    },
    brand_name: {
      type: String,
      default: '',
      required: false,
    },
    description: {
      type: Array,
      default: [],
      schema: [
        {
          type: Object,
          schema: {
            key: String,
            value: String,
          },
        },
      ],
      required: false,
    },
    organizationId: {
      type: String,
      default: 'global',
      required: false,
    },
    unit: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
      required: false,
    },
    tags: {
      type: Array,
      default: [''],
      schema: [String],
      required: false,
    },
    price: {
      type: Number,
      default: 0,
      required: false,
    },
    currentProducts: {
      type: Array,
      default: [],
      schema: [
        {
          type: Object,
          schema: {
            quantity: Number,
            expirationDate: {
              type: {
                value: Date,
                settings: {
                  storage: 'iso',
                },
              },
            },
          },
        },
      ],
      required: false,
    },
    ingredients: {
      type: Array,
      default: [],
      schema: [
        {
          type: Object,
          schema: {
            quantity: Number,
            productId: String,
          },
        },
      ],
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: {
        created_at: {
          type: {
            value: Date,
            settings: {
              storage: 'iso',
            },
          },
        },
      },
      updatedAt: {
        updated_at: {
          type: {
            value: Date,
            settings: {
              storage: 'iso',
            },
          },
        },
      },
    },
  }
);
export const Warehouse = dynamoose.model('Warehouse', warehouseSchema);
 */
