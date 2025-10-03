export const formatPhone = (input: string) : string => {
  const regex = (/^0[45]/.test(input))
    ? /^(\d{4})(\d{3})(\d{3})$/
    : /^(\d{2})(\d{4})(\d{4})$/

  return input.replace(regex, '$1 $2 $3');
};

export const sanitisePhone = (input: string) : string => input.replace(/[^\d]+/g, '');
