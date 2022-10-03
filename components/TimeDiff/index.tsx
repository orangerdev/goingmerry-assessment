import { FunctionComponent, useContext } from "react"
import AppContext from "../../context/AppContext"

interface TimeDiffInterface {
  timezone: string
  abbreviation: string
  title: string
  localUnixtime: number
  location: {
    title: string
  }
}

function timeDifference(date1: number, date2: number) {
  let difference = 0
  let type = ""
  if (date1 < date2) {
    type = "behind"
    difference = date2 - date1
  } else {
    type = "ahead"
    difference = date1 - date2
  }

  const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24)
  difference -= daysDifference * 1000 * 60 * 60 * 24

  const hoursDifference = Math.floor(difference / 1000 / 60 / 60)
  difference -= hoursDifference * 1000 * 60 * 60

  const minutesDifference = Math.floor(difference / 1000 / 60)
  difference -= minutesDifference * 1000 * 60

  const secondsDifference = Math.floor(difference / 1000)

  return {
    type,
    days: daysDifference,
    hour: hoursDifference,
    minute: minutesDifference,
    second: secondsDifference,
  }
}

const TimeDiffComponent: FunctionComponent<TimeDiffInterface> = (props) => {
  const context = useContext(AppContext)
  const { localUnixtime, timezone, abbreviation, title, location } = props

  const hour = new Date(localUnixtime).toLocaleString("en-US", {
    timeZone: timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  })

  const timeDiff: any = timeDifference(
    new Date(
      new Date(localUnixtime).toLocaleString("en", { timeZone: timezone })
    ).getTime(),
    new Date(
      new Date(localUnixtime).toLocaleString("en", {
        timeZone: "Asia/Jakarta",
      })
    ).getTime()
  )

  // console.log(localUnixtime, unixtime)
  return (
    <div className="relative border border-black text-center py-4 px-6 mx-2">
      <span
        className="absolute cursor-pointer top-0 right-1"
        onClick={() => context.removeTimeZoneCard(timezone)}
      >
        x
      </span>
      <h1 className="leading-6 text-xl">{location.title}</h1>
      <h1 className="leading-6 text-sm">{title}</h1>
      <h3 className="text-4xl">{hour}</h3>
      <h4>{abbreviation}</h4>
      <span>
        {timeDiff.type === "ahead" && `${timeDiff.hour} hour(s) ahead Jakarta`}
        {timeDiff.type === "behind" &&
          `${timeDiff.hour} hours(s) behind Jakarta`}
      </span>
    </div>
  )
}

export default TimeDiffComponent
