"use client";

import { useEffect, useState } from "react";
import { getUserData, getOverallStats, getUserProgress } from "@/services/data";
import { User } from "@/models/User";
import DonutChart from "@/components/DonutChart";
import ProgressOverview from "@/components/ProgressOverview";

const DashboardPage = () => {
  const [currentUser, setCurrentUser] = useState<User>({
    _id: "",
    name: "",
    email: "",
    role: "student",
    summaries: [],
    tests: [],
    isVerified: true,
  });

  const [averageScore, setAverageScore] = useState<number>(0);
  const [testsTaken, setTestsTaken] = useState<number>(0);
  const [userProgress, setUserProgress] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response1 = await getUserData();
        if (response1) setCurrentUser(response1);

        const response2 = await getOverallStats();
        if (response2) {
          setAverageScore(response2.average || 0);
          setTestsTaken(response2.testsTaken || 0);
        }

        const response3 = await getUserProgress();
        if (response3) {
          console.log("User progress data:", response3);
          setUserProgress(response3);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Профиль</h1>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-medium">Имя:</span> {currentUser.name}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Email:</span> {currentUser.email}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Роль:</span>{" "}
            <span className="capitalize text-blue-600">{currentUser.role}</span>
          </p>
          <p className="text-sm text-gray-500">
            {currentUser.isVerified
              ? "Аккаунт подтверждён"
              : "Аккаунт не подтверждён"}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Результаты тестирования
        </h2>
        <p className="text-gray-600 mb-6">
          Общая статистика на основе ваших сданных тестов
        </p>

        <div className="flex justify-center">
          <DonutChart average={averageScore} testsTaken={testsTaken} />
        </div>

        <div className="max-w-3xl mx-auto mt-10">
          <ProgressOverview data={userProgress} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
