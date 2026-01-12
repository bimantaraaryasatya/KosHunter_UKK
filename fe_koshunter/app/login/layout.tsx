export const metadata = {
   title: 'Login | Kos Hunter',
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
