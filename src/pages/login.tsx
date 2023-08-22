import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { loginSchema } from "../schemas/auth";
import { type TLogin } from '~/types/auth';
import { useCallback } from 'react';

function Login() {
  const { register, handleSubmit } = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = useCallback(async (data: TLogin) => {
    await signIn("credentials", { ...data, callbackUrl: "/tokens" });
  }, []);

  const handleSubmitWrapper = (e: React.FormEvent<HTMLFormElement>) => {
    void handleSubmit(onSubmit)(e);
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login to account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-base-200">
        <form
          className="flex items-center justify-center h-screen w-full"
          onSubmit={handleSubmitWrapper}
        >
          <div className="card w-96 bg-neutral shadow-xl">
            <div className="card-body">
              <h1 className="text-2xl card-title mb-2 justify-center">Login</h1>
              <label>Email
                <input
                  type="email"
                  className="input input-bordered w-full max-w-xs mt-2"
                  {...register("email")}
                />
              </label>
              <label>Password
                <input
                  type="password"
                  className="input input-bordered w-full max-w-xs mt-2"
                  {...register("password")}
                />
              </label>
              <div className="card-actions items-center justify-between mt-2 flex-col">
                <button className="btn btn-primary w-full" type="submit">
                  Login
                </button>
                <div>Don&apos;t have an account?
                  <Link href="/signup" className="link ml-2">
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}

export default Login
  ;