"use client";

/*
 * VIBE CODED FRONT END FOR TESTING
 * */

import { useState } from "react";
import { api } from "~/trpc/react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const login = api.auth.login.useMutation({
    onSuccess: async (data) => {
      localStorage.setItem("token", data.token);
      await currentUser.refetch();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const currentUser = api.auth.currentUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const register = api.auth.register.useMutation({
    onSuccess: async (data) => {
      localStorage.setItem("token", data.token);
      await currentUser.refetch();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    if (isLogin) {
      login.mutate({
        identifier: formData.get("identifier") as string,
        password: formData.get("password") as string,
      });
    } else {
      register.mutate({
        email: formData.get("email") as string,
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      });
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await currentUser.refetch();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white/10 p-8 text-white">
        {currentUser.data && (
          <h1 className="text-center text-4xl font-bold">
            Hello {currentUser.data.username}
          </h1>
        )}
        <div>
          <h2 className="text-center text-3xl font-bold">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </h2>
        </div>

        {error && (
          <div className="rounded-md bg-red-500/10 p-4 text-red-500">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {isLogin ? (
            <div>
              <input
                name="identifier"
                type="text"
                required
                className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-white"
                placeholder="Email or Username"
              />
            </div>
          ) : (
            <>
              <input
                name="email"
                type="email"
                required
                className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-white"
                placeholder="Email"
              />
              <input
                name="username"
                type="text"
                required
                className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-white"
                placeholder="Username"
              />
            </>
          )}

          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-white"
            placeholder="Password"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-[#2e026d] p-2 text-white hover:bg-[#15162c] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60"
            disabled={
              login.isPending || register.isPending || currentUser.data != null
            }
          >
            {login.isPending || register.isPending
              ? "Loading..."
              : isLogin
                ? "Sign in"
                : "Register"}
          </button>
        </form>

        <button
          className="w-full rounded-lg bg-[#2e026d] p-2 text-white hover:bg-[#15162c] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60"
          disabled={currentUser.isPending || !currentUser.data}
          onClick={handleLogout}
        >
          {currentUser.isPending
            ? "Loading..."
            : currentUser.data
              ? "Logout"
              : "Not logged in"}
        </button>
        <button
          className="mt-4 w-full text-center text-sm text-gray-300 hover:text-white"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
