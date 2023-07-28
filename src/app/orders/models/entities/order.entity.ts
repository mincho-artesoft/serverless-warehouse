import * as dynamoose from 'dynamoose';

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
export const Order = dynamoose.model('Orders', odrderSchema);
