import { defineType } from "sanity";

export const Review = defineType({
    name: 'review',
    title: 'Review',
    type: 'document',
    fields: [
      {
        name: 'user',
        title: 'User Name',
        type: 'string',
      },
      {
        name: 'rating',
        title: 'Rating',
        type: 'number',
        validation: (Rule) => Rule.min(1).max(5),
      },
      {
        name: 'comment',
        title: 'Comment',
        type: 'text',
      },
      {
        name: 'date',
        title: 'Date',
        type: 'datetime',
      },
      {
        name: 'productId',
        title: 'Product ID',
        type: 'number',
      },
    ]
});