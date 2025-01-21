type APIError = {
  status: string;
  data: {
    message: string;
    data: null;
  };
};

export const handleApiError = (error: unknown): string => {
  if (error && typeof error === "object" && "data" in error) {
    const errorMessage = (error as APIError).data.message;
    return errorMessage;
  } else if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};
