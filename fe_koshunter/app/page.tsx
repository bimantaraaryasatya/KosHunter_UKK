import Image from "next/image";
import Logo from '@/public/images/logo_koshunter.png'
import IndexImage from '@/public/images/index_image.png'
import { BASE_FRONT_END_URL } from "@/global";

export default function IndexPage() {
  return (
    <div>
      <header>
        <div>
          <Image src={Logo} alt="kos hunter logo" width={60} height={60} />
        </div>
        <div>
          <div>
            <ul>
              <li>Find Kos</li>
              <li>Help Center</li>
              <li>Profile</li>
            </ul>
          </div>

          <div>
            <div>
              <a href={`${BASE_FRONT_END_URL}/login`}>Login</a>
            </div>
          </div>
        </div>
      </header>

      {/* First Page */}
      <main>
        <div>
          <div>
            <h4>Kos Hunter</h4>
          </div>
          <div>
            <h1>Find Your Kos Now</h1>
            <h4>Kos Hunter helps you find the perfect boarding house quickly and easily, anytime and anywhere</h4>
          </div>
          <div>
            <a href="">Find Kos</a>
          </div>
        </div>

        <div>
          <Image src={IndexImage} width={60} height={60} alt="index image"/>
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
