
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DonationForm from "@/components/DonationForm";
import ProtectedRoute from "@/components/ProtectedRoute";

const Donate = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="flex justify-center">
            <DonationForm />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Donate;
