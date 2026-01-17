import AdminTemplate from "@/components/adminTemplate";
import MenuList from "../menuList";

export const metadata = {
   title: 'Dashboard Owner | Kos Hunter',
   description: 'Kos Hunter'
}

type PropsLayout = {
   children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
   return(
      <AdminTemplate title="Kos" id="kos" menuList={MenuList}>
         {children}
      </AdminTemplate>
   )
}

export default RootLayout