import ManagerTemplate from "@/components/adminTemplate";
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
      <ManagerTemplate title="Kos" id="kos" menuList={MenuList}>
         {children}
      </ManagerTemplate>
   )
}

export default RootLayout