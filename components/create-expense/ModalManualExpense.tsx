import { X } from "lucide-react";
import { useState } from "react";

interface ExpenseFormData {
  nominal: string;
  category: string;
  description: string;
}

export const ExpenseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseFormData) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    nominal: "",
    category: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="w-full flex gap-2 justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manual Input</h2>
          <X className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="nominal"
              className="block text-sm font-medium text-gray-700"
            >
              Nominal
            </label>
            <input
              type="text"
              id="nominal"
              name="nominal"
              value={formData.nominal}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-none focus:ring-0 p-3"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            ></textarea>
          </div>
          <div className="flex justify-start">
            <button
              type="submit"
              className="px-4 py-2 border-2 text-sm font-medium rounded-sm text-gray-600 border-gray-600 hover:opacity-80 focus:outline-none"
            >
              Create expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
