export async function parseErrorResponse(response: Response) {
  let message = "Unknown error.";

  try {
    const data = await response.json();

    if (data.message) {
      message = data.message;
    } else if (Array.isArray(data.errors) && data.errors.length > 0) {
      message = data.errors[0];
    } else {
      message = response.statusText || message;
    }
  } catch {
    message = response.statusText || message;
  }

  return {
    message,
    status: response.status,
  };
}