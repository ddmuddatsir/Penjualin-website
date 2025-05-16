// app/register/page.tsx
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side: Image Section */}
      <div className="flex-1 bg-cover bg-center relative">
        <Image
          src="https://images.unsplash.com/photo-1710361197301-d3cd03b34561?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Workspace"
          width={800}
          height={1200}
          className={` object-cover h-full`}
        />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white  text-center opacity-100">
          <h1 className="text-2xl font-extrabold sm:text-3xl lg:text-5xl text-shadow-md ">
            Welcome to Penjualin, Your Ultimate CRM Sales Solution
          </h1>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex justify-center  bg-white">
        <div className="w-full max-w-md px-6 pt-20">
          <h2 className="text-2xl font-bold text-center mb-6">
            Sign Up Your Account
          </h2>
          <SignUp
            signInUrl="/auth/login"
            appearance={{
              variables: {
                colorBackground: "white",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
