export const getAppointmentDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const generateAppointmentCode = (sequence: number, date = new Date()) => {
  const dateKey = getAppointmentDateKey(date).replaceAll("-", "");
  return `APT-${dateKey}-${String(sequence).padStart(3, "0")}`;
};
