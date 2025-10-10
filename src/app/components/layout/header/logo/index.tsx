import { getImagePath } from "@/lib/utils/imagePath";
import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/" className="block">
      <div className="flex items-center">
        <Image
          src={getImagePath("/images/logo/logo.svg")}
          alt="Colio Logo"
          width={130}
          height={40}
          priority
          className="h-10 w-auto md:h-11 object-contain transition-transform duration-300 hover:scale-[1.03]"
        />
      </div>
    </Link>
  );
};

export default Logo;
