import Image from "next/image";
import IndexImage from '@/public/images/index_image.png'
import Logo from '@/public/images/logo_koshunter.png'
import Header from "@/components/navbar";

export default function IndexPage() {
  return (
    <div>
      <Header/>

      {/* First Page */}
      <main className="px-40 py-4">
        <div className="flex justify-between">
          <div className="flex flex-col justify-center gap-2">
            <div>
              <h4 className="text-xl font-semibold text-primary">Kos Hunter</h4>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-7xl  font-bold">Find Your Kos <br /> Now</h1>
              <h4>Kos Hunter helps you find the perfect boarding house quickly and easily, <br /> anytime and anywhere</h4>
            </div>
            <div className="mt-4">
              <a href="/kos" className="bg-primary border-2 border-primary text-white px-16 py-4 rounded-md hover:bg-transparent hover:text-primary transition-all ease-in-out duration-300">Find Kos</a>
            </div>
          </div>

          <div>
            <Image src={IndexImage} width={650} height={650} alt="index image"/>
          </div>
        </div>
      </main>

      {/* Second Page */}
      <main>
        <div>
          <div>
            <h1>Affordable <span>Kos</span> Recommendations</h1>
          </div>
          <div>
            <a href="">See All</a>
          </div>
        </div>

        <div>
          <div>
            <div>Image</div>
            <div>
              <div>Male</div>
              <div><p>Rooms Left</p></div>
            </div>
            <div>
              <h1>Kost</h1>
              <h4>Facility</h4>
            </div>
            <div>
              <h1>Price</h1>
              <div><a href="">Book</a></div>
            </div>
          </div>
        </div>
      </main>
      
      <footer>
        <div>
          <div>
            <div>
              <Image src={Logo} alt="kos hunter logo" width={60} height={60} />
            </div>
            <div>
              <h4>Kos Hunter helps you find the perfect boarding house quickly and easily, anytime and anywhere.</h4>
            </div>
            <div>
              Social Media
            </div>
          </div>

          <div>
            <div>
              <h2>Kos Hunter</h2>
              <ul>
                <li>About Us</li>
                <li>How It Works</li>
                <li>Our Features</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h2>Legal & Privacy Policies</h2>
              <ul>
                <li>Privacy Policy</li>
                <li>Terms & Condition</li>
                <li>Cookie Policy</li>
                <li>User Agreement</li>
              </ul>
            </div>
            <div>
              <h2>Contact Us</h2>
              <ul>
                <li>Help Center</li>
                <li>Contact Support</li>
                <li>Our Email</li>
                <li>FAQ</li>
                <li>Report a Problem</li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <h4>Copyright © 2024 Kos Hunter. All rights reserved</h4>
        </div>
      </footer>
    </div>
  );
}
