import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";
import { BACKEND_BASE_URL } from "@/constants";
import { GetOneResponse, ListResponse } from "@/types";
import { CreateResponse } from "@refinedev/core";

if (!BACKEND_BASE_URL) {
  throw new Error(
    "BACKEND_BASE_URL is not configured. Please set VITE_BACKEND_BASE_URL in your .env file.",
  );
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = "Requset Failed";

  try {
    const payload = (await response.json()) as { message?: string };
    if (payload?.message) message = payload.message;
  } catch {
    // Ignore error
  }
  return {
    message,
    statusCode: response.status,
  };
};

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,
    buildQueryParams: async ({ resource, pagination, filters }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string | number> = { page, limit: pageSize };
      filters?.forEach((filter) => {
        const field = "field" in filter ? filter.field : "";

        const value = String(filter.value);
        if (resource == "subjects") {
          if (field == "department") params.department = value;
          if (field == "name" || field == "code") params.search = value;
        }
        if (resource == "classes") {
          if (field == "subject") params.subject = value;
          if (field == "name") params.search = value;
          if (field == "teacher") params.teacher = value;
        }
        if (resource == "users") {
          if (field == "role") params.role = value;
          if (field == "name" || field == "email") params.search = value;
        }
        if (resource == "enrollments") {
          if (field == "classId") params.classId = value;
          if (field == "studentId") params.studentId = value;
        }
      });
      return params;
    },
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const payload: ListResponse = await response.clone().json();
      return payload.data ?? [];
    },
    getTotalCount: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const payload: ListResponse = await response.clone().json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },
  create: {
    getEndpoint: ({ resource }) => resource,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();
      return json.data ?? {};
    },
  },
  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,
    mapResponse: async (response) => {
      const json: GetOneResponse = await response.json();
      return json.data ?? [];
    },
  },
  update: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,
    buildBodyParams: async ({ variables }) => variables,
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const json = await response.json();
      return (json as CreateResponse).data ?? {};
    },
  },
  deleteOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      return {};
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);
export { dataProvider };
