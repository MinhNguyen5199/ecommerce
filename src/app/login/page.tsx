"use client";
import { useRouter } from 'next/navigation';
import "./firebaseuistyle.css";
import "firebaseui/dist/firebaseui.css";
import React, { useEffect, useState } from "react";

import "firebase/compat/auth";
import "firebaseui/dist/firebaseui.css";
import { handleSignInWithGoogle } from "../ulti/SignInGoogle";
import { ui } from "../ulti/SignInWithPhone";
import { uiConfig } from "../ulti/SignInWithPhone";
import { UserAuth } from '../providers/AuthProvider';
import prisma from '../lib/prisma';
import { create } from 'domain';
import { isNullish } from '@apollo/client/cache/inmemory/helpers';
import { gql, useMutation, useQuery } from '@apollo/client';
import Image from 'next/image';
import {CreateUser} from './Users'
import { findAllUsers } from './Users';
import { Anonymous } from '../ulti/Anonymous';


// const auth = firebase.auth();
// const ui = new firebaseui.auth.AuthUI(auth);
export default function Page() {
  const router = useRouter();
  var authUser = UserAuth();
  const [newUser, {error}] = useMutation(CreateUser);
  const { data, loading, error: error1 } = useQuery(findAllUsers);
  if(loading) return <p>Loading...</p>
  const signIn= async ()=>{
    const user = handleSignInWithGoogle();
    user.then((res:any)=>{
      const foundElement = data?.findAllUsers.find((item:any) => item.email === res.email);
      if(!foundElement){
      newUser({variables: { id: res.uid, email: res.email, name: res.displayName, role: 3 }})}
      
    }).catch((err)=>{
      console.log(err)
    })
    await router.push('/');
     
  }
  const signInAnonymous = async ()=>{
    Anonymous();
    await router.push('/');
  }

  return (
    
    <div className="py-10">
      <div className="mx-auto max-w-xl bg-[#f2f2f7] px-5 py-10 text-center md:px-10">
        {/* <!-- Title --> */}
        <h2 className="text-3xl font-bold md:text-5xl text-black mb-5">
          Login to your account
        </h2>

        {/* <!-- Form --> */}
        <div id="firebaseui-auth-container"></div>
        <button
          className="mt-3  py-[10px] px-4 inline-flex justify-center  items-center gap-2  bg-purple-500 border w-[14rem] h-[10rem]border-transparent font-bold text-black  hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 text-[15px]  ring-offset-white focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm dark:bg-gray-900 shadow-2xl rounded-[4px] dark:text-white"
          onClick={signIn}
        >
          <Image
            className="firebaseui-idp-icon mr-2"
            alt=""
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width={30}
            height={30}
          />
          <p className="relative ">Sign in with Google</p>
        </button>
        <br></br>
        <button onClick={signInAnonymous} className="bg-blue-500 mt-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Sign in as admin
</button>
<h1 className='text-black'>if sign in as admin, dont show admin dashboard when click on avatar please refresh the page</h1>
      </div>
    </div>
  );
}
