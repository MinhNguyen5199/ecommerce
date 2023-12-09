"use client";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Carousel from "./components/Carousel";
import Categories from "./components/Categories";
import apolloClient from "./lib/apollo";
import { ApolloProvider } from "@apollo/client";
import { AuthProvider, UserAuth } from "./providers/AuthProvider";
import { useEffect } from "react";

export default function Home() {
  return (
    <div>
      

      <Carousel />

      <Categories />

      
      </div>
  );
}
