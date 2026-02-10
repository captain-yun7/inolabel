import { redirect } from 'next/navigation'

export default function MemeWriteRedirect() {
  redirect('/community/write?board=meme')
}
