import AdminTemplate from "@/components/adminTemplate";
import MenuList from "../menuList";

export const metadata = {
   title: 'Dashboard Admin | Kos Hunter',
   description: 'Kos Hunter'
}

type PropsLayout = {
   children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
   return(
      <AdminTemplate title="Transaction" id="transaction" menuList={MenuList}>
         {children}
      </AdminTemplate>
   )
}

export default RootLayout