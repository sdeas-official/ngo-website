"use client";

import Image from "next/image";

export default function GetInTouchSection() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Mobile */}
      <div className="md:hidden">
        <div className="relative w-full">
          <Image
            src="/reviewimage.jpeg"
            alt="People pulling rope together"
            width={800}
            height={600}
            priority={false}
            className="h-auto w-full object-contain object-center"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="relative hidden h-160 w-full md:block lg:h-184">
        <Image
          src="/reviewimage.jpeg"
          alt="People pulling rope together"
          fill
          priority={false}
          className="h-full w-full object-contain object-center"
        />
      </div>
    </section>
  );
}
