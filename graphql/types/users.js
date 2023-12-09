import prisma from "@/app/lib/prisma";
import { builder } from "../builder";
builder.prismaObject("users", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.field({
      type: "String",
      resolve: (root) => root.createdAt.toISOString()
    }),
    email: t.exposeString("email"),
    name: t.exposeString("name", { nullable: true }),
    password: t.exposeString("password", { nullable: true }),
    resetPasswordToken: t.exposeString("resetPasswordToken", { nullable: true }),
    phone_number: t.exposeString("phone_number", { nullable: true }),
    users_payment: t.relation("users_payment"),
    users_address: t.relation("users_address"),
    order_details: t.relation("order_details"),
    order_items: t.relation("order_items"),
    role: t.exposeInt("role"),
  }),
});

builder.queryField("findAllUsers", (t) =>
  t.prismaField({
    type: ["users"],
    resolve: async (query, __parent, _ctx, _info) => {
      return await prisma.users.findMany({ ...query
      });
    },
  })
);

builder.queryField("totalUsers", (t) =>
  t.int({
    resolve: async (_parent, _args, _ctx, _info) => {
      return await prisma.users.count();
    },
  })
);

builder.mutationField("createUser", (t) =>
  t.prismaField({
    type: "users",
    args:{
      id: t.arg.string({required: true}),
      email: t.arg.string({required: true}),
      name: t.arg.string({required: true}),
      password: t.arg.string(),
      resetPasswordToken: t.arg.string(),
      phone_number: t.arg.string(),
      role: t.arg.int({required: true}),
    },
    resolve: async (query, __parent, args, _ctx, _info) => {
      const { id, email, name, password, resetPasswordToken, phone_number, role } = args;
      return await prisma.users.create({
        ...query,
        data: {
          id,
          email,
          name,
          password,
          resetPasswordToken,
          phone_number,
          role,
        },
      });
    }
  })
);

builder.queryField("findUser", (t) =>
  t.prismaField({
    type: "users",
    args:{
      id: t.arg.string({required: true}),
    },
    resolve: async (query, __parent, { id }, _ctx, _info) => {
      const user = await prisma.users.findUnique({
        ...query,
        where: {
          id: id
        }
      });
    
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
    
      return user;
    }
  })
);