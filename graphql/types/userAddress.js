import prisma from "@/app/lib/prisma";
import { builder } from "../builder";
builder.prismaObject("users_address", {
  fields: (t) => ({
    id: t.exposeID("id"),
    user: t.relation("user"),
    address: t.exposeString("address", { nullable: true }),
    city: t.exposeString("city", { nullable: true }),
    postal_code: t.exposeString("postal_code", { nullable: true }),
    country: t.exposeString("country", { nullable: true }),
    province: t.exposeString("province", { nullable: true }),
  }),
});

builder.queryField("usersAddress", (t) =>
  t.prismaField({
    type: ["users_address"],
    args:{
      user_id: t.arg.string({required: true}),
    },
    resolve: async (query, __parent, __args, _ctx, _info) =>{
      const { user_id } = __args;
      return await prisma.users_address.findMany({
        ...query,
        where: {
          user_id: user_id
        }
      })
    },
  })
);

builder.mutationField("createUserAddress", (t) =>
  t.prismaField({
    type: "users_address",
    args: {
      user_id: t.arg.string({required: true}),
      address: t.arg.string({required: true}),
      city: t.arg.string({required: true}),
      postal_code: t.arg.string({required: true}),
      country: t.arg.string({required: true}),
      province: t.arg.string({required: true}),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { user_id, address, city, postal_code, country, province } = args;
      return await prisma.users_address.create({
        ...query,
        data: {
          user: {
            connect: {
              id: user_id
            }
          },
          address,
          city,
          postal_code,
          country,
          province,
        },
      });
    },
  })
);

builder.mutationField("UpdateUserAddress", (t) =>
  t.prismaField({
    type: "users_address",
    args: {
      user_id: t.arg.string({required: true}),
      address: t.arg.string({required: true}),
      city: t.arg.string({required: true}),
      postal_code: t.arg.string({required: true}),
      country: t.arg.string({required: true}),
      province: t.arg.string({required: true}),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { user_id, address, city, postal_code, country, province } = args;
      return await prisma.users_address.update({
        ...query,
        where: {
          id: user_id
        },
        data: {
          address: address,
          city: city,
          postal_code: postal_code,
          country: country,
          province: province,
        },
      });
    },
  })
);