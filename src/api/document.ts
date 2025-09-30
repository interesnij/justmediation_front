import { API } from "helpers";
import { MATTERS_PER_PAGE } from "config";

/**
 * Get documents
 */
interface DocumentSearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  matter?: number;
  parent?: number;
  client?: number;
  isTemplate?: boolean;
  is_parent?: boolean;
  ordering?: string;
  owner?: string | number;
  is_vault?: boolean;
}
export const getDocuments = async ({
  page = 0,
  pageSize = MATTERS_PER_PAGE,
  search = "",
  matter,
  parent,
  client,
  isTemplate = false,
  is_parent,
  ordering,
  is_vault = false,
  owner,
}: DocumentSearchParams) => {
  let params = {
    search: search,
    limit: pageSize,
    offset: page * pageSize,
    is_template: isTemplate,
    matter,
    parent,
    client,
    is_parent,
    ordering: ordering || "-modified",
    is_vault: is_vault,
    owner,
  };
  try {
    const res = await API().get("documents/", {
      params,
    });
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

export const getOnyDocuments = async ({
  page = 0,
  pageSize = MATTERS_PER_PAGE,
  search = "",
  matter,
  parent,
  client,
  isTemplate = false,
  ordering,
  is_parent,
  is_vault = false,
  owner,
}: DocumentSearchParams) => {
  let params = {
    ordering,
    search: search,
    limit: pageSize,
    offset: page * pageSize,
    is_template: isTemplate,
    matter,
    parent,
    client,
    is_vault,
    is_parent,
    owner,
  };
  try {
    const res = await API().get("documents/documents", {
      params,
    });
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

export const getOnyFolders = async ({
  page = 0,
  pageSize = MATTERS_PER_PAGE,
  search = "",
  ordering,
  matter,
  parent,
  client,
  isTemplate = false,
  is_vault = false,
  is_parent,
  owner,
}: DocumentSearchParams) => {
  let params = {
    ordering,
    search: search,
    limit: pageSize,
    offset: page * pageSize,
    is_template: isTemplate,
    matter,
    parent,
    client,
    is_vault,
    is_parent,
    owner,
  };
  try {
    const res = await API().get("documents/folders", {
      params,
    });
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

export const getDocumentImages = async ({
  page = 0,
  pageSize = MATTERS_PER_PAGE,
  search = "",
  ordering,
  matter,
  parent,
  client,
  isTemplate = false,
  is_vault = false,
  is_parent,
  owner,
}: DocumentSearchParams) => {
  let params = {
    ordering,
    search: search,
    limit: pageSize,
    offset: page * pageSize,
    is_template: isTemplate,
    matter,
    parent,
    client,
    type: "image",
    is_vault,
    is_parent,
    owner,
  };
  try {
    const res = await API().get("documents/documents", {
      params,
    });
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

export const getDocumentVoices = async ({
  page = 0,
  pageSize = MATTERS_PER_PAGE,
  search = "",
  ordering,
  matter,
  parent,
  client,
  isTemplate = false,
  is_vault = false,
  is_parent,
  owner,
}: DocumentSearchParams) => {
  let params = {
    ordering,
    search: search,
    limit: pageSize,
    offset: page * pageSize,
    is_template: isTemplate,
    matter,
    parent,
    client,
    type: "audio",
    is_vault,
    is_parent,
    owner,
  };
  try {
    const res = await API().get("documents/documents", {
      params,
    });
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

export const getDocumentByMe = async (
  {
    page = 0,
    pageSize = MATTERS_PER_PAGE,
    search = "",
    ordering,
    matter,
    parent,
    client,
    isTemplate = false,
    is_vault = false,
    is_parent,
  }: DocumentSearchParams,
  userId
) => {
  let params = {
    ordering,
    search: search,
    limit: pageSize,
    offset: page * pageSize,
    is_template: isTemplate,
    matter,
    parent,
    client,
    owner: userId,
    is_vault,
    is_parent,
  };
  try {
    const res = await API().get("documents", {
      params,
    });
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

export const getDocumentSharedWithMe = async (
  {
    page = 0,
    pageSize = MATTERS_PER_PAGE,
    search = "",
    ordering,
    matter,
    parent,
    client,
    isTemplate = false,
    is_vault = false,
    is_parent,
  }: DocumentSearchParams,
  userId
) => {
  let params = {
    ordering,
    search: search,
    limit: pageSize,
    offset: page * pageSize,
    is_template: isTemplate,
    matter,
    parent,
    client,
    shared_with: userId,
    is_vault,
    is_parent,
  };
  try {
    const res = await API().get("documents", {
      params,
    });
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

/**
 * Get templates
 */
export const getTemplates = async ({
  page = 0,
  pageSize = MATTERS_PER_PAGE,
  search = "",
  ordering,
}: DocumentSearchParams) => {
  let params = {
    ordering,
    search: search,
    limit: pageSize,
    offset: page * pageSize,
    is_template: true,
  };
  try {
    const res = await API().get("documents/", {
      params,
    });
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

/**
 * Create a new folder
 */
interface NewFolderProps {
  matter?: string;
  title: string;
  parent?: number | null;
  is_template?: boolean;
  client?: string | number;
  shared_with?: any[];
  is_vault?: boolean;
}
export const createNewFolder = async ({
  matter,
  title,
  parent = null,
  is_template = false,
  client,
  shared_with = [],
  is_vault,
}: NewFolderProps) => {
  let params = {
    matter,
    title,
    parent,
    is_template,
    client,
    shared_with,
    is_vault,
  };
  try {
    const res = await API().post("documents/folders/", params);
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

/**
 * Create a new document
 */
interface CreateDocumentProps {
  parent: number | null;
  matter?: number;
  client?: number;
  file: string;
  title: string;
  is_template?: boolean;
  is_vault?: boolean;
}
export const createDocument = (params: CreateDocumentProps) => {
  return API().post("documents/documents/", params);
};

/** Update a document */
interface UpdateDocumentProps {
  id: number;
  data: {
    parent?: number | null;
    matter?: number;
    client?: number;
    file?: string;
    title?: string;
    is_template?: boolean;
    is_vault?: boolean;
  };
}
export const updateDocument = async ({ id, data }: UpdateDocumentProps) => {
  try {
    const res = await API().patch(`documents/documents/${id}/`, data);
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

/** Delete folder */
export const deleteFolder = (id: number) => {
  return API().delete(`/documents/folders/${id}`);
};

/** Update a folder */
interface UpdateFolderProps {
  id: number;
  data: NewFolderProps;
}
export const updateFolder = async ({ id, data }: UpdateFolderProps) => {
  try {
    const res = await API().put(`documents/folders/${id}/`, data);
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

/** Delete document */
export const deleteDocument = (id: number) => {
  return API().delete(`/documents/documents/${id}`);
};

/** Duplicate document */
export const duplicateDocument = (id: number, data) => {
  return API().post(`/documents/documents/${id}/duplicate/`, data);
};

/** Duplicate folder */
export const duplicateFolder = (id: number) => {
  return API().post(`/documents/folders/${id}/duplicate/`);
};

/** Remove share with for folder */
export const removeShareWithFolder = (id: number, data) => {
  return API().post(`/documents/folders/${id}/remove_shared_with/`, data);
};

/** Remove share with for document */
export const removeShareWithDocument = (id: number, data) => {
  return API().post(`/documents/documents/${id}/remove_shared_with/`, data);
};

/** Add share with for folder */
export const addShareWithFolder = (id: number, data) => {
  return API().post(`/documents/folders/${id}/add_shared_with/`, data);
};

/** Add share with for document */
export const addShareWithDocument = (id: number, data) => {
  return API().post(`/documents/documents/${id}/add_shared_with/`, data);
};

/** Download folder */
export const downloadFolder = (id: number) => {
  return API().post(`/documents/folders/${id}/download/`);
};
