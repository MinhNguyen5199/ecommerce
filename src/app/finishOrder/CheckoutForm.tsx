import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { gql, useMutation, useQuery } from "@apollo/client";
import { UserAuth } from "../providers/AuthProvider";

const CREATE_PAYMENT_INTENT = gql`
  mutation createPaymentIntent(
    $userId: String!
    $amount: Float!
    $paymentMethodId: String!
  ) {
    createPaymentIntent(
      userId: $userId
      amount: $amount
      paymentMethodId: $paymentMethodId
    ) {
      id
      amount
      paymentIntent
    }
  }
`;

const createNewUserAddress = gql`
  mutation createUserAddress(
    $user_id: String!
    $address: String!
    $city: String!
    $postal_code: String!
    $country: String!
    $province: String!
  ) {
    createUserAddress(
      user_id: $user_id
      address: $address
      city: $city
      postal_code: $postal_code
      country: $country
      province: $province
    ) {
      id
      address
      city
      postal_code
      country
      province
    }
  }
`;

const UPDATE_USER_ADDRESS = gql`
  mutation UpdateUserAddress(
    $user_id: String!
    $address: String!
    $city: String!
    $postal_code: String!
    $country: String!
    $province: String!
  ) {
    UpdateUserAddress(
      user_id: $user_id
      address: $address
      city: $city
      postal_code: $postal_code
      country: $country
      province: $province
    ) {
      id
      address
      city
      postal_code
      country
      province
    }
  }
`;

const findUserAddress = gql`
  query usersAddress($user_id: String!) {
    usersAddress(user_id: $user_id) {
      id
      address
      city
      postal_code
      country
      province
    }
  }
`;

export const CreateOrderDetail = gql`
  mutation createOrderDetail(
    $user: String!
    $order_items: [Int!]!
    $total_price: Float!
    $status: String!
  ) {
    createOrderDetail(
      user: $user
      order_items: $order_items
      total_price: $total_price
      status: $status
    ) {
      id
      total_price
      status
      order_items {
        id
        product {
          id
          name
          price
        }
        quantity
      }
      user {
        id
        email
        name
      }
      created_at
    }
  }
`;

const deleteCart = gql`
  mutation finishOrderItem($user_id: String!) {
    finishOrderItem(user_id: $user_id)
  }
`;

interface CheckoutFormProps {
  userAddress: {
    address: string;
    city: string;
    postal_code: string;
    country: string;
    province: string;
  };
  data: any;
}

function CheckoutForm({ userAddress, data }: CheckoutFormProps) {
  const [createOrderDetail] = useMutation(CreateOrderDetail);
  const [createUserAddress] = useMutation(createNewUserAddress);

  const [updateUserAddress] = useMutation(UPDATE_USER_ADDRESS);
  const [deleteOrderItem, {error: error2}] = useMutation(deleteCart);
  // deleteOrderItem({
  //   variables: {
  //     user_id: "eVvNT4sUvrggRhsEstsxJrgC9zG2",
  //   },
  // });

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT);
  const [error, setError] = useState<string | null | undefined>(null);
  const { user } = UserAuth();

  const { data: data1, loading: loading1, error: error1 } = useQuery(
    findUserAddress,
    {
      variables: { user_id: user?.uid },
      pollInterval: 300,
    }
  );
  


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (Object.values(userAddress).some(value => value === '')) {
      setError('Please fill in all address fields before proceeding with payment.');
      return;
    }
    setLoading(true);
    if (!stripe || !elements) {
      // Stripe has not loaded yet, make sure to pass `loadStripe` to `Elements` in your component tree.
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      // CardElement is not loaded yet or there's an error with your Elements provider.
      return;
    }


    const { error: paymentMethodError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

    try {
      const { data: dataPayment, errors } = await createPaymentIntent({
        variables: {
          userId: user?.uid,
          amount: parseFloat(data.totalPrice1),
          paymentMethodId: paymentMethod?.id,
        },
      }); // Stripe expects the amount in cents
      const clientSecret = dataPayment.createPaymentIntent.id;

      if (paymentMethodError) {
        setError(paymentMethodError.message);
        setLoading(false);
        return;
      }

      const { error: confirmationError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod?.id,
        }
      );

      setLoading(false);

      if (confirmationError) {
        setError(confirmationError.message);
        setLoading(false);
        return;
      } else {
        

        if (data1.usersAddress.length===0) {
          createUserAddress({
            variables: {
              user_id: user?.uid,
              address: userAddress.address,
              city: userAddress.city,
              postal_code: userAddress.postal_code,
              country: userAddress.country,
              province: userAddress.province,
            },
          });
        }

        const ids = data.data.order_items.map((item:any )=> parseInt(item.id));

      createOrderDetail({
        variables: {
          user: user?.uid,
          order_items: ids,
          total_price: parseFloat(data.totalPrice1),
          status: "pending",
        },
      }).then(() => {
        deleteOrderItem({variables: {user_id: user?.uid}})
      }).catch((error) => {
        console.error('An error occurred:', error);
        console.log("error5")
      });
          
        setError("You have successfully paid!");
      }
    } catch (error) {
      console.log(error)
      

      setError("Invalid Card Details");
      setLoading(false);
      return;
    }
  };
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label
            className="block uppercase tracking-wide text-xs font-bold mb-2 text-white"
            htmlFor="card-element"
          >
            Card Details
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <CardElement
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              options={{
                style: {
                  base: {
                    fontSize: "20px",
                    color: "#ffffff",
                    "::placeholder": {
                      color: "#ffffff",
                    },
                    iconColor: "#ffffff",
                  },
                  invalid: {
                    color: "#fa755a",
                    iconColor: "#fa755a",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="spinner">Processing...</div>
      ) : (
        <button
          type="submit"
          disabled={!stripe}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Pay
        </button>
      )}
      {error && (
        <div className="error text-center py-3 text-red-500 font-extrabold">
          {error}
        </div>
      )}
    </form>
  );
}

export default CheckoutForm;
