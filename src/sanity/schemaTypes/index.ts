import { type SchemaTypeDefinition } from 'sanity'
import { productSchema } from './products'
import { categorySchema } from './categories'
import { Review } from './review'
import { OrderSchema } from './order'
import { OrderItemSchema } from './orderItem'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productSchema,categorySchema,Review,OrderSchema,OrderItemSchema],
}
