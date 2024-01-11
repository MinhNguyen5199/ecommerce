"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { UserAuth } from "../providers/AuthProvider";
import { handleSignOut } from "../ulti/SignOut";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { parse } from "path";
import { input } from "@material-tailwind/react";
import { create } from "../action";
import { readRole } from "../action";
import { Router } from "next/router";

export const listOrderItems = gql`
  query ListOrderItems($user_id: String) {
    order_items(user_id: $user_id) {
      id
      quantity
      product {
        id
        name
        price
      }
      user {
        id
      }
    }
  }
`;

export const UPDATE_ORDER_ITEM = gql`
  mutation updateOrderItem($id: Int!, $quantity: Int!) {
    updateOrderItem(id: $id, quantity: $quantity) {
      id
      quantity
    }
  }
`;

export const DELETE_ORDER_ITEM = gql`
  mutation deleteOrderItem($id: Int!) {
    deleteOrderItem(id: $id) {
      id
    }
  }
`;

const FIND_USER = gql`
  query findUser($id: String!) {
    findUser(id: $id) {
      id
      name
      email
      role
    }
  }
`;

let olddata: any;
export default function Header() {
  const router = useRouter();
  const [roleUser, setRoleUser] = useState<string | null>(null);

  useEffect(() => {
    readRole().then((role) => {
      setRoleUser(role?.value || null);
    });
  }, [router]);
  const { user } = UserAuth();
  const {
    data: dataUser,
    loading: loadingUser,
    error: errorUser,
  } = useQuery(FIND_USER, {
    variables: { id: user?.uid },
  });
  useEffect(() => {
    if (dataUser) {
      create(dataUser);
    }
  }, [dataUser, user]);
  const { data, loading, error } = useQuery(listOrderItems, {
    variables: { user_id: user?.uid },
    pollInterval: 300,
  });
  if (loadingUser || loading) return <p>Loading...</p>;

  olddata = data;

  return (
    <div className="navbar bg-black">
      <div className="flex-1">
        <Link
          href="/"
          className="btn btn-ghost normal-case text-xl sm:w-[15rem] w-[12rem] -ml-4"
        >
          <Image
            src="https://res.cloudinary.com/minhnguyen/image/upload/v1701758206/2790548935459213535461212818601892484913387n-6574_ozujmo.png"
            width={100}
            height={100}
            className="rounded-full"
            alt="logo"
            priority
          />
        </Link>
      </div>
      {/* /////// */}
      {user ? (
        <div className="flex-none">
          <div className="dropdown dropdown-end ml">
            <Link href="/finishOrder">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="badge badge-sm indicator-item">
                    {data?.order_items?.length}
                  </span>
                </div>
              </label>
            </Link>
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <Image
                  src={
                    user?.photoURL
                      ? user.photoURL
                      : "https://res.cloudinary.com/minhnguyen/image/upload/e_improve,w_300,h_600,c_thumb,g_auto/v1701757601/man-manager-administrator-consultant-avatar-vector-35753711_ursyv0.jpg"
                  }
                  alt=""
                  width={200}
                  height={200}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {roleUser &&
                (dataUser?.findUser.role === 1 || roleUser === "1") && (
                  <li>
                    <Link href={`/profile/${user.displayName}`}>
                      <p className="justify-between">
                        <span className="badge badge-outline badge-accent">
                          Admin Dashboard
                        </span>
                      </p>
                    </Link>
                  </li>
                )}
              <li>
                <button onClick={handleSignOut}>
                  <span className="badge badge-error badge-accent">
                    Sign out
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        ////
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="rounded-full">
              <Image src="/blank.jpg" width={3000} height={3000} alt="blank" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/login">Login</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
export { olddata };
