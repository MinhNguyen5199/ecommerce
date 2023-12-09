"use client";
import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Carousel } from "@material-tailwind/react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { listOrderItems, olddata } from "../components/Header";
import { UserAuth } from "../providers/AuthProvider";
import { createOrderItem } from "../components/CardProduct";

const listProduct = gql`
  query listProduct($name: String) {
    product(name: $name) {
      id
      price
      views
      description
      product_image {
        id
        image
      }
    }
  }
`;

const updateProduct = gql`
  mutation updateProduct($id: Int!, $views: Int) {
    updateProduct(id: $id, views: $views) {
      id
      views
    }
  }
`;

export default function Product({
  params: { product },
}: {
  params: { product: string };
}) {
  const [isOverlayVisible, setOverlayVisible] = useState(true);
  let replaceProduct = product.replace(/%20/g, " ");
  const [updateProductMutation] = useMutation(updateProduct);
  const [CreateUserOrder, loading1] = useMutation(createOrderItem);
  const authUser = UserAuth();
  const { data, loading, error } = useQuery(listProduct, {
    variables: { name: replaceProduct },
    onCompleted: (data) => {
      updateProductMutation({
        variables: {
          id: parseInt(data.product[0].id),
          views: data.product[0].views + 1,
        },
      });
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  if(data.product.length===0){
    return <p>Product not found</p>;
  }

  function doesProductObjectExistInCart(userId: any, productToCheck: any) {
    let exist = false;
    olddata.order_items.map((item: any) => {
      if (item.user.id === userId) {
        if (parseInt(item.product.id) === productToCheck) {
          exist = true;
          return exist;
        }
      }
    });
    return exist;
  }

  function createOrder(node: any) {
    if (doesProductObjectExistInCart(authUser.user?.uid, parseInt(node.id))) {
      toast.error("Item already in Cart!");
    } else {
      CreateUserOrder({
        variables: {
          user: authUser.user?.uid,
          product: parseInt(node.id),
          quantity: 1,
        },
      });
      setOverlayVisible(false);
      // You can perform your desired action here

      // Simulate a 1-second delay before re-enabling interaction
      setTimeout(() => {
        setOverlayVisible(true);
      }, 3000);
      toast.success("Item added to Cart!");
    }

    // CreateUserOrder({variables: {user: authUser.user?.uid, product: parseInt(node.id), quantity: 1}})
    //   toast.success('Item added to Cart!');
  }

  return (
    <div className="flex flex-wrap gap-8 justify-center py-8">
      <div>
        <Toaster />
      </div>
      <Carousel className=" w-[40rem] xl:-ml-[20rem]">
        {Array.from(
          new Set(
            data?.product[0]?.product_image.map((item: any) => item.image)
          ) as unknown as string[]
        ).map((image: string, index: number) => (
          <Image
            key={index} // Use index as key because image URLs are unique now
            src={image}
            alt={`Product Image ${index}`}
            width={1000}
            height={1000}
            priority={true}
            quality={100}
            className="mx-auto h-[20rem] w-[34rem] rounded-xl"
          />
        ))}
      </Carousel>
      {data?.product?.map((product: any) => (
        <div key={product.id}>
          <div className="font-black font-mono text-3xl capitalize text-green-500 mb-5">
            {replaceProduct}
          </div>
          <div className="font-black font-mono text-3xl capitalize text-green-500 mb-5">
            {product.description}
          </div>
          <div className="mb-10">
            Price:{" "}
            <span className="font-black font-mono text-3xl capitalize text-red-500 ">
              ${product.price}
            </span>
          </div>
          {isOverlayVisible ? (
            <button
              onClick={() => createOrder(product)}
              className="btn btn-primary bg-pink-500 mt-7 mr-5"
            >
              Buy Now !
            </button>
          ) : (
            <span className="loading loading-infinity loading-lg btn btn-primary bg-pink-500 mt-7 mr-5"></span>
          )}
        </div>
      ))}
    </div>
  );
}
