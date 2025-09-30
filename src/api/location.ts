import { API } from "helpers";
/**
 * Get countries.
 */
export const getCountries = async () => {
  try {
    const res = await API().get("locations/countries/");
    return res.data
      ? res.data.results.map((item) => {
          return { title: item.name, id: item.id, code: item.code2 };
        })
      : [];
  } catch (error) {
    return [];
  }
};

/** Get states by country. */
export const getStates = async (country) => {
  try {
    const res = await API().get("locations/states/", {
      params: { country, limit: 100 },
    });
    return res.data
      ? res.data.results.map((item) => {
          return { title: item.name, id: item.id };
        })
      : [];
  } catch (error) {
    return [];
  }
};

/** Get cities by state. */
export const getCities = async (params) => {
  try {
    const res = await API({}, {}).get("locations/cities/?limit=1000", {
      params: {
        region: params?.state,
        search: params?.search,
      },
    });
    return res.data ? res.data.results : [];
  } catch (error) {
    return [];
  }
};

/**
 * Get top cities (FAA)
 */
export const getTopCities = async () => {
  try {
    const res = await API().get("locations/top-cities/");
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};
