import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUpSchema } from "../schemas/auth";
import { type TSignUp } from "~/types/auth";
import { api } from "~/utils/api";
import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from "react";
import Logo from "~/components/Logo";

const SignUp: NextPageWithLayout = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<TSignUp>({
    resolver: zodResolver(signUpSchema),
  });

  const mutation = api.auth.signup.useMutation();

  const onSubmit: SubmitHandler<TSignUp> = (data: TSignUp) => {
    try {
      mutation
        .mutateAsync(data)
        .then((result) => {
          if (result.code === 200) {
            router.push("/login").catch(console.error);
          }
        })
        .catch(console.error);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitWrapper = (e: React.FormEvent<HTMLFormElement>) => {
    void handleSubmit(onSubmit)(e);
  };

  return (
    <>
      <Head>
        <title>Create an account</title>
        <meta name="description" content="Create an account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form
        className="flex h-screen w-full items-center justify-center"
        onSubmit={handleSubmitWrapper}
      >
        {mutation.isSuccess ? (
          <div className="alert mb-6 w-96">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-6 w-6 shrink-0 stroke-info"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Check your inbox to confirm your email address.</span>
          </div>
        ) : (
          <div className="card w-96 bg-neutral shadow-xl">
            <div className="card-body">
              <h1 className="card-title mb-2 justify-center text-2xl">
                Create an account
              </h1>
              <label>
                Username
                <input
                  type="username"
                  className="input-bordered input mt-2 w-full max-w-xs"
                  {...register("username")}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  className="input-bordered input mt-2 w-full max-w-xs"
                  {...register("email")}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  className="input-bordered input mt-2 w-full max-w-xs"
                  {...register("password")}
                />
              </label>
              <div className="card-actions mt-2 flex-col items-center justify-between">
                <button className="btn-primary btn w-full" type="submit">
                  Sign Up
                </button>
                <div>
                  Already have an account?
                  <Link href="/login" className="link ml-2">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
};

SignUp.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <nav className="container mx-auto py-6">
        <Link href="/">
          <Logo />
        </Link>
      </nav>
      <main className="-mt-[88px]">{page}</main>
    </>
  );
};

export default SignUp;
