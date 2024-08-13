"use client";

import { Button } from "@/components/ui/button";
import { projectsRow } from "@/types/utils";
import Link from "next/link";
import { FaImages } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PlusCircle } from "lucide-react";

type ClientSidePrdListProps = {
  projectModels: projectsRow[];
};

export default function ClientSidePrdList({
  projectModels,
}: ClientSidePrdListProps) {
  return (
    <div id="prd-list-container" className="w-full">
      <div className="flex flex-row gap-4 w-full justify-between items-center text-center mb-6">
        <h1 className="text-2xl font-bold">Your PRD Projects</h1>
        {/* <Link href="/dashboard/make-prd">
          <Button size="sm">Create New PRD</Button>
        </Link> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Link href="/dashboard/make-prd">
          <Card className="bg-gray-50 text-center hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Create New PRD</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full flex justify-center">
                <PlusCircle size={64} className="text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </Link>
        {projectModels.map((project) => (
          <Link href={`/dashboard/prd/${project.id}`} key={project.id}>
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle>{project.product_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                  Feature: {project.feature_name}
                </p>
                <p className="text-sm">
                  {project.overview.substring(0, 100)}...
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
