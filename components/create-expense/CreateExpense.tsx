"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Plus } from "lucide-react";
import { ExpenseModal } from "./ModalManualExpense";

interface Expense {
  id: number;
  date: string;
  category: string;
  type: string;
  amount: number;
}

const CreateExpense: React.FC = () => {
  const dummyData = [
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
    {
      id: 3,
      date: "20/08/2024",
      category: "Petrol",
      type: "Daily Expense",
      amount: 20000,
    },
    {
      id: 4,
      date: "20/08/2024",
      category: "Petrol",
      type: "Daily Expense",
      amount: 20000,
    },
    {
      id: 5,
      date: "20/08/2024",
      category: "Petrol",
      type: "Daily Expense",
      amount: 20000,
    },
    {
      id: 6,
      date: "20/08/2024",
      category: "Petrol",
      type: "Daily Expense",
      amount: 20000,
    },
    {
      id: 7,
      date: "20/08/2024",
      category: "Petrol",
      type: "Daily Expense",
      amount: 20000,
    },
    {
      id: 8,
      date: "20/08/2024",
      category: "Petrol",
      type: "Daily Expense",
      amount: 20000,
    },
  ];
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image Upload Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer h-64 flex items-center justify-center ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {image ? (
              <img
                src={image}
                alt="Uploaded"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <p className="text-gray-500">
                {isDragActive ? "Drop the image here" : "Upload Image"}
              </p>
            )}
          </div>
        </div>

        {/* Expense List Section */}
        <div className="bg-white p-4 rounded-lg shadow max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">List Expense</h2>
          <div className="space-y-2">
            {expenses.length === 0 && (
              <div className="flex justify-center h-20 items-center bg-gray-200/50 p-2 rounded">
                No data
              </div>
            )}

            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-center bg-gray-200/50 p-2 rounded"
              >
                <div className="flex-1">
                  <p className="text-sm">{expense.date}</p>
                  <p className="font-medium">{expense.category}</p>
                  <p className="text-sm text-gray-600">{expense.type}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold">
                    Rp{expense.amount.toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="sticky bottom-2 mt-4 w-14 h-14 bg-white shadow-md text-gray-600 rounded-full flex items-center justify-center border-2 border-gray-600 transition duration-300 float-right"
          >
            <Plus size={32} className="text-gray-600" />
          </button>
        </div>
      </div>
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => {}}
      />
    </div>
  );
};

export default CreateExpense;
