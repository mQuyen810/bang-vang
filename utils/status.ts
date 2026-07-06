import { StatusVariant } from "@/components/ui/StatusTag";

export const getStatusVariant = (status: string): StatusVariant => {
  switch (status) {
    case "Overdue":
      return "danger";

    case "Warning":
      return "warning";

    case "Resolved":
      return "success";

    case "Done":
      return "success";

    case "Completed":
      return "success";

    case "Processing":
      return "processing";

    case "In Progress":
      return "processing";

    case "Open":
      return "primary";

    default:
      return "default";
  }
};
