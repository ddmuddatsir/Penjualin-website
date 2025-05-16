import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side: Image Section */}
      <div
        className="flex-1 bg-cover bg-center"
        style={{ backgroundImage: 'url("/path-to-your-image.jpg")' }}
      >
        <div className="flex justify-center items-center w-full h-full bg-black bg-opacity-50">
          <h1 className="text-white text-3xl font-bold">Welcome to CRM</h1>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex justify-center  bg-white">
        <div className="w-full max-w-md px-6 pt-20">
          <h2 className="text-2xl font-bold text-center mb-6">
            Login to Your Account
          </h2>
          <SignIn
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
