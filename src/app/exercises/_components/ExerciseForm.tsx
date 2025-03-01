"use client";

import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { exerciseCategories } from "@/app/_configs/exercise-categories";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export interface ExerciseValues {
  name?: string;
  link?: string;
  description?: string;
  category?: string;
  targetBpm?: number;
  currentBpm?: number;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  link: z.string(),
  description: z.string(),
  category: z.string(),
  targetBpm: z.number().optional(),
  currentBpm: z.number().optional(),
});

export default function ExerciseForm({
  initialValues,
  onSubmit,
}: {
  initialValues?: ExerciseValues;
  onSubmit: (values: Required<ExerciseValues>) => void;
}) {
  const router = useRouter();

  const form = useForm<Required<ExerciseValues>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      link: "",
      description: "",
      category: "",
      targetBpm: undefined,
      currentBpm: undefined,
      ...initialValues,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Exercise name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {exerciseCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input placeholder="Exercise link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Exercise description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="targetBpm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target BPM</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Target BPM"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || !isNaN(Number(value))) {
                        field.onChange(Number(value));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentBpm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current BPM</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Current BPM"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || !isNaN(Number(value))) {
                        field.onChange(Number(value));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
      <div className="flex flex-row mt-5">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          className="mr-4"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="animate-spin" />}
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
        <Button variant="secondary" onClick={handleBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
