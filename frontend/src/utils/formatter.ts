export const formattedDate = (date: Date) => {
  const formattedDate = date.toString().split("T")[0];
  if (formattedDate) {
    const backAsDate = new Date(formattedDate);
    return backAsDate.toDateString();
  }
};
