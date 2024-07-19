const getNextActivation = (schedule, startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // If the current date is outside the campaign period, return null
  if (now < start || now > end) {
    return null;
  }

  const currentDayIndex = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // Define days of the week for easier comparison
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Convert schedule times to minutes for comparison
  const sortedSchedule = schedule
    .map(item => ({
      ...item,
      dayIndex: daysOfWeek.indexOf(item.day),
      timeInMinutes: parseInt(item.startTime.split(':')[0]) * 60 + parseInt(item.startTime.split(':')[1]),
    }))
    .sort((a, b) => (a.dayIndex - b.dayIndex) || (a.timeInMinutes - b.timeInMinutes));

  for (let item of sortedSchedule) {
    if (item.dayIndex > currentDayIndex || (item.dayIndex === currentDayIndex && item.timeInMinutes > currentTime)) {
      const nextActivationDate = new Date(now);
      if (item.dayIndex !== currentDayIndex) {
        nextActivationDate.setDate(nextActivationDate.getDate() + ((item.dayIndex + 7 - currentDayIndex) % 7));
      }
      nextActivationDate.setHours(...item.startTime.split(':').map(Number));
      nextActivationDate.setMinutes(0, 0, 0); // Reset seconds and milliseconds
      if (nextActivationDate >= start && nextActivationDate <= end) {
        return nextActivationDate;
      }
    }
  }

  // If no future activation time found, return the first time in the next week if it's within the campaign period
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + ((sortedSchedule[0].dayIndex + 7 - currentDayIndex) % 7));
  nextWeek.setHours(...sortedSchedule[0].startTime.split(':').map(Number));
  nextWeek.setMinutes(0, 0, 0); // Reset seconds and milliseconds
  if (nextWeek >= start && nextWeek <= end) {
    return nextWeek;
  }
  return null;
};


module.exports = {
  getNextActivation
}