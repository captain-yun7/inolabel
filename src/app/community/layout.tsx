import CommunityShell from '@/components/community/CommunityShell'

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CommunityShell>{children}</CommunityShell>
}
