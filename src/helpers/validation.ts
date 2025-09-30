export const validatePhone = (
  value: string,
  countryPhoneObject: object
) => {
  const empty = "Phone number is required.";
  const invalid = "Phone number is invalid.";

  if (value?.length <= 1) return empty;
  
  // @ts-ignore
  if (!countryPhoneObject?.dialCode) 
    return;

  // @ts-ignore
  if (!value?.startsWith('+' + countryPhoneObject?.dialCode)) return invalid; 
  
  // @ts-ignore
  if (countryPhoneObject?.format?.match(/[.]/g, '').length + 1 !== value.length)
    return invalid;

  return; 
}