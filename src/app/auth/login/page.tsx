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
        router.push("/dashboard");
        console.log("Успешный вход");
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
    <div>
      <h1>LoginPage</h1>
      <form onSubmit={handleSubmit}>
        <div className="form_input">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            onChange={handleChange}
            value={loginData.email}
            placeholder="Введите почту"
          />
        </div>
        <div className="form_input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={loginData.password}
            placeholder="Введите пароль"
          />
        </div>
        <button type="submit">Войти</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
