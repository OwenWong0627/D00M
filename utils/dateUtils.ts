// utils/dateUtils.ts
export const getLast7Days = () => {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push(date.toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'}).split('T')[0]); // Format date as YYYY-MM-DD
  }
  return result;
};

export const getDayLabel = (date: string) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const day = new Date(date).getDay();
  return days[day];
};
