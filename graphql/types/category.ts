import prisma from "@/app/lib/prisma";
import { builder } from "../builder";

builder.prismaObject("category", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    name: t.exposeString("name"),
    product: t.relation("product"),
  }),
});

builder.queryField("categories", (t) =>
  t.prismaField({
    type: ["category"],
    resolve: (query, __parent, __args, _ctx, _info) =>
      prisma.category.findMany({ ...query }),
  })
);
builder.mutationField("createCategory", (t) =>
  t.prismaField({
    type: ["category"],
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { name } = args;
      try {
        const result = await prisma.category.create({ data: { name } });
        return [result]; // wrap the result in an array
      } catch (error) {
        throw error;
      }
    },
  })
);
