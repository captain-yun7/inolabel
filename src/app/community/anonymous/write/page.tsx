import { redirect } from 'next/navigation'

export default function AnonymousWriteRedirect() {
  redirect('/community/write?board=anonymous')
}
