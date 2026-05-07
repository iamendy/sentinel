import Menu from "@/components/icons/Github";
import Link from "next/link";
import { Logo } from "./icons";

const Navbar = () => {
  return (
    <nav className="bg-black/80 w-full backdrop-blur-md">
      <div className="flex px-4 py-5 lg:px-10 justify-between items-center xl:max-w-[1400px] mx-auto xl:px-0">
        <Link href="/" className="flex space-x-1 items-center">
          <Logo />
          <span className="font-semibold text-lg"> Sentinel</span>
        </Link>
        <Menu />
      </div>
    </nav>
  );
};
export default Navbar;
