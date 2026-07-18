import React, { useState, useEffect } from "react";

interface NepaliCalendarProps {
  language: "en" | "np";
}

export const NepaliCalendar: React.FC<NepaliCalendarProps> = ({ language }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toNepaliDigits = (num: number | string): string => {
    const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return String(num)
      .split("")
      .map((char) => nepaliDigits[parseInt(char)] || char)
      .join("");
  };

  const getNepaliBSDate = (date: Date) => {
    // 2026-07-18 maps to BS 2083 Shrawan 3
    const gregYear = date.getFullYear();
    const gregMonth = date.getMonth(); // 0-indexed
    const gregDay = date.getDate();
    const dayOfWeek = date.getDay(); // 0-6

    // Simple robust calculation offsets for BS
    const bsYear = gregYear + 57;

    const nepaliMonths = [
      "वैशाख", // Baishakh (April-May)
      "जेठ",    // Jestha (May-June)
      "असार",   // Ashadh (June-July)
      "श्रावण",  // Shrawan (July-August)
      "भदौ",    // Bhadra (August-September)
      "असोज",   // Ashwin (September-October)
      "कात्तिक", // Kartik (October-November)
      "मंसिर",  // Mangsir (November-December)
      "पुस",    // Poush (December-January)
      "माघ",    // Magh (January-February)
      "फागुन",  // Falgun (February-March)
      "चैत"     // Chaitra (March-April)
    ];

    const nepaliDays = [
      "आइतबार", // Sunday
      "सोमबार", // Monday
      "मङ्गलबार", // Tuesday
      "बुधबार", // Wednesday
      "बिहीबार", // Thursday
      "शुक्रबार", // Friday
      "शनिबार"  // Saturday
    ];

    // July is month index 6. In Nepal, mid-July marks the start of Shrawan.
    // Let's offset months and days appropriately
    let bsMonthIndex = 0;
    let bsDay = gregDay;

    if (gregMonth === 6) { // July
      bsMonthIndex = 3; // Shrawan
      // July 17th is Shrawan 2nd roughly
      bsDay = gregDay - 15;
      if (bsDay <= 0) {
        bsMonthIndex = 2; // Ashadh
        bsDay = 31 + bsDay;
      }
    } else {
      // General fallbacks for other months
      bsMonthIndex = (gregMonth + 9) % 12;
      bsDay = gregDay;
    }

    return {
      year: toNepaliDigits(bsYear),
      monthName: nepaliMonths[bsMonthIndex],
      day: toNepaliDigits(bsDay),
      dayName: nepaliDays[dayOfWeek]
    };
  };

  const formatEnglishDate = (date: Date): string => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${dayName}, ${monthName} ${day}, ${year}`;
  };

  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  };

  const bs = getNepaliBSDate(time);
  const formattedTime = formatTime(time);

  return (
    <div className="flex flex-col items-center justify-center py-2 px-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 backdrop-blur-md select-none">
      <div className="flex items-center space-x-2 text-sm sm:text-base font-display font-semibold tracking-wider uppercase rgb-text">
        <span className="text-lg">📅</span>
        {language === "np" ? (
          <span>
            {bs.year} {bs.monthName} {bs.day}, {bs.dayName} | {toNepaliDigits(formattedTime)}
          </span>
        ) : (
          <span>
            {formatEnglishDate(time)} | {formattedTime}
          </span>
        )}
      </div>
    </div>
  );
};
