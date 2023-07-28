import * as dynamoose from 'dynamoose';

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
    ogranizationId: {
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
