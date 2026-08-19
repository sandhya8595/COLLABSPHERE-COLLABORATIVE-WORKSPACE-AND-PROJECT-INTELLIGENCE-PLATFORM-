import { formatDistanceToNow, format, isToday, isTomorrow, isPast } from 'date-fns';

export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatDueDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'MMM d, yyyy');
};

export const isOverdue = (date) => {
  if (!date) return false;
  return isPast(new Date(date)) && !isToday(new Date(date));
};

export const formatFullDate = (date) => {
  if (!date) return '';
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
};
