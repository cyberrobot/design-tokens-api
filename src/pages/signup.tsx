import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../schemas/auth";
import { type TLogin } from "~/types/auth";
import { api } from "~/utils/api";
import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from "react";

const SignUp: NextPageWithLayout = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = api.auth.signup.useMutation();

  const onSubmit: SubmitHandler<TLogin> = (data: TLogin) => {
    try {
      mutation
        .mutateAsync(data)
        .then((result) => {
          if (result.user) {
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
        <div className="card w-96 bg-neutral shadow-xl">
          <div className="card-body">
            <h1 className="card-title mb-2 justify-center text-2xl">
              Create an account
            </h1>
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
      </form>
    </>
  );
};

SignUp.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <nav className="container mx-auto py-4">
        <Link href="/">Logo</Link>
      </nav>
      <main className="mt-4 min-h-screen">{page}</main>
    </>
  );
};

export default SignUp;
