// Timezone utility for automatic time conversion
export const formatEventTime = (utcDateString, userTimezone = null) => {
  try {
    const date = new Date(utcDateString);

    // Get user's timezone automatically if not provided
    const timezone = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Format the date according to user's locale and timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
      timeZoneName: 'short'
    });

    return formatter.format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return utcDateString; // Fallback to original string
  }
};

export const formatSlotTime = (utcDateString, userTimezone = null) => {
  try {
    const date = new Date(utcDateString);

    // Get user's timezone automatically if not provided
    const timezone = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Format just the time for slots
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
      timeZoneName: 'short'
    });

    return formatter.format(date);
  } catch (error) {
    console.error('Error formatting time:', error);
    return utcDateString; // Fallback to original string
  }
};

export const formatEventDate = (utcDateString, userTimezone = null) => {
  try {
    const date = new Date(utcDateString);

    // Get user's timezone automatically if not provided
    const timezone = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Format just the date for events
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timezone
    });

    return formatter.format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return utcDateString; // Fallback to original string
  }
};

export const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error('Error getting user timezone:', error);
    return 'UTC'; // Fallback to UTC
  }
};

export const isToday = (utcDateString, userTimezone = null) => {
  try {
    const date = new Date(utcDateString);
    const timezone = userTimezone || getUserTimezone();

    const today = new Date();
    const eventDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const todayDate = new Date(today.toLocaleString('en-US', { timeZone: timezone }));

    return eventDate.toDateString() === todayDate.toDateString();
  } catch (error) {
    console.error('Error checking if today:', error);
    return false;
  }
};

export const isTomorrow = (utcDateString, userTimezone = null) => {
  try {
    const date = new Date(utcDateString);
    const timezone = userTimezone || getUserTimezone();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const eventDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const tomorrowDate = new Date(tomorrow.toLocaleString('en-US', { timeZone: timezone }));

    return eventDate.toDateString() === tomorrowDate.toDateString();
  } catch (error) {
    console.error('Error checking if tomorrow:', error);
    return false;
  }
};