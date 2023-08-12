import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ObjectId } from 'mongodb';

@Entity('Orders')
export class Order {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  organizationId: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  status: string;

  @Column({ nullable: false })
  paymentMethod: string;

  @Column({ nullable: false })
  paymentStatus: string;

  @Column({ type: 'json', nullable: false })
  products: { id: string; quantity: number }[];

  @Column({ type: 'timestamptz', nullable: false })
  deliveryDate: Date;

  @Column({ type: 'json', nullable: false })
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: number;
    country: string;
    latitude: number;
    longitude: number;
  };

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

const odrderSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    userId:{
      type: String,
      required: true,
    },
    organizationId:{
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    peymentMethod: {
      type: String,
      required: true,
    },
    peymentStatis: {
      type: String,
      required: true,
    },
    products: {
      type: Array,
      default: [],
      schema: [
        {
          type: Object,
          schema: {
            id: String,
            quantity: Number,
          },
        },
      ],
      required: true,
    },
    deliveryDate: {
      required: true,
      type: {
        value: Date,
        settings: {
          storage: 'iso',
        },
      },
    },
    address: {
      type: Object,
      schema: {
        street: String,
        city: String,
        state: String,
        zipCode: Number,
        country: String,
        location: {
          type: Object,
          schema: {
            latitude: Number,
            longitude: Number,
          },
        },
      },
      required: true,
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
export const Order = dynamoose.model('Orders', odrderSchema); */
