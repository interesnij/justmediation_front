import { API } from "helpers";

/**
 * Get specialties.
 */
export const getSpecialties = (id?) => {
  const params = {
    ordering: "id",
    created_by: id
  };
  return API().get("users/specialities/", { params });
};

/**
 * Get specialty by id.
 * @param id Id.
 */
export const getSpecialtyById = (id: number) => {
  return API().get(`users/specialities/${id}`);
};

/**
 * Create specialty .
 * @param title
 */
export const createSpecialty = (title) => {
  return API().post(`users/specialities/`, { title });
};

/**
 * Update specialty.
 * @param id
 * @param title
 */
export const updateSpecialty = (id, title) => {
  return API().put(`users/specialities/${id}/`, {title})
}

/**
 * Delete specialty.
 * @param id
 */
export const deleteSpecialty = (id) => {
  return API().delete(`users/specialities/${id}/`)
}


/**
 * GET {{ jus-law_dev_url }}/users/specialities/?created_by={user_id} - can get editable and delectable PA
 * PUT {{ jus-law_dev_url }}/users/specialities/ - update pa belong to user
 * DELETE {{ jus-law_dev_url }}/users/specialities/ - delete pa belong to user
 */