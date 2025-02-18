import Link from "next/link";

export function About() {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: "url('/carousel2.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-overlay bg-black bg-opacity-80"></div>
      <div className="hero-content text-white text-center">
        <div className="max-w-lg">
          <h1 className="mb-5 text-5xl font-bold">
            Effortless Laundry, Delivered to You
          </h1>
          <p className="mb-5 text-lg">
            No more laundry day stress! With Launderly, we'll pick up, wash, and
            deliver your clothes fresh and clean—straight to your doorstep.
          </p>
          <Link href={"/sign-in"}>
            <button className="btn btn-primary">Order Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
