import prisma from "@/app/lib/prisma";
import { builder } from "../builder";
builder.prismaObject("product_image", {
  fields: (t) => ({
    id: t.exposeID("id"),
    product_id: t.exposeID("product_id"),
    image: t.exposeString("image", { nullable: true }),
  }),
});

builder.queryField("productImages", (t) =>
  t.prismaField({
    type: ["product_image"],
    resolve: (query, __parent, __args, _ctx, _info) =>
      prisma.product_image.findMany({ ...query }),
  })
);

builder.mutationField("deleteProductImage", (t) =>
  t.prismaField({
    type: "product_image",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { id } = args;
      try {
        return await prisma.product_image.delete({
          ...query,
          where: {
            id: Number(id),
          },
        });
      } catch (e) {
        throw new Error("Failed to delete product image");
      }
    },
  })
);
