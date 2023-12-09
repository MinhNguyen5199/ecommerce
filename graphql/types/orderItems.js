import prisma from "@/app/lib/prisma";
import { builder } from "../builder";
builder.prismaObject("order_items", {
  fields: (t) => ({
    id: t.exposeID("id"),
    quantity: t.exposeInt("quantity"),
    order_details: t.relation("order_details"),
    product: t.relation("product"),
    user: t.relation("user"),
    isFinished: t.exposeBoolean("isFinished"),
  }),
});


builder.queryField("order_items", (t) =>
  t.prismaField({
    type: ["order_items"], // Assuming "Product" is the name of your product model
    args: { user_id: t.arg.string() },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { user_id } = args;
      return await prisma.order_items.findMany({
        ...query,
        where: {
          AND: [
            { user_id: user_id?.toString() },
            { isFinished: false },
          ],
        },
      });
    },
  })
);

builder.mutationField("createOrderItem", (t) =>
  t.prismaField({
    type: "order_items",
    args: {
      quantity: t.arg.int({required: true}),
      product: t.arg.int({required: true}),
      user: t.arg.string({required: true}),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { quantity, product, user } = args;
      return await prisma.order_items.create({
        ...query,
        data: {
          quantity,
          product:{
            connect:{
              id: product
            }
          },
          user: {
            connect: {
              id: user
            }
          },
        },
      });
    },
  })
);

builder.mutationField("updateOrderItem", (t) =>
  t.prismaField({
    type: "order_items",
    args: {
      id: t.arg.int({required: true}),
      quantity: t.arg.int({required: true}),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { id, quantity } = args;
      return await prisma.order_items.update({
        ...query,
        where: {
          id: id,
        },
        data: {
          quantity: quantity,
        },
      });
    },
  })
);

builder.mutationField("deleteOrderItem", (t) =>
  t.prismaField({
    type: "order_items",
    args: {
      id: t.arg.int({required: true}),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { id } = args;
      return await prisma.order_items.delete({
        ...query,
        where: {
          id: id,
        },
      });
    },
  })
);

builder.mutationField("finishOrderItem", (t) =>
  t.field({
    type: "Int", // Change this to a scalar type
    nullable: true,
    args: {
      user_id: t.arg.string({required: true}),
    },
    resolve: async (_parent, args, _ctx, _info) => {
      const { user_id } = args;
      const response = await prisma.order_items.updateMany({
        where: {
          user_id: user_id,
        },
        data: {
          isFinished: true,
        },
      });
      return response.count; // Return the count of updated records
    },
  })
);