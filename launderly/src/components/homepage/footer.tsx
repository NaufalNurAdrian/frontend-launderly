import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bagian Kiri - Logo dan Deskripsi */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                clipRule="evenodd"
                className="fill-white"
              >
                <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
              </svg>
              <h2 className="text-xl font-bold">Launderly Ltd.</h2>
            </div>
            <p className="mt-3 text-gray-400">
              Best Laundry in town. We take care of your clothes with love! 💙
            </p>
          </div>

          {/* Bagian Tengah - The Team */}
          <div className="text-center md:text-left">
            <h6 className="text-lg font-semibold text-white">The Team</h6>
            <div className="flex flex-col gap-2 mt-3">
              <Link
                href="https://www.linkedin.com/in/muhammad-naufal04/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                Muno
              </Link>
              <Link
                href="https://www.linkedin.com/in/naufal-nur-adrian-613705234/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                Nopal
              </Link>
              <Link
                href="http://linkedin.com/in/nuaysa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                Allysa
              </Link>
            </div>
          </div>

          {/* Bagian Kanan - Sosial Media */}
          <div className="text-center md:text-left">
            <h6 className="text-lg font-semibold text-white">Follow Us</h6>
            <div className="flex justify-center md:justify-start gap-4 mt-3">
              <Link href="#" className="text-gray-400 hover:text-white">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.12 8.438 9.88v-6.992H7.89v-2.888h2.548V9.789c0-2.508 1.492-3.89 3.774-3.89 1.096 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.626.771-1.626 1.562v1.873h2.772l-.443 2.888h-2.329V22C18.343 21.12 22 16.991 22 12z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21.638 6.344a8.577 8.577 0 0 1-2.41.66 4.2 4.2 0 0 0 1.847-2.31 8.436 8.436 0 0 1-2.674 1.02 4.153 4.153 0 0 0-7.044 3.78 11.786 11.786 0 0 1-8.551-4.333 4.154 4.154 0 0 0 1.284 5.535 4.147 4.147 0 0 1-1.88-.517v.05a4.153 4.153 0 0 0 3.323 4.07 4.183 4.183 0 0 1-1.874.07 4.16 4.16 0 0 0 3.887 2.89A8.352 8.352 0 0 1 2 18.076a11.715 11.715 0 0 0 6.29 1.847c7.547 0 11.675-6.254 11.675-11.676 0-.178-.004-.356-.013-.532a8.302 8.302 0 0 0 2.056-2.122z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400">
          © {new Date().getFullYear()} Launderly Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
