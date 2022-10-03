import { FunctionComponent } from "react"

interface TimeDiffInterface {
  unixtime: number
  timezone: string
  abbreviation: string
}

const TimeDiffComponent: FunctionComponent<TimeDiffInterface> = (props) => {
  const { unixtime, timezone, abbreviation } = props

  const hour = new Date(unixtime).toLocaleString("en-US", {
    timeZone: timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="text-center ml-5">
      <h3>
        {hour} {abbreviation}
      </h3>
    </div>
  )
}

export default TimeDiffComponent
