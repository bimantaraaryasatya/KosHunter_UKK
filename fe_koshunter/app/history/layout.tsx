import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kos Hunter: Find Your Own Kos",
  description: "Kos Hunter",
};

type PropsLayout = {
  children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
  return (
    <>
      {children}
    </>
  )
}

export default RootLayout
