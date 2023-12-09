"use client"
import React, { createContext, useEffect, useState, useContext } from 'react';
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import {app} from "../firebase";
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../lib/apollo';

export const auth = getAuth(app);
const AuthContext = React.createContext();
export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Firebase listener for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user]);
  return <AuthContext.Provider value={{user}}><ApolloProvider client={apolloClient}>{children}</ApolloProvider></AuthContext.Provider>;
};
export const UserAuth = () => {
  return useContext(AuthContext);
};
