import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

import { loginSchema } from "../schemas/auth";
import { type TLogin } from "~/types/auth";
import { type ReactElement, useCallback } from "react";
import { type NextPageWithLayout } from "./_app";
import Logo from "~/components/Logo";

const Login: NextPageWithLayout = () => {
  const { register, handleSubmit } = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();

  const onSubmit = useCallback(
    async (data: TLogin) => {
      await signIn("credentials", { ...data, redirect: false }).then(
        (result) => {
          if (result?.error) {
            return;
          }
          router.push("/tokens").catch(console.error);
        }
      );
    },
    [router]
  );

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
      <form
        className="flex h-screen w-full items-center justify-center"
        onSubmit={handleSubmitWrapper}
      >
        <div className="card w-96 bg-neutral shadow-xl">
          <div className="card-body">
            <h1 className="card-title mb-2 justify-center text-2xl">Login</h1>
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
                Login
              </button>
              <div>
                Don&apos;t have an account?
                <Link href="/signup" className="link ml-2">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
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

export default Login;
