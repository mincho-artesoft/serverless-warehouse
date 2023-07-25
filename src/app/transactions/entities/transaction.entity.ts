import * as dynamoose from 'dynamoose';

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
export const WarehouseTransactio = dynamoose.model('WarehouseTransactios', transactionSchema);
