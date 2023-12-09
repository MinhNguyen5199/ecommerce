import prisma from "@/app/lib/prisma";
import { builder } from "../builder";
import stripe from "@/app/lib/stripe";
builder.prismaObject("users_payment", {
  fields: (t) => ({
    id: t.exposeID("id"),
    user: t.relation("user"),
    amount: t.exposeFloat("amount"),
    createdAt: t.field({
      type: "String",
      resolve: (root) => root.createdAt.toISOString()
    }),
    paymentIntent: t.exposeString("paymentIntent"),
  }),
});


builder.mutationField('createPaymentIntent', (t) =>
  t.prismaField({
    type: 'users_payment',
    args: {
      userId: t.arg.string({required: true}),
      amount: t.arg.float({required: true}),
      paymentMethodId: t.arg.string({required: true}),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { userId, amount, paymentMethodId } = args;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects the amount in cents
        payment_method: paymentMethodId,
        currency: 'usd',
        
        
      });
      
      if (!paymentIntent) {
        throw new Error("Failed to create payment intent");
      }
      if(paymentIntent.status === 'requires_confirmation'){
      const createdPayment = await prisma.users_payment.create({
        ...query,
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          amount,
          paymentIntent: paymentIntent.id,
        },
      });

      return {
        id : paymentIntent.client_secret ? paymentIntent.client_secret : createdPayment.id,
        user_id: createdPayment.user_id,
        createdAt: createdPayment.createdAt,
        amount: createdPayment.amount,
        paymentIntent: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      };
    }else{
      throw new Error("Failed to create payment intent");
    }
    
    },
  })
);

// builder.mutationField('createPaymentIntent', (t) =>
//   t.prismaField({
//     type: 'users_payment',
//     args: {
//       userId: t.arg.string({required: true}),
//       amount: t.arg.float({required: true}),
//       paymentMethodId: t.arg.string({required: true}),
//     },
//     resolve: async (query, _parent, args, _ctx, _info) => {
//       const { userId, amount, paymentMethodId } = args;
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: Math.round(amount * 100), // Stripe expects the amount in cents
//         payment_method: paymentMethodId,
//         currency: 'usd',
//         confirm: true, // Automatically confirm the payment
//         automatic_payment_methods: {
//           enabled: true,
//           allow_redirects: 'never',
//         },
//       });

//       // Only create the record if the payment was successful
//       if (paymentIntent.status === 'succeeded') {
//         const createdPayment = await prisma.users_payment.create({
//           data: {
//             user: {
//               connect: {
//                 id: userId,
//               },
//             },
//             amount,
//             paymentIntent: paymentIntent.id,
            
//           },
//         });

//         return {
//           id: createdPayment.id,
//   amount: paymentIntent.amount,
//   clientSecret: paymentIntent.client_secret,
//         };
//       } else {
//         throw new Error('Payment failed');
//       }
//     },
//   })
// );