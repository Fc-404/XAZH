import axios from 'axios'
import { formatDate } from '../util/formatDate.tool'

export async function DailyQuoteEnAPI(date: Date) {
  const d = formatDate('YYYY-MM-DD', date)
  // const result = await axios.get(
  //   'https://apiv3.shanbay.com/weapps/dailyquote/quote/?date=' + d,

  // )
  const result = await axios.get('/api' + d)

  console.log(result)
}
