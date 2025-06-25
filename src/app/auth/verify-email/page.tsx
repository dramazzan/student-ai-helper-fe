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
    <div>
      {status === "loading" && <p>Подтверждаем...</p>}
      {status === "success" && <p>Email подтверждён ✅. Перенаправляем...</p>}
      {status === "error" && (
        <div>
          <p>❌ Ошибка подтверждения: {errorMessage}</p>
          <Link href="/auth/register">Повторить регистрацию</Link>
        </div>
      )}
    </div>
  );
};

export default VerifyPage;
