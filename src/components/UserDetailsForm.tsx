import { zodResolver } from "@hookform/resolvers/zod";
import { type User } from "@prisma/client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { userDetailsSchema } from "~/schemas/auth";
import { type TUserDetails } from "~/types/auth";
import { api } from "~/utils/api";

export type UserDetailsFormProps = {
  user: User | null;
};

export const UserDetailsForm = ({ user }: UserDetailsFormProps) => {
  const userDetailsMutation = api.user.update.useMutation();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<TUserDetails>({
    resolver: zodResolver(userDetailsSchema),
  });
  const onUserSubmit = (data: TUserDetails) => {
    try {
      if (data.email === user?.email) {
        setError("email", {
          type: "manual",
          message: "Email is the same as before",
        });
        return;
      }

      userDetailsMutation
        .mutateAsync(data)
        .then(() => {
          reset();
        })
        .catch(console.error);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUserSubmitWrapper = (e: React.FormEvent<HTMLFormElement>) => {
    void handleSubmit(onUserSubmit)(e);
  };

  useEffect(() => {
    if (user) {
      setValue("username", user?.username);
      setValue("email", user?.email);
    }
  }, [user, setValue]);

  return (
    <form
      className="mb-10 flex w-full justify-center"
      onSubmit={handleUserSubmitWrapper}
    >
      <div className="card w-96 bg-neutral shadow-xl">
        <div className="card-body">
          <label>
            Username
            <input
              type="username"
              disabled
              className="input-bordered input mt-2 w-full max-w-xs opacity-40"
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
          {errors.email && (
            <div className="text-error">{errors.email.message}</div>
          )}
          <div className="card-actions mt-2 flex-col items-center justify-between">
            <button
              className="btn-primary btn-outline btn w-full"
              type="submit"
            >
              Update profile
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
