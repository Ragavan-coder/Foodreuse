
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div className="hero-pattern">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <div className="flex">
              <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                <span className="font-semibold text-green-600">New</span>
                <span className="h-4 w-[1px] bg-gray-900/10" aria-hidden="true" />
                <a href="https://chat.whatsapp.com/DkDsD4kq2olISxiogND1BC" target="_blank" className="flex items-center gap-x-1">
                  <span>Join our growing community</span>
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                    <path d="M5.75 12.5L10.25 8L5.75 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
            <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Rescue Food, <span className="text-green-500">Save Lives</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Connect with local charities and food banks to donate your excess food. 
              FoodRescue makes it easy to reduce waste while making a positive impact in your community.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button 
                className="bg-green-500 hover:bg-green-600"
                onClick={() => window.location.href = "/donate"}
              >Donate Food</Button>
              <Button 
                variant="outline" 
                className="text-orange-500 border-orange-500 hover:bg-orange-50"
                onClick={() => window.location.href = "/find-donations"}
              >Find Donations</Button>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <div className="relative mx-auto h-80 w-[30rem] max-w-full">
              <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply opacity-70 animate-blob"></div>
              <div className="absolute top-0 right-0 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-lime-300 rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80"
                  alt="Fresh vegetables and fruits"
                  className="relative h-64 w-64 object-cover rounded-full shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
        @keyframes blob {
          0% {
            transform: scale(1) translate(0px, 0px);
          }
          33% {
            transform: scale(1.1) translate(20px, -20px);
          }
          66% {
            transform: scale(0.9) translate(-20px, 20px);
          }
          100% {
            transform: scale(1) translate(0px, 0px);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        `}
      </style>
    </div>
  );
};

export default Hero;
