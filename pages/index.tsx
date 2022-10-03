import type { NextPage } from "next"
import Head from "next/head"
import { useEffect, useState, useRef } from "react"
import TimeComponent from "../components/Time"
import TimeDiffComponent from "../components/TimeDiff"
import { Button, Modal, Input, Select } from "antd"
import { getTime } from "../helpers/time"
import AppContext from "../context/AppContext"
import { includes } from "lodash"
import styles from "../styles/Home.module.css"
import "antd/dist/antd.css"

const timeZoneOptions = [
  { timezone: "Asia/Singapore", title: "Singapore" },
  { timezone: "Asia/Tokyo", title: "Tokyo" },
  { timezone: "Asia/Seoul", title: "Seoul" },
  { timezone: "Australia/Melbourne", title: "Melbourne" },
  { timezone: "Australia/Sydney", title: "Sydney" },
  { timezone: "Europe/London", title: "London" },
  { timezone: "Europe/Paris", title: "Paris" },
  { timezone: "Europe/Berlin", title: "Berlin" },
  { timezone: "America/New_York", title: "New York" },
  { timezone: "America/Los_Angeles", title: "Los Angeles" },
]

const { Option } = Select

const Home: NextPage<any> = (props) => {
  const { localTime } = props
  const titleRef = useRef("")
  const timezoneRef = useRef("")
  const utcTimeStamp = new Date(
    new Date(localTime.utc_datetime).toISOString()
  ).getTime()

  const [timeZones, setTimeZones] = useState<any>([])
  const [timeZonesArray, setTimeZonesArray] = useState<string[]>([])
  const [otherTimes, setOtherTimes] = useState<any>([])
  const [unixTimestamp, setUnixTimestamp] = useState(utcTimeStamp)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const TikTokTikTok = () => {
    const time = setTimeout(() => {
      setUnixTimestamp((prevData) => prevData + 1000)
    }, 1000)
    return () => {
      clearTimeout(time)
    }
  }

  useEffect(() => {
    TikTokTikTok()
  }, [unixTimestamp])

  useEffect(() => {
    TikTokTikTok()
  }, [])

  useEffect(() => {
    if (timeZones.length > 0) {
      const temp: any = []
      Promise.all(
        timeZones.map((timeZone: any) => {
          getTime(timeZone.timezone).then((data) => {
            const location = timeZoneOptions.find((option: any) => {
              return timeZone.timezone === option.timezone
            })

            temp.push({ ...data, title: timeZone.title, location })
            if (temp.length === timeZones.length) {
              setOtherTimes(temp)
            }
          })
        })
      )
    } else {
      setOtherTimes([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZones])

  return (
    <AppContext.Provider
      value={{
        timeZoneOptions,
        removeTimeZoneCard: (timezone: string) => {
          const newTimeZones = timeZones.filter(
            (timeZone: any) => timeZone.timezone !== timezone
          )
          setTimeZones(newTimeZones)
          setTimeZonesArray((prevData) =>
            prevData.filter((data) => data !== timezone)
          )
        },
      }}
    >
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <TimeComponent
            {...localTime}
            unixtime={unixTimestamp}
            title="Jakarta"
          />

          <Button
            className="mb-4 rounded"
            onClick={() => {
              if (timeZonesArray.length >= 4) {
                alert("Reach limit to 4 cards")
                return
              }
              setIsModalOpen(true)
            }}
          >
            Add New Time Zone
          </Button>

          <div className="flex">
            {otherTimes.length > 0 &&
              otherTimes.map((otherTime: any, index: number) => {
                return (
                  <TimeDiffComponent
                    key={`time-${index}`}
                    {...otherTime}
                    localUnixtime={unixTimestamp}
                  />
                )
              })}
          </div>

          <Modal
            title="Add New Timezone Card"
            open={isModalOpen}
            onOk={() => {
              if (titleRef.current === "") {
                alert("Please fill the title")
                return
              }
              if (timezoneRef.current === "") {
                alert("You must choose a timezone")
                return
              } else if (includes(timeZonesArray, timezoneRef.current)) {
                alert("You have already added this timezone")
                return
              }

              setTimeZones((prevData: any) => [
                ...prevData,
                { timezone: timezoneRef.current, title: titleRef.current },
              ])

              setTimeZonesArray((prevData) => [
                ...prevData,
                timezoneRef.current,
              ])
              setIsModalOpen(false)
            }}
            onCancel={() => {
              setIsModalOpen(false)
            }}
            okText="Add"
          >
            <div className="mb-4">
              <label className="block mb-2" htmlFor="titleCard">
                Card Title
              </label>
              <Input
                placeholder="Basic usage"
                id="titleCard"
                onChange={(e) => {
                  titleRef.current = e.target.value
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="timeZoneCard">
                Timezone
              </label>
              <Select
                id="timeZoneCard"
                style={{ width: "100%" }}
                defaultValue=""
                onChange={(value) => {
                  timezoneRef.current = value
                }}
              >
                {timeZoneOptions.map((option: any, index: number) => (
                  <Option
                    key={`option-${index}`}
                    value={option.timezone}
                    disabled={includes(timeZonesArray, option.timezone)}
                  >
                    {option.title}
                  </Option>
                ))}
              </Select>
            </div>
          </Modal>
        </main>
      </div>
    </AppContext.Provider>
  )
}

export const getServerSideProps = async () => {
  const localTime = await getTime("Asia/Jakarta")

  return {
    props: { localTime },
  }
}

export default Home
