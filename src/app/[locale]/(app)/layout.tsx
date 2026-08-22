import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <MobileNav />
    </div>
  )
}