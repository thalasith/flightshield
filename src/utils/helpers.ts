export const getFormattedDate = (timestamp: number) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(timestamp);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${month || "Jan"} ${
    day.toString().padStart(2, "0") || "01"
  }, ${year || "2020"}`;

  return formattedDate;
};

export const getFormattedTime = (timestamp: number) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  const formattedTime = `${hours || 12}:${
    minutes.toString().padStart(2, "0") || "00"
  } ${ampm || "AM"}`;
  return formattedTime;
};
