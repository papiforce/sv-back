const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replaceAll("'", "-")
    .replaceAll(".", "")
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .split(" ")
    .join("-");
};

export default slugify;
