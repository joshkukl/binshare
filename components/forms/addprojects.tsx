"use client";
import React, { useState, useRef } from "react";
import { Box, TextField, FormControlLabel, Switch } from "@mui/material";

import FormSubmit from "./formsubmit";
import HandleSubmit from "@/library/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectModelType } from "../../models/project";
import { FormState } from "../../types/types";
import FormMessage from "./formmessage";

/**
 * Component will add a new project.
 */
const initialState: FormState = {
  message: "",
  errors: {},
  isError: false,
};

// Server Form Action
async function projectServerAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const formDataEntries: FormState =
    (await HandleSubmit(prevState, formData)) || {
      message: "",
      errors: {},
      isError: false,
    };
  return formDataEntries;
}

const AddProject: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FormState["errors"]>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const queryClient = useQueryClient();

  const projectMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await projectServerAction(initialState, formData);
    },
    mutationKey: ["projects"],
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previousGroups = queryClient.getQueryData<ProjectModelType[]>(["projects"]);
      return { previousGroups };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (_error, _newFormData, context) => {
      queryClient.setQueryData(["projects"], context?.previousGroups);
      console.error("Error creating project");
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    formData.set("type", "project");
    formData.set("active", isActive ? "on" : "off");

    try {
      await projectMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
      formRef.current?.reset();
      setIsActive(true);
    }
  };

  React.useEffect(() => {
    if (projectMutation.data?.errors) {
      setErrors({ ...projectMutation.data.errors });
    }
  }, [projectMutation.data]);

  const getFieldError = (field: string): string => {
    const v = (errors as Record<string, unknown>)?.[field];
    if (Array.isArray(v)) return String(v[0] ?? "");
    return typeof v === "string" ? v : "";
  };

  return (
    <section className="mt-6 p-6 border border-zinc-700 rounded-md">
      <h3 className="text-sm pb-2 font-semibold">Add a New Project</h3>

      <Box
        component="form"
        className="w-full max-w-xs"
        onSubmit={handleSubmit}
        ref={formRef}
        noValidate
      >
        <TextField
          required
          fullWidth
          margin="normal"
          label="Project Name"
          name="title"
          type="text"
          error={!!getFieldError("title")}
          helperText={getFieldError("title") || "Enter a unique title for the project"}
        />

        <TextField
          fullWidth
          margin="normal"
          multiline
          minRows={3}
          label="Project Description"
          name="description"
          error={!!getFieldError("description")}
          helperText={getFieldError("description")}
        />

        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              color="primary"
            />
          }
          label={isActive ? "Active" : "Dormant"}
        />

        <FormSubmit />
        <FormMessage message={projectMutation} />
      </Box>
    </section>
  );
};

export default AddProject;
