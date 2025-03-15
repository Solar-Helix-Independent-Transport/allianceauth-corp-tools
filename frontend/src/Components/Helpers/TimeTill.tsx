import { Figure } from "react-bootstrap";
import ReactTimeAgo from "react-time-ago";

export declare interface TimeTillProps {
  date: string;
}

/*
https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
*/
function isValidDate(d: Date | number) {
  let numberCheck = d instanceof Number;
  if (numberCheck) {
    numberCheck = isNaN(d as number);
  }
  return Object.prototype.toString.call(d) === "[object Date]" && !numberCheck;
}

export function TimeTill({ date }: TimeTillProps) {
  const dateObj = new Date(date);
  // maybe just build my own dates. ISO or bust...
  const browserLocale = navigator.language || (navigator.languages || ["en"])[0];

  if (isValidDate(dateObj)) {
    return (
      <div className="text-nowrap">
        <ReactTimeAgo date={dateObj} />
        <br />
        <Figure.Caption>
          {dateObj.toLocaleString(browserLocale, {
            timeZone: "UTC",
            hour12: false,
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Figure.Caption>
      </div>
    );
  } else {
    return <></>;
  }
}
