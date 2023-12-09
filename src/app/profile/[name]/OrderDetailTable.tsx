import React from "react";
import { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
export const ORDER_DETAILS = gql`
  query order_details {
    order_details {
      user {
        id
        name
      }
      id
      total_price
      created_at
      status
      order_items {
        quantity
        product {
          name
          price
        }
      }
    }
  }
`;
const UPDATE_ORDER = gql`
  mutation updateOrderDetail($id: ID!, $status: String!) {
    updateOrderDetail(id: $id, status: $status) {
      id
      status
    }
  }
`;
export default function OrderDetailTable() {
  
  const [statusTerm, setStatusTerm] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const handleItemsPerPageChange = (e: any) => {
    setItemsPerPage(e.target.value);
  };
  const [updateOrderDetail, { loading: loading1, error: error1 }] =
    useMutation(UPDATE_ORDER);

  const handleStatusChange = (e: any) => {
    setStatusTerm(e.target.value);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
  };
  const [originalStatus, setOriginalStatus] = useState<{ [key: string]: any }>({});
  const { data, loading, error } = useQuery(ORDER_DETAILS);

  useEffect(() => {
    if (data) {
      const status: { [key: string]: any } = {};
      data.order_details.forEach((order:any) => {
        status[order.id] = order.status;
      });
      setOriginalStatus(status);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const filteredOrders = data?.order_details.filter((order: any) => {
    return (
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      order.status.toLowerCase().includes(statusTerm.toLowerCase())
    );
  });

  const ordersOnCurrentPage = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleButton = (a: any, b: any) => {
    updateOrderDetail({ variables: { id: a.id, status: b } });
    if (error1) {
      console.log(error1);
    }
    if (loading1) {
      return <p>Loading...</p>;
    }
  };

  const handleDataStatusChange = (orderId:any, newStatus:any) => {
    setOriginalStatus((prevStatus) => ({
      ...prevStatus,
      [orderId]: newStatus,
    }));
  };
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
                    className="py-2 px-3 ps-9 inline-block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                    placeholder="Search for user name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />

                  <select
                    name="hs-table-with-pagination-role"
                    id="hs-table-with-pagination-role"
                    className="py-2 mt-2 px-3 ps-9 inline-block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                    value={statusTerm}
                    onChange={handleStatusChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>

                  <div className="absolute top-[10px] start-0 flex items-center pointer-events-none ps-3">
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
                {/* <CreateAdminUser /> */}
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase"
                      >
                        User Name
                      </th>
                      <th
                        scope="col"
                        className="py-3 text-start text-xs font-medium text-gray-900 uppercase"
                      >
                        Total Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase cursor-pointer"
                      >
                        Created At
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase"
                      >
                        status
                      </th>
                      <th
                        scope="col"
                        className="pl-[5rem] py-3 text-start text-xs font-medium text-gray-900 uppercase cursor-pointer"
                      >
                        Products
                      </th>
                      <th
                        scope="col"
                        className=" py-3 text-start text-xs font-medium text-gray-900 uppercase cursor-pointer"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {ordersOnCurrentPage?.map((order: any, index: any) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white dark:text-gray-200">
                          {order.id}
                        </td>
                        <td className="py-4 whitespace-nowrap text-white dark:text-gray-200 text-lg">
                          {order.user.name}
                        </td>
                        <td className=" py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          ${order.total_price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          {order.created_at.slice(0, 10)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                        <select
    className="py-1 px-2"
    value={originalStatus[order.id] || order.status}
    onChange={(e) => handleDataStatusChange(order.id, e.target.value)}
  >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="px-[5rem] whitespace-nowrap text-sm text-white dark:text-gray-200">
                          {order.order_items.map((item: any, index: any) => (
                            <div key={index}>
                              <p>
                                {index + 1}.Name:{item.product.name}
                              </p>
                              <p>Price: ${item.product.price}</p>
                              <p>Qty: {item.quantity}</p>
                              <p>--------</p>
                            </div>
                          ))}
                        </td>
                        <td className="pr-3 text-start font-medium whitespace-nowrap text-sm text-white dark:text-gray-200">
                        <button
  className={`px-6 py-3 rounded-lg ${
    originalStatus[order.id] === order.status
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-blue-500 hover:bg-blue-800"
  }`}
  onClick={() => handleButton(order, originalStatus[order.id])}
  disabled={originalStatus[order.id] === order.status}
>
  UPDATE
</button>
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
                    onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
    disabled={currentPage === 1}
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
      currentPage === i + 1 ? "active" : ""
    }`}
    onClick={() => setCurrentPage(i + 1)}
    disabled={currentPage === i + 1}
  >
    {i + 1}
  </button>
))}
                  </div>

                  <button
                    type="button"
                    className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-white hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredOrders.length / itemsPerPage)))}
    disabled={currentPage === Math.ceil(filteredOrders.length / itemsPerPage)}
                  >
                    <span className="sr-only">Next</span>
                    <span aria-hidden="true">»</span>
                  </button>
                  <select onChange={handleItemsPerPageChange} value={itemsPerPage}>
  <option value={10}>10</option>
  <option value={20}>20</option>
  <option value={30}>30</option>
</select>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
