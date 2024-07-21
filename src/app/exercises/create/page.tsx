"use client";

import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { createExercise } from '@/actions/exercise';

export default function ExercisesCreationPage() {
  const [values, setValues] = useState({
    name: "",
    description: "",
  });

  const setFieldValue = (fieldName: keyof typeof values, value: string) => {
    setValues((values) => ({
      ...values,
      [fieldName]: value,
    }));
  };

  const handleSubmit = () => {
    createExercise(values);
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
    </div>
  );
}
