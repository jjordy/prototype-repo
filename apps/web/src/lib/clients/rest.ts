type REQUEST_TYPES = "get" | "post" | "put" | "patch" | "delete";

const requests = ["get", "post", "put", "patch", "delete"];

const ROOT_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

type ApiMethod = (
  url: string,
  data?: any,
  options?: RequestInit
) => Promise<any>;

type Api = Record<REQUEST_TYPES, ApiMethod>;

export const api: Api = requests.reduce((acc, curr) => {
  acc[curr] = async <T = any>(url: string, data?: T, options?: RequestInit) =>
    fetchData(url, curr, data, options);
  return acc;
}, {} as any);

const fetchData = async (
  url: string,
  method: string,
  data?: any,
  options?: RequestInit
) => {
  let response;
  try {
    response = await fetch(`${ROOT_URL}${url}`, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
      ...(options || {}),
    });
    if (response?.ok) {
      try {
        const data = await response.json();
        return data;
      } catch {
        return;
      }
    } else {
      if (response && response.body) {
        try {
          const errors = await response.json();
          throw errors;
        } catch {
          throw new Error(
            `Fetch::NoResponseJSON: ${response.status} - ${response.statusText}`
          );
        }
      }
    }
  } catch (err) {
    if (response) {
      throw err;
    } else {
      throw new Error(
        "Fetch::ConnectionError: Something went wrong contacting the API..."
      );
    }
  }
};
