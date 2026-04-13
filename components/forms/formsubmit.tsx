"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import Button from "@mui/material/Button";

const FormSubmit: React.FC = () => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit" color="primary" variant="contained">
      {pending ? "Submitting..." : "Submit"}
    </Button>
  );
};

export default FormSubmit;
