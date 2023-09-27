import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { type SubmitHandler, useForm } from "react-hook-form";
import { signUpSchema } from "~/schemas/auth";
import { withSession } from "~/server/withSession";
import { type TSignUp } from "~/types/auth";
import { api } from "~/utils/api";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = withSession(async () => {
  return { props: {} };
});

// Create a settings page. Add a form with username, email and password fields.
// Add a button to update the user's settings.
// Add an option to delete the user's account.
// Add an option to change the user's password.

export default function Settings() {
  const user = api.user.get.useQuery();
  const mutation = api.user.update.useMutation();
  const { register, handleSubmit } = useForm<TSignUp>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: user.data?.username as string,
      email: user.data?.email,
      password: user.data?.password,
    },
  });
  const onSubmit: SubmitHandler<TSignUp> = (data: TSignUp) => {
    try {
      mutation.mutate(data);
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
        <title>Settings</title>
        <meta name="description" content="Update user settings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form
        className="flex h-screen w-full items-center justify-center"
        onSubmit={handleSubmitWrapper}
      >
        <div className="card w-96 bg-neutral shadow-xl">
          <div className="card-body">
            <h1 className="card-title mb-2 justify-center text-2xl">
              User details
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
                Update
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
