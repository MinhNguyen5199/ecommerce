import prisma from "@/app/lib/prisma";
import { builder } from "../builder";
builder.prismaObject("order_details", {
  fields: (t) => ({
    id: t.exposeID("id"),
    user: t.relation("user"),
    order_items: t.relation("order_items"),
    total_price: t.exposeFloat("total_price"),
    created_at: t.field({
      type: "String",
      resolve: (root) => root.created_at.toISOString()
    }),
    status: t.exposeString("status"),
  }),
});

builder.queryField("order_details", (t) => 
  t.prismaField({
    type: ["order_details"],
    resolve: (query, __parent, __args, _ctx, _info) =>
      prisma.order_details.findMany({ ...query }),
  })
);

builder.mutationField("createOrderDetail", (t) =>
  t.prismaField({
    type: "order_details",
    args: {
      user: t.arg.string({required: true}),
      total_price: t.arg.float({required: true}),
      status: t.arg.string({required: true}),
      order_items: t.arg.intList({required: true}),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { user, total_price, status, order_items } = args;
        
      try{
      return await prisma.order_details.create({
        ...query,
        data: {
          user: {
            connect: {
              id: user
            }
          },
          total_price: total_price,
          order_items: {
            connect: order_items.map(order_item_id => ({id: order_item_id}))
          },
          status,
        },
      });
    }catch(e){
      throw new Error("Failed to create order detail");
    }
    },
  })
);

builder.mutationField("updateOrderDetail", (t) =>
  t.prismaField({
    type: "order_details",
    args: {
      id: t.arg.id({ required: true }),
      status: t.arg.string({required: true}),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { id, status } = args;
      try {
        return await prisma.order_details.update({
          ...query,
          where: {
            id: Number(id),
          },
          data: {
            status: status,
          },
        });
      } catch (e) {
        throw new Error("Failed to update order detail");
      }
    },
  })
);
