export const metadata = {
   title: 'Register Owner | Kos Hunter',
   description: 'Kos Hunter',
}

type PropsLayout = {
   children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
   return (
       <div>{children}</div>
   )
}

export default RootLayout
