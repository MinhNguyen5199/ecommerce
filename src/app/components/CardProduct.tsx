import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useInView } from 'react-intersection-observer';
import {
  gql,
  useQuery,
  useMutation,
  RefetchQueriesFunction,
} from "@apollo/client";
import Product from "../[product]/page";
import { create } from "domain";
import { UserAuth } from "../providers/AuthProvider";
import toast, { Toaster } from "react-hot-toast";
import { listOrderItems, olddata } from "./Header";
import { listCategories } from "./Categories";
import { set } from "firebase/database";
import { filter } from "graphql-yoga";

const AllProductsQuery = gql`
  query allProductsQuery($first: Int, $after: ID, $stock: Int, $choice: String!, $category: String, $userInput: String) {
    products(first: $first, after: $after, stock: $stock, choice: $choice, category: $category, userInput: $userInput) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          name
          description
          price
          product_image {
            id
            image
          }
          category {
            id
            name
          }
        }
        cursor
      }
    }
  }
`;
export const createOrderItem = gql`
  mutation createOrderItem($user: String!, $product: Int!, $quantity: Int!) {
    createOrderItem(user: $user, product: $product, quantity: $quantity) {
      id
      user {
        id
      }
      product {
        id
      }
      quantity
    }
  }
`;

export default function CardProduct(minh: any) {
  const [ref, inView] = useInView();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  

  
  useEffect(() => {
    // Automatically click the button when it's in view
    if (inView && buttonRef.current) {
      buttonRef.current.click();
    }
  }, [inView]);


  const [selectedOption, setSelectedOption] = useState('views');

  const handleSelectChange = (e:any) => {
    setSelectedOption(e.target.value);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e:any) => {
    setSearchQuery(e.target.value);
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [isOverlayVisible, setOverlayVisible] = useState(true);

  const authUser = UserAuth();
  const { data, loading, error, fetchMore, refetch } = useQuery(AllProductsQuery,{variables: {first: 5, choice: selectedOption, stock: 1}});
  
  useEffect(() => {
    if(minh.minh !== 'ALL'){
    refetch({category: minh.minh });
  }else{
    refetch({category: null });
  }
  
}, [minh.minh, refetch]);

useEffect(() => {
  if(searchQuery !== ''){
    refetch({userInput: searchQuery});
  }else{
    refetch({userInput: null});
  }
}, [searchQuery, refetch]);
  

  const [CreateUserOrder, loading1] = useMutation(createOrderItem);

  function doesProductObjectExistInCart(userId: any, productToCheck: any) {
    let exist = false;
    console.log(olddata)
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

  if (loading) return <span className="loading loading-infinity btn btn-primary bg-pink-500 w-[20rem] h-[20rem]"></span>;
  if (error) return <p>Oh no... {error.message}</p>;
  const { endCursor, hasNextPage, loading2 } = data.products.pageInfo;
  if(loading2){
    return <span className="loading loading-infinity btn btn-primary bg-pink-500 w-[20rem] h-[20rem]"></span>
  }

  

  return (
    <div className="flex flex-col">
      <div className="m-auto pb-10">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleInputChange}
        className="py-2 mb-4 px-4 text-white rounded-md ml-[15%]"
      />
      <select className="py-3 px-4 pr-9 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 text-white ml-[30%]" value={selectedOption} onChange={handleSelectChange}>
        <option value="views">Most View </option>
        <option value="totalSold">Best Seller</option>
      </select>
      </div>
    <div className="flex flex-row flex-wrap gap-3 pb-10 justify-center">
      <div>
        <Toaster />
      </div>
      
      
      {data?.products?.edges?.map(({ node }: { node: any }) => (
        <div
          key={node.id}
          className="card max-w-full h-[30rem] glass bg-purple-900 hover:scale-110 hover:z-10 hover: transition hover:duration-300 "
        >
            <Link href={`${node.name}`}>
            <figure>
              {node?.product_image[0]?.image && 
              (<Image
                src={`${node?.product_image[0]?.image}`}
                width={400}
                height={400}
                alt="car!"
                quality={100}
                className="rounded-xl h-[15rem]"
              />)
              
              }
              
            </figure>
            <div className="card-body">
              <h2 className="card-title capitalize font-[900] text-3xl bg-yellow-500 bg-clip-text text-transparent">
                {node.name}
              </h2>
              <p className="text-emerald-200 font-mono font-semi text-lg ">
                {node.description}
              </p>
            </div>
            
          </Link>

          <div className="card-actions justify-between">
            <h1 className=" text-2xl text-red-500 font-bold mt-9 ml-5">
              ${node.price}
            </h1>
            {isOverlayVisible ? (
              <button
                onClick={() => createOrder(node)}
                className="btn btn-primary bg-pink-500 mt-7 mr-5"
              >
                Buy Now !
              </button>
            ) : (
              <span className="loading loading-infinity loading-lg btn btn-primary bg-pink-500 mt-7 mr-5"></span>
            )}
          </div>
        </div>
      ))}
      
    </div>
    {hasNextPage ? (
      <div>
        <button
        ref={buttonRef}
        style={{ display: 'none' }}
          className="px-4 py-2 bg-blue-500 text-white rounded my-5 m-auto"
          disabled={isButtonDisabled}
          onClick={() => {
            fetchMore({
              variables: { after: endCursor, first: 11 }, // fetch 11 items at a time
              updateQuery: (prevResult, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prevResult;
                let newEdges = fetchMoreResult.products.edges;
                // Remove the first item if it's the same as the last item in the previous result
                if (newEdges[0].node.id === prevResult.products.edges.slice(-1)[0].node.id) {
                  newEdges = newEdges.slice(1);
                }
                return {
                  products: {
                    ...fetchMoreResult.products,
                    edges: [
                      ...prevResult.products.edges,
                      ...newEdges,
                    ],
                  },
                };
              },
            });

            setIsButtonDisabled(true);
            

    // Re-enable the button after 1 second
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);

    
            
          }}
        >
        </button>
        <div ref={ref} style={{ height: '100vh' }} className="m-auto w-1/2">
          <span className="loading loading-infinity btn btn-primary bg-pink-500 w-[20rem] h-[20rem]"></span>
      </div>
        </div>
      ) : (
        <p className="my-10 text-center font-medium">
          You`&apos;`ve reached the end!{" "}
        </p>
      )}
      


      
      
    </div>
  );
}
