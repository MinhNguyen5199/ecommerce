import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Modal from "./Modal";
import UpdateModal from "./UpdateModal";

const LIST_ALL_PRODUCTS = gql`
  query ListAllProducts($skip: Int!, $take: Int!) {
    AllProducts(skip: $skip, take: $take) {
      id
      name
      description
      price
      stock
      category {
        id
        name
      }
      views
      totalSold
      product_image {
        id
        product_id
        image
      }
    }
    totalProducts
  }
`;
const ITEMS_PER_PAGE = 5;
export default function ProductTable() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const { data, loading, error } = useQuery(LIST_ALL_PRODUCTS, {
    variables: { skip: (page - 1) * ITEMS_PER_PAGE, take: ITEMS_PER_PAGE }, pollInterval: 300,
  });

  const filteredProducts = data?.AllProducts.filter(
    (product: { name: string }) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [sortColumn, setSortColumn] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (column:any) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedProducts = [...(filteredProducts || [])].sort((a, b) =>
    sortOrder === "asc"
      ? a[sortColumn] - b[sortColumn]
      : b[sortColumn] - a[sortColumn]
  );

  if (loading) return <p>Loading...</p>;

  if (error) {
    console.log(error);
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    const totalProducts = data?.totalProducts || 0;
    const productsFetched = page * ITEMS_PER_PAGE;
    if (productsFetched < totalProducts) {
      setPage(page + 1);
    }
  };

  const handlePageChange = (page: any) => {
    setPage(page);
  };

  const totalPages = Math.ceil(data?.totalProducts / ITEMS_PER_PAGE);


  return (
    <div>
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg divide-y divide-gray-200 dark:border-gray-700 dark:divide-gray-700">
            <div className="flex justify-between py-3 px-4">
  <div className="relative max-w-xs inline-block">
    <label className="sr-only">Search</label>
    <input
      type="text"
      name="hs-table-with-pagination-search"
      id="hs-table-with-pagination-search"
      className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
      placeholder="Search for Product Name"
      value={searchTerm}
      onChange={handleSearchChange}
    />
    <div className="absolute top-3 start-0 flex items-center pointer-events-none ps-3">
      <svg
        className="h-4 w-4 text-gray-400"
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
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </div>
  </div>
    <Modal/>
  
</div>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase cursor-pointer"
                        onClick={() => handleSort("price")}
                      >
                        Price{" "}
                        {sortColumn === "price" && (
                          <span style={{ display: "block" }}>
                            {sortOrder === "asc"
                              ? "(Ascending)"
                              : "(Descending)"}
                          </span>
                        )}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase cursor-pointer"
                        onClick={() => handleSort("stock")}
                      >
                        Stock{" "}
                        {sortColumn === "stock" && (
                          <span style={{ display: "block" }}>
                            {sortOrder === "asc"
                              ? "(Ascending)"
                              : "(Descending)"}
                          </span>
                        )}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase cursor-pointer"
                        onClick={() => handleSort("views")}
                      >
                        Views
                        {sortColumn === "views" && (
                          <span style={{ display: "block" }}>
                            {sortOrder === "asc"
                              ? "(Ascending)"
                              : "(Descending)"}
                          </span>
                        )}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase cursor-pointer"
                        onClick={() => handleSort("totalSold")}
                      >
                        Total Sold{" "}
                        {sortColumn === "totalSold" && (
                          <span style={{ display: "block" }}>
                            {sortOrder === "asc"
                              ? "(Ascending)"
                              : "(Descending)"}
                          </span>
                        )}
                      </th>

                      <th
                        scope="col"
                        className="px-8 py-3 text-end text-xs font-medium text-gray-900 uppercase"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedProducts.map((product: any) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white dark:text-gray-200">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          {product.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          {product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          {product.stock}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          {product.category?.map((category: any) => (
                            <div className="pb-1" key={category.id}>
                              {category.name}
                            </div>
                          ))}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          {product.views}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          {product.totalSold}
                        </td>

                        <td className="px-2 py-4 whitespace-nowrap text-end text-sm font-medium">
                          
                            <UpdateModal update={product}/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="py-1 px-4">
                <nav className="flex items-center space-x-1">
                  <button
                    type="button"
                    className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-white hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    onClick={handlePrevPage}
                  >
                    <span aria-hidden="true">«</span>
                    <span className="sr-only">Previous</span>
                  </button>

                  <div className="pagination">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-white hover:bg-gray-100 disabled:opacity-50 ${
                          page === i + 1 ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(i + 1)}
                        disabled={page === i + 1}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-white hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    onClick={handleNextPage}
                  >
                    <span className="sr-only">Next</span>
                    <span aria-hidden="true">»</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
