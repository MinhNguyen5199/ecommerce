import React, { useEffect, useState } from "react";
import { listCategories } from "@/app/components/Categories";
import { gql, useMutation, useQuery } from "@apollo/client";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import ImageUpload from "./ImageUpload";


export const CreateCategory = gql`
  mutation createCategory($name: String!) {
    createCategory(name: $name) {
      id
      name
    }
  }
`;

const CreateProduct = gql`
  mutation createProduct(
    $name: String!
    $description: String!
    $price: Float!
    $stock: Int!
    $categories: [Int!]!
    $views: Int!
    $totalSold: Int!
    $product_images: [String!]!
  ) {
    createProduct(
      name: $name
      description: $description
      price: $price
      stock: $stock
      categories: $categories
      views: $views
      totalSold: $totalSold
      product_images: $product_images
    ) {
      id
      name
      description
      price
      stock
      category {
        id
        name
      }
      product_image {
        id
      }
    }
  }
`;

export default function Modal() {

  const [childData, setChildData] = useState<{ secureUrl: string }[] | null>(
    null
  );

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0.00,
    stock: 0,
    categories: [] as { value: Number; label: string }[],
    product_image: [] as string[],
  });

  useEffect(() => {
    if (childData) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        product_image: childData.map((image) => image.secureUrl),
      }));
    }
  }, [childData]);

  const { data, loading, error } = useQuery(listCategories);
  const [createProduct, { data: data2, loading: loading2, error: error2 }] = useMutation(CreateProduct);
  const [createCategory, { data: data1, loading: loading1, error: error1 }] =
    useMutation(CreateCategory);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  const categories = data.categories.map((item: any) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProduct({
      ...product,
      [name]: value
    });
  
    if (name === "stock") {
      const intValue = parseInt(value, 10);
      const floatValue = parseFloat(value);
  
      if (intValue < 0 || isNaN(intValue) || intValue !== floatValue) {
        alert("Invalid stock value. Please enter a non-negative integer.");
        setProduct({
          ...product,
          [name]: 0
        });
        return;
      }
      setProduct({
        ...product,
        [name]: intValue
      });
    }
  
    if (name === "price") {
      const floatValue = parseFloat(value);
  
      if (floatValue < 0 || isNaN(floatValue)) {
        alert("Invalid price value. Please enter a non-negative number.");
        setProduct({
          ...product,
          [name]: 0.00
        });
        return;
      }
      setProduct({
        ...product,
        [name]: floatValue
      });

    }
  
    
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!product.name.trim() || !product.description.trim()) {
      alert("Name and description cannot be empty.");
      return;
    }
  
    // Check if decimal and stock are not 0
    if (product.price <= 0 || product.stock <= 0) {
      alert("Price and stock cannot be 0.");
      return;
    }
  
    // Check if arrays are not empty
    if (product.categories.length === 0 || product.product_image.length === 0) {
      alert("Categories and product images cannot be empty.");
      return;
    }
    createProduct({ variables: {name: product.name, description: product.description, price: product.price, stock: product.stock, categories: product.categories.map((item) => item.value), views: 0, totalSold: 0, product_images: product.product_image} });
    if(error2){ alert("items exist")}else{
      window.location.reload();
    }
    if(loading2) return <p>Loading...</p>;
    // Handle form submission here
  };

  const handleCreate = (inputValue: any) => {
    createCategory({
      variables: { name: inputValue },
      refetchQueries: [{ query: listCategories }],
    });
    if (error1) console.log(error1);
    if (loading1) return <p>Loading...</p>;
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {};
  return (
    <div>
      <button
        type="button"
        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        data-hs-overlay="#hs-slide-down-animation-modal"
      >
        New Product
      </button>

      <div
        id="hs-slide-down-animation-modal"
        className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[60] overflow-x-hidden overflow-y-auto pointer-events-none"
      >
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
          <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white">
                Create New Product
              </h3>
              <button
                type="button"
                className="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                data-hs-overlay="#hs-slide-down-animation-modal"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="flex-shrink-0 w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <form
                id="productForm"
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              >
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Name:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="description"
                  >
                    Description:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    id="description"
                    type="text"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="price"
                  >
                    Price:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    id="price"
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    onClick={(event) => event.currentTarget.select()}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="stock"
                  >
                    Stock:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    id="stock"
                    type="number"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                    onClick={(event) => event.currentTarget.select()}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Categories:
                  </label>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    if there is no category, type in Select... to create one.
                  </label>
                  <CreatableSelect
                    id="category"
                    isMulti
                    options={categories}
                    className="basic-multi-select text-black"
                    classNamePrefix="select"
                    onChange={(selectedOptions) =>
                      setProduct((prevState) => ({
                        ...prevState,
                        categories: selectedOptions
                          ? Array.from(selectedOptions)
                          : [],
                      }))
                    }
                    onCreateOption={handleCreate}
                    value={product.categories}
                  />
                </div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Upload Images:
                </label>
                <ImageUpload setChildData={setChildData} />
              </form>
            </div>
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                data-hs-overlay="#hs-slide-down-animation-modal"
              >
                Close
              </button>
              <button
                type="submit"
                form="productForm"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
