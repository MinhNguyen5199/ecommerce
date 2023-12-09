import React, { useEffect, useState } from "react";
import CardProduct from "./CardProduct";
import { gql, useQuery } from "@apollo/client";
import { category } from "@prisma/client";

/////
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

// FirebaseUI config.

/////

export const listCategories = gql`
  query {
    categories {
      id
      name
      product {
        id
        name
        description
        price
        product_image {
          id
          image
        }
      }
    }
  }
`;

export default function Categories() {
  const [minh, setMinh] = useState("ALL");
  const { data, loading, error } = useQuery(listCategories);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  
  function setCategoryName(e: any) {
    setMinh(e.target.textContent);
  }
  var red = "pink";
  return (
    <div>
      <div className="flex flex-wrap gap-8 justify-center py-10">
      <button
            onClick={setCategoryName}
            type="button"
            className={`py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-${red}-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800`}
          >
            ALL
          </button>
        {data.categories.map((category: category) => (
          <button
            key={category.id}
            onClick={setCategoryName}
            type="button"
            className={`py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-${red}-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <CardProduct minh={minh} />
    </div>
  );
}
