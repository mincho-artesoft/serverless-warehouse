import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ObjectId } from 'mongodb';
@Entity('warehouse_transaction')
export class WarehouseTransaction {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ nullable: false })
  warehouseId: string;

  @Column({ nullable: false })
  quantity: number;

  @Column()
  type: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  constructor(warehouseId:string, quantity:number, type?:string) {
    this.warehouseId = warehouseId;
    this.quantity = quantity;
    this.type = type;
}
}
/* import * as dynamoose from 'dynamoose';

const transactionSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    warehouseId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    type:{
      type: String,
      required: false,
    }
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
export const WarehouseTransactio = dynamoose.model(
  'WarehouseTransactios',
  transactionSchema
); */
