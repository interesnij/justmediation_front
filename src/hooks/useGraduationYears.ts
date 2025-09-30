import { useEffect, useState } from "react";
import { times } from "lodash";
import { getYear } from "date-fns";

export const useGraduationYears = () => {
  const [graduationYears, setGraduationYears] = useState<
    {
      title: string;
      id: number;
    }[]
  >([]);

  useEffect(() => {
    setGraduationYears(
      times(getYear(new Date()) - 1959).map((d) => {
        return { title: (d + 1960).toString(), id: d + 1960 };
      })
    );
    return () => {};
  }, []);

  return graduationYears;
};
