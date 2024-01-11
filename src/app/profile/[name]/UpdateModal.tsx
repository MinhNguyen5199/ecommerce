import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import ImageUpload from "./ImageUpload";
import { gql, useMutation, useQuery } from "@apollo/client";
import Image from "next/image";
import { ImageDelete } from "./ImageDelete";
import { CreateCategory } from "./Modal";
import { listCategories } from "@/app/components/Categories";

const deleteImage = gql`
  mutation deleteProductImage($id: ID!) {
    deleteProductImage(id: $id) {
      id
    }
  }
`;

const updateProduct = gql`
  mutation updateProduct(
    $id: Int!
    $name: String
    $description: String
    $price: Float
    $stock: Int
    $category: String
    $product_image: [String!]
  ) {
    updateProduct(
      id: $id
      name: $name
      description: $description
      price: $price
      stock: $stock
      category: $category
      product_image: $product_image
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
        image
      }
    }
  }
`;

const removeCategoryFromProduct = gql`
  mutation removeCategoryFromProduct($productId: Int!, $categoryName: String!) {
    removeCategoryFromProduct(
      productId: $productId
      categoryName: $categoryName
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
        image
      }
    }
  }
`;

function parseAndValidatePrice(priceStr: string): number {
  if (typeof priceStr === "string" && /^\d*\.?\d+$/.test(priceStr)) {
    let price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      throw new Error("Price must be a positive number");
    }
    return price;
  } else {
    throw new Error("Price must contain only numbers");
  }
}

function parseAndValidateStock(stockStr: string): number {
  if (typeof stockStr === "string" && /^\d+$/.test(stockStr)) {
    let stock = parseInt(stockStr, 10);
    if (isNaN(stock) || stock < 0) {
      throw new Error("Stock must be a non-negative integer");
    }
    return stock;
  } else {
    throw new Error("Stock must contain only numbers");
  }
}

function getPublicIdFromCloudinaryUrl(url:any) {
  const urlParts = url.split("/");
  // The public ID is the part after 'upload/', so we get the index of 'upload' and then slice the array from the next index
  const uploadIndex = urlParts.indexOf('upload');
  const publicIdParts = urlParts.slice(uploadIndex + 2);
  // Join the parts to get the public ID
  const publicId = publicIdParts.join('/');
  const lastDotIndex = publicId.lastIndexOf(".");
const result = publicId.substring(0, lastDotIndex);
  return result;
}

