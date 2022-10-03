import axios from "axios"

export const getTime = async (timezone: string) => {
  return await axios(`https://worldtimeapi.org/api/timezone/${timezone}`).then(
    (response) => response.data
  )
}
