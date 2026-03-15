import Image from "next/image";

export default function GetInTouchSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f3f3f3]">
      <div className="relative h-136 w-full md:h-160 lg:h-184">
        <Image
          src="/Gemini_Generated_Image_keeg33keeg33keeg.png"
          alt="People pulling rope together"
          fill
          priority={false}
          className="object-cover object-center"
        />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-350 flex-col items-center justify-center px-4 text-center md:px-8 lg:px-10">
          <p className="text-xl font-medium text-[#1a1f3b] md:text-3xl">
            Partner With Us
          </p>

          <h2 className="mt-2 font-serif text-4xl font-bold leading-tight text-[#171a34] md:text-6xl">
            Let’s Build Youth Careers Together
          </h2>

          <a
            href="#"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-[#63c37a] px-12 text-xl font-bold text-white transition-colors hover:bg-[#459557]"
          >
            Call / Text: 9348629818
          </a>
        </div>
      </div>
    </section>
  );
}
