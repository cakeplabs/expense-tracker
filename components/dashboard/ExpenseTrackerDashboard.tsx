"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const ExpenseTrackerDashboard = () => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: "20/08/2024",
      category: "Petrol",
      type: "Daily Expense",
      amount: 20000,
    },
    {
      id: 2,
      date: "20/08/2024",
      category: "Petrol",
      type: "Daily Expense",
      amount: 20000,
    },
  ]);

  const [currentMonth, setCurrentMonth] = useState<any>(new Date());

  const totalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const removeExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const formatMonth = (date: string) => {
    return date.toLocaleString();
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <div className="container mx-auto p-4 rounded-lg w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">This Week</h2>
          <p className="text-3xl font-bold">
            Rp {totalExpense.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">This Month</h2>
          <p className="text-3xl font-bold">
            Rp {totalExpense.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col gap-10">
        <div className="w-full flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
          <div className="flex justify-between items-center w-[200px]">
            <button onClick={prevMonth} className="p-2">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-semibold">August</h2>
            <button onClick={nextMonth} className="p-2">
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="min-w-[200px] w-full sm:w-fit flex justify-end">
            <Link
              href={"/dashboard/create-expense"}
              className="w-full text-center rounded-sm shadow-md px-4 py-2 border-2 border-gray-600 font-medium"
            >
              Track Expense
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b">
                  <td className="p-2">{expense.date}</td>
                  <td className="p-2">{expense.category}</td>
                  <td className="p-2">{expense.type}</td>
                  <td className="p-2 text-right">
                    Rp {expense.amount.toLocaleString()}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => removeExpense(expense.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTrackerDashboard;
