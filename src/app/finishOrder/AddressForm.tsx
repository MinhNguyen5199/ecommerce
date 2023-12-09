import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { UserAuth } from "../providers/AuthProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { MutationHookOptions, OperationVariables } from "@apollo/client";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

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

function AddressForm(data1: any) {
  const userAuth = UserAuth();
  const { data, loading, error } = useQuery(findUserAddress, {
    variables: { user_id: userAuth.user?.uid },
    pollInterval: 300,
  });

  //const userID= data.usersAddress[0].id;

  const [updateUserAddress] = useMutation(UPDATE_USER_ADDRESS, {
    // Add pollInterval to MutationHookOptions
    pollInterval: 300,
  } as MutationHookOptions<any, OperationVariables>);

  const [form, setForm] = useState({
    address: "",
    city: "",
    postal_code: "",
    country: "",
    province: "",
  });

  const [initialForm, setInitialForm] = useState(form);

  useEffect(() => {
    if (data && data.usersAddress.length > 0) {
      const newForm = {
        address: data.usersAddress[0].address || "",
        city: data.usersAddress[0].city || "",
        postal_code: data.usersAddress[0].postal_code || "",
        country: data.usersAddress[0].country || "",
        province: data.usersAddress[0].province || "",
      };
      setForm(newForm);
      setInitialForm(newForm);
    }
  }, [data]);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      await updateUserAddress({
        variables: {
          user_id: data.usersAddress[0].id,
          ...form,
        },
      });
    } catch (error) {
      // Handle error here
      console.log(error);
    }
  };
  const isFormChanged =
    JSON.stringify(form) !== JSON.stringify(initialForm) &&
    data &&
    data.usersAddress.length > 0;

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mb-4">
        <div className="flex justify-between">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between">
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between">
          <label>Postal code:</label>
          <input
            type="text"
            name="postal_code"
            value={form.postal_code}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between">
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between">
          <label>Province:</label>
          <input
            type="text"
            name="province"
            value={form.province}
            onChange={handleChange}
          />
        </div>

        {/* Repeat for other fields */}
        {isFormChanged && (
          <button
            type="submit"
            className="ml-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
          >
            Update
          </button>
        )}
      </form>
      <hr className="border-yellow-900 my-11 "></hr>
      <Elements stripe={stripePromise}>
        <CheckoutForm userAddress={form} data={data1} />
      </Elements>
    </div>
  );
}

export default AddressForm;
