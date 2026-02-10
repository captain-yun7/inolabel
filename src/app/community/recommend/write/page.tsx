import { redirect } from 'next/navigation'

export default function RecommendWriteRedirect() {
  redirect('/community/write?board=recommend')
}
