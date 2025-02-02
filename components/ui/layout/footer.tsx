import Image from "next/image";

export default function Footer() {
  return (
    <>
      <div className="flex w-full justify-center bg-white h-20 items-center">
        <Image
          src="/images/regulated.jpg"
          alt="Logo"
          quality={100}
          width={300}
          height={300}
        />
      </div>
    </>
  );
}
