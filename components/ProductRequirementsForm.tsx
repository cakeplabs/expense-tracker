"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createProjectAction } from "@/app/actions/createProjectAction";

interface ErrorState {
  message: string;
  details: string;
}

const formSchema = z.object({
  productName: z.string().min(1, "Product Name is required"),
  featureName: z.string().min(1, "Feature Name is required"),
  overview: z.string().min(1, "Overview is required"),
  featureList: z.string(),
  userFeedback: z.string(),
  additionalDetails: z.string(),
});

export default function ProductRequirementsForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      featureName: "",
      overview: "",
      featureList: "",
      userFeedback: "",
      additionalDetails: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      console.log("Submitting form data Client:", formData);

      const result = await createProjectAction(formData);

      if (result.success) {
        console.log("PRD generated successfully", result.prdId);
        router.push(`/dashboard/prd/${result.prdId}`);
      } else {
        setError({
          message: result.error || "An unknown error occurred",
          details: result.details || "No additional details provided",
        });
      }
    } catch (e) {
      setError({
        message: "An unexpected error occurred while generating the PRD",
        details: e instanceof Error ? e.message : String(e),
      });
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>{error.message}</AlertTitle>
            <AlertDescription>{error.details}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-bold">
            1. Tell us about your Product and Feature
          </h2>
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Product Name <span className="text-pink-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Superalink Storefront" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="featureName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Feature Name <span className="text-pink-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="1 Day Coupon" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="overview"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Give an Overview / Explanation{" "}
                  <span className="text-pink-500">*</span>
                </FormLabel>
                <FormDescription>
                  The basics of what you are building
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Build a personal finance tracking software for salaried professionals allowing them to track income and expenditure and plan their finances"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold">
            2. Details of the Feature and User Feedback
          </h2>
          <FormField
            control={form.control}
            name="featureList"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feature List</FormLabel>
                <FormDescription>
                  Details of all the features that needs to be build
                </FormDescription>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userFeedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Feedback</FormLabel>
                <FormDescription>
                  Add evidence of qualitative feedback here
                </FormDescription>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="additionalDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Do you have any more details you can share?</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Generating..." : "Generate My PRD ✨"}
        </Button>
      </form>
    </Form>
  );
}
