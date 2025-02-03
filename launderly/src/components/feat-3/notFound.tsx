import Image from "next/image";

interface ItextNotFound{
    text: string
}

export default function NotFound({text} : ItextNotFound) {
    return(
        <div className="justify-center items-center gap-4 flex flex-col">
            <Image
            src="/notFound.png"
            alt="even the image is not found :("
            width={300}
            height={300}
            />
            <h1 className="text-3xl font-bold my-20 text-red-500">{text}</h1>
        </div>
    )
}