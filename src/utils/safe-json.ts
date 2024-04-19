export const stringify = (json: any) => {
  try {
    return JSON.stringify(json);
  } catch (error) {
    console.warn('stringify json error', error);
  }
  return '';
};

export const parse = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.warn('parse json error', error);
  }
  return null;
};
