"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { exerciseCategories } from "@/app/_configs/exercise-categories";

export interface ExerciseValues {
  name?: string;
  link?: string;
  description?: string;
  category?: string;
}

export default function ExerciseForm({
  initialValues,
  onSubmit,
}: {
  initialValues?: ExerciseValues;
  onSubmit: (values: Required<ExerciseValues>) => void;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Required<ExerciseValues>>({
    name: "",
    link: "",
    description: "",
    category: "",
    ...initialValues,
  });

  const setFieldValue = (fieldName: keyof typeof values, value: string) => {
    setValues((values) => ({
      ...values,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    onSubmit(values);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex w-full flex-col">
      <Select
        className="mb-5"
        selectedKeys={[values.category]}
        onChange={(evt) => setFieldValue("category", evt.target.value)}
        items={exerciseCategories}
        label="Category"
        placeholder="Select an category"
      >
        {(category) => (
          <SelectItem key={category.value}>{category.label}</SelectItem>
        )}
      </Select>
      <Input
        className="mb-5"
        type="name"
        label="Name"
        value={values.name}
        onChange={(evt) => setFieldValue("name", evt.target.value)}
      />
      <Input
        className="mb-5"
        type="link"
        label="Link"
        value={values.link}
        onChange={(evt) => setFieldValue("link", evt.target.value)}
      />
      <Input
        className="mb-5"
        type="description"
        label="Description"
        value={values.description}
        onChange={(evt) => setFieldValue("description", evt.target.value)}
      />
      <div className="flex">
        <Button className="mr-5" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
        <Button onClick={handleBack}>Back</Button>
      </div>
    </div>
  );
}