export default function UpdateModal({ update }: { update: any }) {
  const [childData, setChildData] = useState<{ secureUrl: string }[] | null>(
    null
  );

  const { data } = useQuery(listCategories);
  const categories = data?.categories.map((item: any) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const [removeCategoryFromProductMutation, { error: error2 }] = useMutation(
    removeCategoryFromProduct
  );
  const [updateProductMutation, { loading: loading1 }] =
    useMutation(updateProduct);
  const [CreateCategoryMutation, { loading }] = useMutation(CreateCategory);
  const [deleteImageMutation] = useMutation(deleteImage);
  const [formData, setFormData] = useState({
    id: update ? update.id : "",
    name: update ? update.name : "",
    description: update ? update.description : "",
    price: update ? update.price : "",
    stock: update ? update.stock : "",
    category: update.category.map((cat: any) => ({
      value: cat.id,
      label: cat.name,
    })) as { value: Number; label: string }[],
    product_image: update ? update.product_image : "",
    // Add other fields as needed
  });
  const productID = formData.id;
  const handleChange = (event: any) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const [showModal, setShowModal] = useState(false);

  const handleTextClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  function handleCategoryChange(currentSelectedOptions: any) {
    const deletedOption = formData.category.find(
      (option) => !currentSelectedOptions.includes(option)
    );
    const lastElement =
      currentSelectedOptions[currentSelectedOptions.length - 1];
    updateProductMutation({
      variables: {
        id: parseInt(formData.id),
        category: lastElement?.label,
      },
    });

    if (deletedOption) {
      removeCategoryFromProductMutation({
        variables: {
          productId: Number(formData.id),
          categoryName: deletedOption.label,
        },
      })
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    setFormData({
      ...formData,
      category: currentSelectedOptions ? currentSelectedOptions : [],
    });
  }

  const handleDelete = (image: any) => {
    const updatedImages = formData.product_image.filter((image1:any) => image1.id !== image.id);
  // Update the state
  setFormData({ ...formData, product_image: updatedImages });
    const publicId = getPublicIdFromCloudinaryUrl(image.image);
    const deleteResult = ImageDelete(publicId);
console.log('Delete result:', deleteResult);
    deleteImageMutation({
      variables: {
        id: image.id,
      },
    });
  };

  const handleCreateCategory = (inputValue: any) => {
    CreateCategoryMutation({
      variables: {
        name: inputValue,
      },
      refetchQueries: [{ query: listCategories }],
    });
    const newOption = {
      label: inputValue,
      value: parseInt(inputValue),
    };
    setFormData({
      ...formData,
      category: [...formData.category, newOption],
    });

    updateProductMutation({
      variables: {
        id: parseInt(formData.id),
        category: inputValue,
      },
    });
  };
  const handleSubmit = (event: any) => {
    // Your form submission logic here...
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    // Convert stock to integer
    var stock = 0;
    try {
      if (typeof data.stock === "string") {
        stock = parseAndValidateStock(data.stock);
        // Continue with your logic...
      } else {
        throw new Error("Stock must be a string");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
    var price = 0;
    try {
      if (typeof data.price === "string") {
        price = parseAndValidatePrice(data.price);
        console.log(price);
        // Continue with your logic...
      } else {
        throw new Error("Price must be a string");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }

    if (childData) {
      console.log(childData);
    }
    updateProductMutation({
      variables: {
        id: parseInt(productID),
        name: data.name,
        description: data.description,
        price: price,
        stock: stock,
        product_image: childData
          ? childData.map((item: any) => item.secureUrl)
          : [],
      },
    });
  };

  return (
    <div>
      <p
        onClick={handleTextClick}
        className="cursor-pointer mr-4 text-blue-500 text-[1rem] font-bold hover:underline"
      >
        Update
      </p>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <form onSubmit={handleSubmit}>
                  <label
                    className="block text-gray-700 text-2xl font-bold"
                    htmlFor="name"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-md shadow-sm py-1 text-[1.3rem] pl-2"
                  />
                  <label
                    className="block text-gray-700 text-2xl font-bold"
                    htmlFor="description"
                  >
                    Description:
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full rounded-md shadow-sm py-1 text-[1.3rem] pl-2"
                  />
                  <label
                    className="block text-gray-700 text-2xl font-bold"
                    htmlFor="price"
                  >
                    Price:
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="block w-full rounded-md shadow-sm py-1 text-[1.3rem] pl-2"
                  />
                  <label
                    className="block text-gray-700 text-2xl font-bold"
                    htmlFor="stock"
                  >
                    Stock:
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="block w-full rounded-md shadow-sm py-1 text-[1.3rem] pl-2"
                  />
                  <label
                    className="block text-gray-700 text-2xl font-bold"
                    htmlFor="category"
                  >
                    Category:
                  </label>
                  <CreatableSelect
                    id="category"
                    isMulti
                    className="basic-multi-select text-black"
                    classNamePrefix="select"
                    options={categories}
                    value={formData.category}
                    onChange={handleCategoryChange}
                    onCreateOption={handleCreateCategory}
                    maxMenuHeight={100}
                  />
                  <label
                    className="block text-gray-700 text-2xl font-bold"
                    htmlFor="image"
                  >
                    Images:
                  </label>
                  <ImageUpload setChildData={setChildData} />
                  <div className="flex flex-wrap">
                    {formData.product_image.map((image: any) => (
                      <div key={image.id} className="relative w-1/2 p-1">
                        <Image
                          src={image.image}
                          width={500}
                          height={500}
                          alt="product_image"
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                        <p
                          onClick={() => handleDelete(image)}
                          className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full hover:cursor-pointer"
                        >
                          X
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={closeModal}
                      className="text-white bg-red-500 px-2 py-1 rounded"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="text-white bg-blue-500 px-2 py-1 rounded"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
