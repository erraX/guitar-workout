"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button, Input } from "@nextui-org/react";
import { createExercise } from '@/actions/exercise';

const getInitialValues = () => ({
  name: "",
  description: "",
});

export default function ExercisesCreationPage() {
  const router = useRouter();

  const [values, setValues] = useState(getInitialValues());
  const reset = () => {
    setValues(getInitialValues());
  };

  const setFieldValue = (fieldName: keyof typeof values, value: string) => {
    setValues((values) => ({
      ...values,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    await createExercise(values);
    reset();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <Input
        type="name"
        label="Name"
        value={values.name}
        onChange={(evt) => setFieldValue("name", evt.target.value)}
      />
      <Input
        type="description"
        label="Description"
        value={values.description}
        onChange={(evt) => setFieldValue("description", evt.target.value)}
      />
      <Button color="primary" onClick={handleSubmit}>
        Submit
      </Button>
      <Button onClick={handleBack}>
        Back
      </Button>
    </div>
  );
}
