export const metadata = {
  title: "Batteriproffs Studio",
  robots: { index: false, follow: false },
}

export default function StudioLayout({ children }) {
  return (
    <div style={{ height: "100vh" }}>
      {children}
    </div>
  )
}
