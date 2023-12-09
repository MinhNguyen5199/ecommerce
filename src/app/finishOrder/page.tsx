"use client";
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from 'next/navigation'
import {
  DELETE_ORDER_ITEM,
  UPDATE_ORDER_ITEM,
  listOrderItems,
} from "../components/Header";
import { UserAuth } from "../providers/AuthProvider";
import Link from "next/link";
import AddressForm from "./AddressForm";
import CheckoutForm from "./CheckoutForm";


export default function FinishOrder() {
  const router = useRouter()
  const [deleteOrderItem] = useMutation(DELETE_ORDER_ITEM);

  const [updateOrderItem] = useMutation(UPDATE_ORDER_ITEM);

  const { user } = UserAuth(); 
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, []); 
  const [quantities, setQuantities] = useState<{[key: string]: string | number}>({});
  const [rememberedQuantities, setRememberedQuantities] = useState<{[key: string]: string | number}>({});


  const { data, loading, error } = useQuery(listOrderItems, {
    variables: { user_id: user?.uid },
    pollInterval: 300,
  });

  function handleChange(e: any) {
    console.log(e.target.value);
  }
  if (error) return <p>Oh no... {error.message}</p>;

  let totalPrice = data?.order_items
    ?.reduce(
      (total: any, item: any) => total + item.product.price * item.quantity,
      0
    )
    .toFixed(2);



  const handleBlur = (e:any, id:any) => {
    if (quantities[id] === "") {
      setQuantities((prev) => ({ ...prev, [id]: rememberedQuantities[id] })); // Reset the quantity to the last remembered quantity
    }
    if (quantities[id] === 0) {
      const confirmDelete = window.confirm("Do you want to delete this item?");

      if (confirmDelete) {
        deleteOrderItem({ variables: { id: parseInt(id) } });
      } else {
        // If they cancel, reset the quantity to the last remembered quantity
        setQuantities((prev) => ({ ...prev, [id]: rememberedQuantities[id] }));
      }
    }
    if(Number(quantities[id]) > 0){
      updateOrderItem({
        variables: { id: parseInt(id), quantity: Number(quantities[id]) },
      });
    }
  };

  const onChangeQuantity = (e:any, id:any) => {
    let value = e.target.value;

    // Remove any non-numeric characters and ensure it's a valid number
    value = value.replace(/[^0-9]/g, "");

    if (value === "") {
      setQuantities((prev) => ({ ...prev, [id]: "" }));
    } else {
      setQuantities((prev) => ({ ...prev, [id]: parseInt(value) }));
      if (value > 0) {
        setRememberedQuantities((prev) => ({ ...prev, [id]: parseInt(value) })); // Remember the quantity when it changes
      }
    }
  };

  function handleMinusSign(quantity: any, id: any) {
    setQuantities((prev) => ({ ...prev, [id]: quantity - 1 }));
    if (quantity - 1 <= 0) {
      deleteOrderItem({ variables: { id: parseInt(id) } });
    } else {
      updateOrderItem({
        variables: { id: parseInt(id), quantity: quantity - 1 },
      });
    }
  }

  function handlePlugSign(quantity: any, id: any) {
    updateOrderItem({
      variables: { id: parseInt(id), quantity: quantity + 1 },
    });
    setQuantities((prev) => ({ ...prev, [id]: quantity + 1 }));
  }

  return (
    <div className="flex flex-wrap gap-8 justify-center py-8">
      <div className="w-[90%] xl:w-[40%]">
        
        

          <span className="text-green-500 text-2xl font-bold ml-[40%]">
            {data?.order_items?.length} Items
          </span>
          {data?.order_items?.map((item: any) => (
            <div key={item.id}>
              <div className="flex justify-between">
                <span className="text-lg uppercase">{item.product.name}</span>
                <span className="text-lg font-bold">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <div className="text-base">Qty:</div>

                <div className="flex items-center">
                  <button
                    onClick={() => handleMinusSign(item.quantity, item.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold text-lg px-2  rounded-full transition duration-500 ease-in-out mr-3"
                  >
                    -
                  </button>
                  {/* <input
                    type="text"
                    className="w-[50px] h-[20px] text-center"
                    onInput={handleChange}
                    value={item.quantity}
                  /> */}
                  {/* <input
                    type="text"
                    className="w-[50px] h-[20px] text-center"
                    value={item.quantity}
                    onChange={(e) => onChangeQuantity(e, item.id)}
                    onBlur={handleBlur}
                  /> */}
                  <input
                    type="text"
                    className="w-[50px] h-[20px] text-center"
                    value={
                      quantities[item.id] !== undefined
                        ? quantities[item.id]
                        : item.quantity
                    }
                    onChange={(e) => onChangeQuantity(e, item.id)}
                    onBlur={(e) => handleBlur(e, item.id)}
                  />

                  <button
                    onClick={() => handlePlugSign(item.quantity, item.id)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold text-lg px-2 rounded-full transition duration-500 ease-in-out ml-3"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between">
            <span className="text-lg uppercase font-extrabold text-green-500">
              Total:
            </span>
            <span className="text-lg font-bold">${totalPrice}</span>
          </div>
        <hr className="border-yellow-900 py-3 mt-5"></hr>

        {/* /////// */}
        
      </div >
      <div className="w-[95%] xl:w-[40%]">
          <AddressForm data={data} totalPrice1={totalPrice} />
          
      
      </div>
    </div>
  );
}
