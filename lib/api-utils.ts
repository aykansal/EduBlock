import { toast } from "sonner";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    return {
      error: error.message,
      code: error.code,
      status: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      status: 500,
    };
  }

  return {
    error: "An unexpected error occurred",
    status: 500,
  };
}

export function showErrorToast(error: unknown) {
  if (error instanceof ApiError) {
    toast.error(error.message, {
      description: error.code ? `Error code: ${error.code}` : undefined,
    });
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("An unexpected error occurred");
  }
}

export function showSuccessToast(message: string, description?: string) {
  toast.success(message, {
    description,
  });
} 