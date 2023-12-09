import prisma from "@/app/lib/prisma"
export const resolvers = {
  Query: {
    //use
    products: () => {
      return prisma.product.findMany()
    },
    //use
    productImages: () => {
      return prisma.product_image.findMany()
    },
    //use
    categories: () => {
      return prisma.category.findMany()
    },
    users: () => {
      return prisma.users.findMany()
    },
    order_details: () => {
      return prisma.order_details.findMany()
    },
    user_address: (_:any, args: any) => {
      return prisma.users_address.findMany({
        where: {
          user_id: args.user_id
        }
      })
    },
    user_payment: (_:any, args: any) => {
      return prisma.users_payment.findMany({
        where: {
          user_id: args.user_id
        }
      })
    },
    order_items: (_:any, args: any) => {
      return prisma.order_items.findMany({
        where: {
          user_id: args.user_id
        }
      })
    },
  },
  // Mutation: {
  //   createUser: async (_parent:any, args:any, _context:any) => {
  //     const { id, email, name, password, resetPasswordToken, phone_number, role } = args;
  //     return await prisma.users.create({
  //       data: {
  //         id,
  //         email,
  //         name,
  //         password,
  //         resetPasswordToken,
  //         phone_number,
  //         role,
  //       },
  //     });
  //   },
  // },
}