import Image from "next/image";

interface ItextNotFound {
  text: string;
}

export default function NotFound({ text }: ItextNotFound) {
  return (
    <div className="justify-center items-center gap-4 w-full flex flex-col max-sm:mx-5">
      <Image src="/notFound.png" alt="even the image is not found :(" width={200} height={200} priority />
      <h1 className="text-3xl font-bold text-red-500">{text}</h1>
    </div>
  );
}
