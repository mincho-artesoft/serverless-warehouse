import * as dynamoose from 'dynamoose';

const productSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    name_en: {
      type: String,
      required: true, 
    },
    name_bg: {
      type: String,
      required: false,
    },
    name_fr: {
        type: String,
        required: false, 
      },
    name_es: {
      type: String,
      required: false, 
    },
    type: {
        type: String,
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
export const Product = dynamoose.model('Products', productSchema);
