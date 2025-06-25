"use client";

import { RegisterDto } from "@/models/User";
import { register } from "@/services/auth";
import React, { ChangeEvent, FormEvent, useState } from "react";

const RegisterPage = () => {
  const [registerData, setRegisterData] = useState<RegisterDto>({
    name: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (registerData.password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);

    try {
      const res = await register(registerData);
      setSuccess(res.message || "Письмо подтверждения отправлено!");
    } catch (err: any) {
      setError(err?.message || "Произошла ошибка при регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-blue-400 p-2">
      <h2 className="bg-black">Регистрация</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-input">
          <label htmlFor="name">Имя</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={registerData.name}
            required
          />
        </div>

        <div className="form-input">
          <label htmlFor="email">Почта</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={registerData.email}
            required
          />
        </div>

        <div className="form-input">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={registerData.password}
            required
          />
        </div>

        <div className="form-input">
          <label htmlFor="confirmPassword">Подтвердите пароль</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Отправка..." : "Зарегистрироваться"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>❌ {error}</p>}
      {success && <p style={{ color: "green" }}>✅ {success}</p>}
    </div>
  );
};

export default RegisterPage;
