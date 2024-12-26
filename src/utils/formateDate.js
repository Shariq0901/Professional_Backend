const formatDate = (date) => {
  const d = new Date(date);
  if (isNaN(d)) return "Invalid Date";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = String(hours).padStart(2, "0");
  return `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
};
module.exports=  {formatDate};