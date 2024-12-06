export const formattedDate = (date: Date) => {
  const formattedDate = date.toString().split("T")[0];
  if (formattedDate) {
    const backAsDate = new Date(formattedDate);
    return backAsDate.toDateString();
  }
};

export const dateAsString = (date: Date) => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  let month: string | number = date.getMonth() + 1;
  const year = date.getFullYear().toString();
  let day: string | number = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }

  return `${year}-${month}-${day}`;
};
