document.addEventListener("DOMContentLoaded", function() {
    initCal();
});

let EVENT_MODAL;

const CALENDAR_EVENTS = [
    {
      name: 'Running',
      day: 'Wednesday',
      time: '09:00',
      modality: 'In-Person',
      location: 'Boulder',
      url: '',
      attendees: 'Alice, Jack, Ben',
    },
  ];

const CALENDAR_DAYS = [
'Sunday',
'Monday',
'Tuesday',
'Wednesday',
'Thursday',
'Friday',
'Saturday',
];

function getTodayWeekStartFormed(){
  const currentDate = new Date();
  // Calculate the start of the week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() - 1);
  // Format dates as YYYY-MM-DD for SQL queries
  const formattedStartOfWeek = startOfWeek.toISOString().slice(0, 10);

  console.log("Start of the week:", formattedStartOfWeek);

  return formattedStartOfWeek;
}

function getTodayWeekEndFormed(){
  const currentDate = new Date();
  // Calculate the end of the week (Saturday)
  const endOfWeek = new Date(currentDate);
  endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
  // Format dates as YYYY-MM-DD for SQL queries
  const formattedEndOfWeek = endOfWeek.toISOString().slice(0, 10);

  console.log("End of the week:", formattedEndOfWeek);

  return formattedEndOfWeek;
}

// function getDayCol(day){
//   // Get the current date
//     const currentDate = day;
//     // Calculate the start of the week (Sunday)
//     const startOfWeek = new Date(currentDate);
//     startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() - 1);
//     // Calculate the end of the week (Saturday)
//     const endOfWeek = new Date(currentDate);
//     endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));

//     //determine all the days in between
//     const mon = new Date(currentDate);
//     mon.setDate(startOfWeek.getDate() + 1);
//     const tue = new Date(currentDate);
//     tue.setDate(startOfWeek.getDate() + 2);
//     const wed = new Date(currentDate);
//     wed.setDate(startOfWeek.getDate() + 3);
//     const thu = new Date(currentDate);
//     thu.setDate(startOfWeek.getDate() + 4);
//     const fri = new Date(currentDate);
//     fri.setDate(startOfWeek.getDate() + 5);

//     // Format dates as YYYY-MM-DD for SQL queries
//     const formattedStartOfWeek = startOfWeek.toISOString().slice(0, 10);
//     const formattedMon = mon.toISOString().slice(0,10);
//     const formattedTue = tue.toISOString().slice(0,10);
//     const formattedWed = wed.toISOString().slice(0,10);
//     const formattedThu = thu.toISOString().slice(0,10);
//     const formattedFri = fri.toISOString().slice(0,10);
//     const formattedEndOfWeek = endOfWeek.toISOString().slice(0, 10);
//   //</date logic>

//   var weekJson = {
//     days: [
//       { dayName: 'Sunday', date: formattedStartOfWeek },
//       { dayName: 'Monday', date: formattedMon },
//       { dayName: 'Tuesday', date: formattedTue },
//       { dayName: 'Wednesday', date: formattedWed },
//       { dayName: 'Thursday', date: formattedThu },
//       { dayName: 'Friday', date: formattedFri },
//       { dayName: 'Saturday', date: formattedEndOfWeek },
//     ]
//   };

//   //debugging:
//     // console.log('--------:getDayCol() return:--------');
//     // console.log(weekJson);

//   return weekJson;
// }

// function getTodayCol(){
//   const todayDate = new Date();
//   const weekDates = getDayCol(todayDate);
//   return weekDates;
// }

function initializeEventModal() {
    console.log('Initializing event modal...');//These console logs show up in the web browser console, so you have to go there to check if they are printing correctly
    const modalElement = document.getElementById("event-modal");
    console.log('Modal element:', modalElement);
    if (modalElement) {
      EVENT_MODAL = new bootstrap.Modal(modalElement);
    } else {
      console.error('Modal element not found!');
    }
}

function initCal() {
    console.log('Initializing the calendar...');
    // const weekBookends = getTodayCol();
    initializeEventModal(); 
}

function eventsForDay(day) {
  return events.filter(event => event.day === day);
}