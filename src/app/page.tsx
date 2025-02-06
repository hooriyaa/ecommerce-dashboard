import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#029FAE]  flex items-center justify-center">
      <div className="container mx-auto text-white p-8 bg-opacity-90 backdrop-blur-md shadow-xl rounded-2xl max-w-3xl">
        <h1 className="text-4xl font-extrabold text-center mb-6">Welcome to the Admin Dashboard😊</h1>
        <p className="mt-4 text-lg text-center">Manage your products, orders, and reviews seamlessly.</p>
        <div className="mt-6 flex justify-center">
          <button className="bg-white text-[#029FAE] font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-200 transition">
            <Link href={"/admin/login"}>
            Get Started
            </Link>   
          </button>
        </div>
      </div>
    </div>
  );
}


