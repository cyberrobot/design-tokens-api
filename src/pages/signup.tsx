import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../schemas/auth";
import { type TLogin } from '~/types/auth';
import { api } from '~/utils/api';

function SignUp() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = api.auth.signup.useMutation();

  const onSubmit: SubmitHandler<TLogin> = (data: TLogin) => {
    try {
      mutation.mutateAsync(data).then(result => {
        if (result.user) {
          router.push("/login").catch(console.error);
        }
      }).catch(console.error);
    } catch (error) {
      console.error(error);
    }
  };

  // const onSubmitTest: SubmitHandler<TLogin> = (data: TLogin) => {
  //   console.log('data', data);
  // }

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

      <main className="bg-base-200">
        <form
          className="flex items-center justify-center h-screen w-full"
          onSubmit={handleSubmitWrapper}
        >
          <div className="card w-96 bg-neutral shadow-xl">
            <div className="card-body">
              <h1 className="text-2xl card-title mb-2 justify-center">Create an account</h1>
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
                  Sign Up
                </button>
                <div>Already have an account?
                  <Link href="/login" className="link ml-2">
                    Sign in
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

export default SignUp
  ;