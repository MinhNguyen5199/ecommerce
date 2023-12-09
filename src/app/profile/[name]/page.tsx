"use client";
import React, { useEffect, useState } from "react";
import ProductTable from "./ProductTable";
import UsersTable from "./UsersTable";
import LSTMComponent from "./LSTMComponent";
import OrderDetailTable from "./OrderDetailTable";
import Dashboard from "./Dashboard";


export default function Page() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedTab = localStorage.getItem('activeTab');
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab, isClient]);

  useEffect(() => {
    import("preline");
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-center">
      <button 
        className={`px-4 py-2 mr-2 ${activeTab === 'Dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-950'}`} 
        onClick={() => setActiveTab('Dashboard')}
      >
        Dashboard
      </button>
      <button 
        className={`px-4 py-2 ${activeTab === 'OrderDetail' ? 'bg-blue-500 text-white' : 'bg-gray-950'}`} 
        onClick={() => setActiveTab('OrderDetail')}
      >
        OrderDetail
      </button>
      <button 
        className={`px-4 py-2 ${activeTab === 'Products' ? 'bg-blue-500 text-white' : 'bg-gray-950'}`} 
        onClick={() => setActiveTab('Products')}
      >
        Products
      </button>
      <button 
        className={`px-4 py-2 ${activeTab === 'Users' ? 'bg-blue-500 text-white' : 'bg-gray-950'}`} 
        onClick={() => setActiveTab('Users')}
      >
        Users
      </button>
      </div>
      
      {/* <LSTMComponent/> */}
      {activeTab === 'Dashboard' && <div className="mt-4"><Dashboard/></div>}
      {activeTab === 'OrderDetail' && <div className="mt-4"><OrderDetailTable/></div>}
      {activeTab === 'Products' && <div className="mt-4"><ProductTable/></div>}
      {activeTab === 'Users' && <div className="mt-4"><UsersTable/></div>}
    </div>
  );
}
