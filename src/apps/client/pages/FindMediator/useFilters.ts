import React, { useEffect, useState } from "react";
import { useInput } from "hooks";

export const useFilters = (rawData: any[]) => {
  const experienceFilter = useInput(0);
  const languageFilter = useInput(0);
  const freeConsultationFilter = useInput(false);
  const videoCallFilter = useInput(false);
  const [filteredData, setData] = useState(rawData);

  const filterData = () => {
    setData(
      rawData.filter(item => {
        if (experienceFilter.value && item?.years_of_experience < +experienceFilter.value) 
          return false; 
        if (languageFilter.value && item?.spoken_language?.indexOf(+languageFilter.value) === -1)
          return false;
        if (freeConsultationFilter.value && item?.fee_types?.indexOf(5) === -1)
          return false;
        if (videoCallFilter.value && item?.appointment_type?.indexOf(2) === -1)
          return false; 
        return true;
      })
    )
  }

  useEffect(() => {
    if (rawData.length || (!rawData.length && filteredData.length))
      filterData();
  }, [
    rawData,
    experienceFilter.value,
    languageFilter.value,
    freeConsultationFilter.value,
    videoCallFilter.value, 
  ])

    return {
      filteredData,
      experienceFilter,
      freeConsultationFilter,
      languageFilter,
      videoCallFilter
    }
}