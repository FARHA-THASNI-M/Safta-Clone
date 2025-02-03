import { useState } from "react";
import { toast } from "react-toastify";

interface DownloadResponse {
  isLoading: boolean;
  handleDownload: (workingGroupId: number, documentId: number) => Promise<void>;
  error: Error | null;
}

export const useDocumentDownload = (): DownloadResponse => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleDownload = async (
    workingGroupId: number,
    documentId: number
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://dev-portal.safta.sa/api/v1/workgroups/${workingGroupId}/documents/${documentId}/download`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Get token from your auth system
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      let fileName = "document.pdf";

      const contentDisposition = response.headers.get("content-disposition");
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, "");
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Document downloaded successfully!");
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to download document");
      setError(error);
      console.error("Error downloading document:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleDownload,
    error,
  };
};
