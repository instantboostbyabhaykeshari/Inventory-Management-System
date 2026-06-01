export function getApiError(error, fallback = "Something went wrong. Please try again.") {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => (typeof item === "string" ? item : item?.msg))
      .filter(Boolean)
      .join(", ") || fallback;
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
}
