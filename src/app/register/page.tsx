
import Image from "next/image";
import Link from "next/link";
import React, {useEffect} from "react";


export default function Login() {
  

  return (
    // <!-- Section SING IN -->
    <section>
      {/* <!-- Container --> */}
      <div className="py-10">
        {/* <!-- Component --> */}
        <div className="mx-auto max-w-xl bg-[#f2f2f7] px-5 py-10 text-center md:px-10">
          {/* <!-- Title --> */}
          <h2 className="text-3xl font-bold md:text-5xl text-black">
            Log in to your account
          </h2>
          {/* <!-- Button --> */}
          <Link
            href="#"
            className="mt-5 mx-auto flex max-w-sm justify-center bg-[#276ef1] px-8 py-4 text-center font-semibold text-white transition [box-shadow:rgb(171,_196,_245)_-8px_8px] hover:[box-shadow:rgb(171,_196,_245)_0px_0px]"
          >
            <Image
              src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f19d23637f876_GoogleLogo.svg"
              alt="" width={50} height={0}
              className="mr-4 -mt-2"
            />
            <p className="font-bold capitalize">Sign in with Google</p>
          </Link>
          {/* <!-- Devider --> */}
          <div className="mx-auto mb-14 mt-14 flex max-w-sm justify-around">
            <Image
              src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6358f3d7490d1b3d86cf9442_Line%203.svg"
              alt="" width={100} height={100}
              className="inline-block"
            />
            <p className="text-sm text-black">or sign in with email</p>
            <Image
              src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6358f3d7490d1b3d86cf9442_Line%203.svg"
              alt="" width={100} height={100}
              className="inline-block"
            />
          </div>
          {/* <!-- Form --> */}
          <form
            className="mx-auto mb-4 max-w-sm pb-4"
            name="wf-form-password"
            method="get"
          >
            <div className="relative">
              <Image
                alt="" width={30} height={100}
                src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f190b7e37f878_EnvelopeSimple.svg"
                className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block"
              />
              <input
                type="email"
                className="mb-4 block h-9 w-full border border-black bg-white px-3 py-6 pl-14 text-sm text-black "
                maxLength={256}
                name="name"
                placeholder="Email Address or Phone Number"
                required
              />
            </div>
            <div className="relative mb-4 pb-2">
              <Image
                alt="" width={30} height={100}
                src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f19601037f879_Lock-2.svg"
                className="absolute bottom-0 left-[5%] right-auto top-[18%] inline-block"
              />
              <input
                type="password"
                className="mb-4 block h-9 w-full border border-black bg-white px-3 py-6 pl-14 text-sm text-black"
                minLength={8}
                placeholder="Password (min 8 characters)"
                required
              />
            </div>
            <Link
              href="#"
              className="flex max-w-full grid-cols-2 flex-row items-center justify-center bg-[#276ef1] px-8 py-4 text-center font-semibold text-white transition [box-shadow:rgb(171,_196,_245)_-8px_8px] hover:[box-shadow:rgb(171,_196,_245)_0px_0px]"
            >
              <p className="mr-6 font-bold">SIGN IN</p>
              <div className="h-4 w-4 flex-none">
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 21"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Arrow Right</title>
                  <polygon points="16.172 9 10.101 2.929 11.515 1.515 20 10 19.293 10.707 11.515 18.485 10.101 17.071 16.172 11 0 11 0 9"></polygon>
                </svg>
              </div>
            </Link>
          </form>
          <p className="text-sm text-[#636262]">
            Dont have an account?{" "}
            <Link
              href="/register"
              className="font-[Montserrat,_sans-serif] text-sm font-bold text-black hover:underline underline-offset-8 decoration-blue-500"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
