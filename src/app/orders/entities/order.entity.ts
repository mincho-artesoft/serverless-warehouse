import * as dynamoose from 'dynamoose';

const odrderSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
        type: String,
        default: 0,
        required: true,
      },
    products: {
      type: Array,
      default: [],
      schema: [
        {
          type: Object,
          schema: {
            productsId: String,
            quantity: Number,
          },
        },
      ],
      required: true,
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
export const Order = dynamoose.model('Orders', odrderSchema);
