import { redirect } from 'next/navigation'

export default function ReportWriteRedirect() {
  redirect('/community/write?board=report')
}
