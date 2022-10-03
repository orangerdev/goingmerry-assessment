import { FunctionComponent } from "react"

interface Props {
  unixtime: number
  timezone: string
  title: string
}

const TimeComponent: FunctionComponent<Props> = (props) => {
  const { unixtime, timezone, title } = props

  const hour = new Date(unixtime).toLocaleString("en-US", {
    timeZone: timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="text-center">
      <h1 className="leading-6 text-2xl" role="heading">
        {title}
      </h1>
      <h3 className="text-8xl py-8">{hour}</h3>
    </div>
  )
}

export default TimeComponent
