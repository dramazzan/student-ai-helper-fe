"use client";

import { useEffect, useState } from "react";
import { verify } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");

    const verifyUser = async () => {
      try {
        await verify(token);
        setStatus("success");
        setTimeout(() => router.push("/auth/login"), 2000);
      } catch (err: any) {
        setStatus("error");
        const message = err?.message || "Произошла ошибка подтверждения";
        setErrorMessage(message);
      }
    };

    if (token) verifyUser();
    else {
      setStatus("error");
      setErrorMessage("Токен не найден в ссылке");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {status === "loading" && (
          <p className="text-blue-600 text-lg font-medium">Подтверждаем...</p>
        )}

        {status === "success" && (
          <p className="text-green-600 text-lg font-semibold">
            Email подтверждён. Перенаправляем...
          </p>
        )}

        {status === "error" && (
          <div>
            <p className="text-red-600 text-lg font-semibold mb-4">
              Ошибка подтверждения: {errorMessage}
            </p>
            <Link
              href="/auth/register"
              className="text-blue-600 hover:underline text-sm"
            >
              Повторить регистрацию
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
