import ProductRequirementsForm from "@/components/ProductRequirementsForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
export default function MakePrdPage() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        id="train-model-container"
        className="flex flex-1 flex-col gap-2 px-2"
      >
        <Link href="/dashboard" className="text-sm w-fit">
          <Button variant={"outline"}>
            <FaArrowLeft className="mr-2" />
            Go Back
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Fill This PRD Form</CardTitle>
            <CardDescription>
              Fill this form to create a new PRD.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <ProductRequirementsForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
