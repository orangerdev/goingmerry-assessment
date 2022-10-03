import { FunctionComponent, useContext } from "react"
import AppContext from "../../context/AppContext"

interface TimeDiffInterface {
  unixtime: number
  timezone: string
  abbreviation: string
  title: string
}

const TimeDiffComponent: FunctionComponent<TimeDiffInterface> = (props) => {
  const context = useContext(AppContext)
  const { unixtime, timezone, abbreviation, title } = props

  const hour = new Date(unixtime).toLocaleString("en-US", {
    timeZone: timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="relative border border-black text-center py-4 px-6 mx-2">
      <span
        className="absolute cursor-pointer top-0 right-1"
        onClick={() => context.removeTimeZoneCard(timezone)}
      >
        x
      </span>
      <h1 className="leading-6 text-xl">{title}</h1>
      <h3 className="text-4xl">{hour}</h3>
      <h4>{abbreviation}</h4>
    </div>
  )
}

export default TimeDiffComponent
