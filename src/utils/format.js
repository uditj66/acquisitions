export const formatValidationError = errors => {
  if (!errors || !errors.issues) return 'Validation Failed';
  // If there is error and  we have array of error then
  if (Array.isArray(errors.issues))
    return errors.issues.map(error => error.message).join(',');

  //   If we have single error then
  return json.stringify(errors);
};
