import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./lib/apollo";
import { child } from 'firebase/database';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
      <AuthProvider>
      <Header />
      <div className="min-h-[70vh]">
        {children}
        </div>
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
