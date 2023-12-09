//findAllUsers
import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Modal from "./Modal";
import CreateAdminUser from "./CreateAdminUser";

const LIST_ALL_USERS = gql`
  query {
    findAllUsers {
      id
      createdAt
      email
      name
      phone_number
      users_payment {
        id
        createdAt
        amount
        paymentIntent
      }
      users_address {
        id
        address
        city
        postal_code
        country
        province
      }
      role
      order_details {
        id
        total_price
        created_at
        status
        order_items {
          id
          quantity
          product {
            id
            name
            price
          }
        }
      }
    }
    totalUsers
  }
`;
interface OrderDetail {
  id: string;
  // Add other fields as needed
}

interface User {
  id: string;
  name: string;
  order_details: OrderDetail[]; // Add this line
  // Add other fields as needed
}
const USERS_PER_PAGE = 10;
export default function UsersTable() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const handleItemsPerPageChange = (e: any) => {
    setItemsPerPage(e.target.value);
  };
  const [roleTerm, setRoleTerm] = useState("3");
  const handleRoleChange = (event: any) => {
    setRoleTerm(event.target.value);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { data, loading, error } = useQuery(LIST_ALL_USERS, {
    variables: { skip: (page - 1) * USERS_PER_PAGE, take: USERS_PER_PAGE },
    pollInterval: 300,
  });
  if (loading) return <p>Loading...</p>;

  if (error) {
    console.log(error);
  }
  // console.log(new Date());
  const filteredUsers = data?.findAllUsers.filter(
    (user: { email: string; role: number }) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
      user.role.toString() === roleTerm
  );

  const usersOnCurrentPage = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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
                    placeholder="Search for user's email"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />

                  <select
                    name="hs-table-with-pagination-role"
                    id="hs-table-with-pagination-role"
                    className="py-2 mt-2 px-3 ps-9 inline-block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                    value={roleTerm}
                    onChange={handleRoleChange}
                  >
                    <option value="1">Admin</option>
                    <option value="3">Customer</option>
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
                <p className="pt-2 pl-2">
                  Click on users to see customers&apos; order details.
                </p>
                <CreateAdminUser />
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
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase cursor-pointer"
                      >
                        Created At
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase cursor-pointer"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase"
                      >
                        Address
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-900 uppercase cursor-pointer"
                      >
                        Phone number
                      </th>
                      <th
                        scope="col"
                        className="pl-[7rem] py-3 text-start text-xs font-medium text-gray-900 uppercase cursor-pointer"
                      >
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {usersOnCurrentPage?.map((user: any, index: any) => (
                      <React.Fragment key={user.id}>
                      <tr
                        key={user.id}
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetails(!showDetails);
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white dark:text-gray-200">
                          {index + 1}. {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          {user.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          {user.role === 1
                            ? "Admin"
                            : user.role === 2
                            ? "Staff"
                            : "Customer"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          {user.users_address.map((address: any) => (
                            <div key={address.id}>
                              <div>
                                {address.address}, {address.city},
                              </div>
                              <div>
                                {address.province}, {address.country},{" "}
                                {address.postal_code}
                              </div>
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-gray-200">
                          {user.phone_number}
                        </td>
                        {user.users_payment.map(
                          (payment: any, index: number) => (
                            <div key={payment.id}>
                              <div>
                                <td className="pl-11 pt-2 whitespace-nowrap text-sm text-white dark:text-gray-200">
                                  {index + 1}) {payment.createdAt}
                                </td>
                              </div>
                              <div>
                                <td className="px-6 pl-11 whitespace-nowrap text-sm text-white dark:text-gray-200">
                                  ${payment.amount}
                                </td>
                              </div>
                            </div>
                          ))}
                        
                      </tr>

                      {showDetails && selectedUser && selectedUser.id === user.id && (
                  <tr>
                  <td colSpan={7}>
                    <div className="p-5 bg-teal-200 rounded shadow-lg transform">
                      <h2 className="text-2xl font-bold mb-4 text-blue-500">
                        Order Details for {selectedUser.name}
                      </h2>
                      <div className="space-y-4">
                      {selectedUser.order_details.map((order:any, index:any) => (
                        <div
                          key={order.id}
                          className="p-4 border rounded shadow"
                        >
                          <div className="flex space-x-4">
                            <div className="pr-10">
                              <p className="text-black">
                                {index + 1}) Status: {order.status}
                              </p>
                              <p className="text-black">
                                Total Price: ${order.total_price}
                              </p>
                              <p className="text-black">
                                Created at: {order.created_at.slice(0, 10)}
                              </p>
                            </div>
                            <div className="flex space-x-4">
                              {order.order_items.map((item:any, itemIndex:any) => (
                                <div
                                  key={item.id}
                                  className="p-2 border rounded shadow"
                                >
                                  <p className="text-black">
                                    Item {itemIndex + 1}
                                  </p>
                                  <p className="text-black">
                                    Quantity: {item.quantity}
                                  </p>
                                  <p className="text-black">
                                    Product: {item.product.name}
                                  </p>
                                  <p className="text-black">
                                    Price: ${item.product.price}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                  </td>
                </tr>
                )}
</React.Fragment>      

                    ))}
                  </tbody>
                  
                </table>
                
              </div>
                            
              <div className="py-1 px-4">
                <nav className="flex items-center space-x-1">
                  <button
                    type="button"
                    className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-white hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
    disabled={page === 1}
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
                        onClick={() => setPage(i + 1)}
                        disabled={page === i + 1}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-white hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    onClick={() => setPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredUsers.length / itemsPerPage)))}
    disabled={page === Math.ceil(filteredUsers.length / itemsPerPage)}
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
