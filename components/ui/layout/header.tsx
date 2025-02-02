import Image from "next/image";

export default function Header() {
  return (
    <div className="flex w-full h-28 justify-center items-center bg-white shadow-md relative">
      <Image
        src="/images/sentinel-logo.png"
        alt="Logo"
        quality={100}
        width={300}
        height={300}
      />
    </div>
  );
}
