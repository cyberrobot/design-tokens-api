import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { passwordResetSchema } from "~/schemas/auth";
import { type TPasswordReset } from "~/types/auth";
import { api } from "~/utils/api";

export const PasswordReset = () => {
  const passwordMutation = api.user.updatePassword.useMutation();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<TPasswordReset>({
    resolver: zodResolver(passwordResetSchema),
  });

  const onPasswordSubmit: SubmitHandler<TPasswordReset> = (
    data: TPasswordReset
  ) => {
    try {
      clearErrors();
      if (data.newPassword !== data.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match",
        });
        return;
      }
      passwordMutation
        .mutateAsync(data)
        .then(() => {
          reset();
        })
        .catch(console.error);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordSubmitWrapper = (e: React.FormEvent<HTMLFormElement>) => {
    void handleSubmit(onPasswordSubmit)(e);
  };
  return (
    <form
      className="flex w-full justify-center"
      onSubmit={handlePasswordSubmitWrapper}
    >
      <div className="card w-96 bg-neutral shadow-xl">
        <div className="card-body">
          <label>
            Current password
            <input
              type="password"
              className="input-bordered input mt-2 w-full max-w-xs"
              {...register("password")}
            />
          </label>
          {errors.password && (
            <div className="text-error">{errors.password.message}</div>
          )}
          <label>
            New password
            <input
              type="password"
              className="input-bordered input mt-2 w-full max-w-xs"
              {...register("newPassword")}
            />
          </label>
          {errors.newPassword && (
            <div className="text-error">{errors.newPassword.message}</div>
          )}
          <label>
            Confirm new password
            <input
              type="password"
              className="input-bordered input mt-2 w-full max-w-xs"
              {...register("confirmPassword")}
            />
          </label>
          {errors.confirmPassword && (
            <div className="text-error">{errors.confirmPassword.message}</div>
          )}
          <div className="card-actions mt-2 flex-col items-center justify-between">
            <button
              className="btn-primary btn-outline btn w-full"
              type="submit"
            >
              Update password
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
