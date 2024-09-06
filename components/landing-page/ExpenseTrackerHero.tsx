import React from "react";
import { Camera, DollarSign, Table } from "lucide-react";
import Link from "next/link";
import SupabaseLogo from "../SupabaseLogo";

const ExpenseTrackerHero: React.FC = () => {
  return (
    <div className=" text-white w-full bg-gradient-to-r from-purple-600 to-indigo-600">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Smart Expense Tracking Made Simple
            </h1>
            <p className="text-xl mb-8">
              Effortlessly manage your finances with our powerful expense
              tracker. Manual input or instant receipt scanning - you choose!
            </p>
            <div className="flex space-x-4">
              <Link href={"/login"}>
                <button
                  type="button"
                  className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition duration-300"
                >
                  Start Tracking
                </button>
              </Link>

              {/* <button className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition duration-300">
                Learn More
              </button> */}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard
              icon={<DollarSign size={40} />}
              title="Manual Input"
              description="Quickly add expenses with our user-friendly interface"
            />
            <FeatureCard
              icon={<Camera size={40} />}
              title="OCR Scanning"
              description="Capture receipt details instantly with smart scanning"
            />
            <FeatureCard
              icon={<Table size={40} />}
              title="Organized Data"
              description="View your expenses in clear tables"
            />
            <FeatureCard
              icon={<SupabaseLogo />}
              title="Supabase Powered"
              description="Secure, fast, and reliable data storage"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg">
      <div className="text-purple-300 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default ExpenseTrackerHero;
