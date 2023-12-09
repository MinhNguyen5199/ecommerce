import prisma from "@/app/lib/prisma";
import { builder } from "../builder";

builder.prismaObject("product", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    description: t.exposeString("description"),
    price: t.exposeFloat("price"),
    stock: t.exposeInt("stock"),
    views: t.exposeInt("views"),
    totalSold: t.exposeInt("totalSold"),
    category: t.relation("category"),
    product_image: t.relation("product_image"),
  }),
});

builder.queryField("products", (t) => 
  t.prismaConnection({
    type: 'product',
    cursor: 'id',
    args: {stock: t.arg.int(), choice: t.arg.string(), category: t.arg.string(), userInput: t.arg.string()},
    resolve: async (query, __parent, __args, _ctx, _info) => {
      const { stock, choice, category, userInput } = __args;
      const orderBy = {};
      orderBy[choice ?? 'id'] = 'desc';
      return await prisma.product.findMany({
        ...query,
        where: {
          stock: {
            gte: stock ?? 0
          },
          name:{
            contains: userInput ?? '',
            mode: 'insensitive'
          },
          category: category ? {
            some: {
              name: category
            }
          } : undefined,
        },
        orderBy
      })
    }
  })
)

builder.queryField("product", (t) =>
  t.prismaField({
    type: ["product"],
    args: { name: t.arg.string() },
    resolve: async (query, __parent, args, _ctx, _info) => {
      const { name } = args;
      return await prisma.product.findMany({
        ...query,
        where: {
          name: name?.toString(),
        },
      });
    },
  })
);

builder.queryField("AllProducts", (t) =>
  t.prismaField({
    type: ["product"],
    args: {
      skip: t.arg.int({required: true}),
      take: t.arg.int({required: true}),
    },
    resolve: async (query, __parent, { skip, take }, _ctx, _info) => {
      return await prisma.product.findMany({
        ...query,
        skip,
        take,
      });
    },
  })
);

builder.queryField("totalProducts", (t) =>
  t.int({
    resolve: async (_parent, _args, _ctx, _info) => {
      return await prisma.product.count();
    },
  })
);



builder.mutationField("createProduct", (t) =>
  t.prismaField({
    type: "product",
    args: {
      name: t.arg.string({required: true}),
      description: t.arg.string({required: true}),
      price: t.arg.float({required: true}),
      stock: t.arg.int({required: true}),
      categories: t.arg.intList({required: true}),
      views: t.arg.int({required: true}),
      totalSold: t.arg.int({required: true}),
      product_images: t.arg.stringList({required: true}),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { name, description, price, stock, categories, views, totalSold, product_images } = args;
      try{
        const newProduct = await prisma.product.create({
          ...query,
          data: {
            name,
            description,
            price,
            stock,
            views,
            totalSold,
            category: {
              connect: categories.map(categoryId => ({ id: categoryId }))
            },
          },
        });

        const images = await prisma.product_image.createMany({
          data: product_images.map(url => ({
            product_id: newProduct.id,
            image: url,
          })),
        });

        return newProduct;
      }catch(e){
        throw new Error("Failed to create product");
      }
    },
  })
);

builder.mutationField("updateProduct", (t) =>
  t.prismaField({
    type: "product",
    args: {
      id: t.arg.int({required: true}),
      name: t.arg.string(),
      description: t.arg.string(),
      price: t.arg.float(),
      stock: t.arg.int(),
      category: t.arg.string(),
      views: t.arg.int(),
      totalSold: t.arg.int(),
      product_image: t.arg.stringList({required: false})
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { id, name, description, price, stock, category, views, totalSold, product_image } = args;
      
      // First, create the product_image outside the object literal
      if (product_image) {
        await prisma.product_image.createMany({
          data: product_image.map(url => ({
            product_id: id,
            image: url,
          })),
        });
      }

      // Then, update the product
      return await prisma.product.update({
        ...query,
        where: { id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(price && { price }),
          ...(stock && { stock }),
          ...(views && { views }),
          ...(totalSold && { totalSold }),
          ...(category && {
            category: {
              connect: {
                name: category
              }
            }
          }),
        },
      });
    },
  })
);

builder.mutationField("removeCategoryFromProduct", (t) =>
  t.prismaField({
    type: "product",
    args: {
      productId: t.arg.int({ required: true }),
      categoryName: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { productId, categoryName } = args;
      try {
        return await prisma.product.update({
          ...query,
          where: {
            id: productId,
          },
          data: {
            category: {
              disconnect: {
                name: categoryName,
              },
            },
          },
        });
      } catch (e) {
        throw new Error("Failed to remove category from product");
      }
    },
  })
);

