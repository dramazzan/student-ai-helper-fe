"use client";

import React, { FormEvent, useState } from "react";
import { LoginDto } from "@/models/User";
import { login } from "@/services/auth";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginDto>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await login(loginData);
      if (response.success) {
        router.push("/main/dashboard");
      } else {
        setError(response.message || "Ошибка входа");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Что-то пошло не так");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход в аккаунт</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              onChange={handleChange}
              value={loginData.email}
              placeholder="Введите почту"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={loginData.password}
              placeholder="Введите пароль"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
