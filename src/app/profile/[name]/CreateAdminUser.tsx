// src/app/profile/[name]/CreateAdminUser.tsx
import React, { useState } from 'react';
import { handleSignInWithGoogle } from '@/app/ulti/SignInGoogle';
import { findAllUsers } from '@/app/login/Users';
import { gql, useMutation, useQuery } from '@apollo/client';
import Image from 'next/image';
import { CreateUser } from '@/app/login/Users';
export default function CreateAdminUser() {
  const [showForm, setShowForm] = useState(false);
  const { data } = useQuery(findAllUsers);
  const [newUser, {error}] = useMutation(CreateUser);
  
  const signIn= async ()=>{
    const user = handleSignInWithGoogle();
    user.then((res:any)=>{
      const foundElement = data?.findAllUsers.find((item:any) => item.email === res.email);
      if(!foundElement){
        
      newUser({variables: { id: res.uid, email: res.email, name: res.displayName, role: 1 }})
        
      if (error) {
        alert("User existed"); // Log the error to the console instead of showing an alert
      }

      }
    }).catch((err)=>{
      console.log(err)
    })
    setShowForm(false);
    //router.push("/");
     
  }
  

  return (
    <div>
      <button className="py-2 px-4 bg-blue-500 text-white rounded" onClick={() => setShowForm(!showForm)}>
        Create Admin User
      </button>

      {showForm && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <button className="float-right bg-red-500 px-2 mb-2" onClick={() => setShowForm(false)}>X</button>
                <button
          className=" py-[10px] px-4 inline-flex justify-center  items-center gap-2  bg-purple-500 border w-[14rem] h-[10rem]border-transparent font-bold text-black  hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 text-[15px]  ring-offset-white focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm dark:bg-gray-900 shadow-2xl rounded-[4px] dark:text-white"
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}