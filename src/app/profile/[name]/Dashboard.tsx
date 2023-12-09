import React from "react";
import { useQuery } from "@apollo/client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ORDER_DETAILS } from "./OrderDetailTable";

export default function Dashboard() {
  const { data, loading, error } = useQuery(ORDER_DETAILS);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center mt-4">
        Error: {error.message}
      </div>
    );
  // Step 1: Parse the data
  const salesByMonthAndYear = data.order_details.reduce((acc:any, order:any) => {
    const date = new Date(order.created_at);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // Months are 0-indexed
    const yearMonth = `${year}-${month.toString().padStart(2, "0")}`;

    if (!acc[yearMonth]) {
      acc[yearMonth] = 0; // Initialize with 0 if not present
    }

    acc[yearMonth] += order.total_price; // Add the price to the existing sum

    return acc;
  }, {});

  const salesByUser = data.order_details.reduce((acc:any, order:any) => {
    const userId = order.user.id;
    const userName = order.user.name;

    if (!acc[userId]) {
      acc[userId] = { totalSales: 0, name: userName }; // Initialize with 0 if not present
    }

    acc[userId].totalSales += order.total_price; // Add the price to the existing sum

    return acc;
  }, {});

  const productOccurrences = data.order_details.reduce((acc:any, order:any) => {
    order.order_items.forEach((item:any) => {
      const product = item.product.name;
      const price = item.product.price;

      if (!acc[product]) {
        acc[product] = { count: 0, price }; // Initialize with 0 if not present
      }

      acc[product].count += 1; // Increment the count
    });

    return acc;
  }, {});

  // Step 2: Calculate the total sales
  const totalSalesByMonthAndYear = Object.keys(salesByMonthAndYear)
    .sort()
    .map((yearMonth) => {
      const totalSales = salesByMonthAndYear[yearMonth];
      return { yearMonth, totalSales };
    })
    .slice(-14); // Get the last 14 elements

    const totalSalesByUser = Object.entries(salesByUser)
    .map(([userId, value]) => {
        const { name, totalSales } = value as any;
        return { userId, name, totalSales };
    })
    .sort((a: any, b: any) => b.totalSales - a.totalSales);


  const sortedProductOccurrences = Object.entries(productOccurrences)
  .map(([product, value]) => {
      const { count, price } = value as any;
      return { product, count, price };
  })
  .sort((a: any, b: any) => b.count - a.count);

  // Step 3: Calculate the total revenue
  const totalRevenue: any = Object.values(salesByMonthAndYear).reduce(
    (sum: any, value: any) => sum + value,
    0
  );

  // Step 4: Display the data
  return (
    <div className="preline p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">
        Dashboard
      </h1>
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
        Total Revenue: ${totalRevenue}
      </h2>
      <div className="bg-white p-4 rounded shadow-lg">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={totalSalesByMonthAndYear}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="yearMonth" />
            <YAxis />
            <Tooltip
  contentStyle={{ backgroundColor: "black", color: "white" }}
  formatter={(value: number | string | Array<number | string> | null) => {
    const formattedValue = typeof value === 'number' ? `$${value.toFixed(2)}` : value;
    return [formattedValue, "Total Sales"];
  }}
/>
            <Area
              type="monotone"
              dataKey="totalSales"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-4">
        <div className="bg-white p-4 rounded-lg shadow-lg w-1/2 mr-2">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
            Top Users by Sales
          </h2>
          <ul className="list-none pl-5">
            {totalSalesByUser.map(({ userId, name, totalSales }) => (
              <li
                key={userId}
                className="text-black mb-4 p-3 rounded-lg bg-gray-100 shadow"
              >
                <span className="font-bold text-blue-600 text-lg">{name}</span>:
                <span className="font-medium text-green-600 text-lg">
                  {" "}
                  ${totalSales.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg w-1/2 ml-2">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
            Most Ordered Products
          </h2>
          <ul className="list-none pl-5">
            {sortedProductOccurrences.map(({ product, count, price }) => (
              <li
                key={product}
                className="flex flex-col shadow-md rounded-lg p-4 bg-gray-100 mb-4"
              >
                <span className="text-gray-700 text-lg">
                  Ordered: <span className="font-medium">{count} times</span>
                </span>
                <span className="text-blue-600 text-xl font-semibold uppercase">
                  {product} : {" "}
                  <span className=" text-green-600">${price}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
