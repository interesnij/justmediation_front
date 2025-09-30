export const convertArray = (param: { id: number; title: string }[]) => {
  return param.map(({ id, title }) => {
    return {
      label: title,
      value: id,
    };
  });
};
