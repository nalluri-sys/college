import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>VVIT Materials Hub - Engineering Study Resources for All Semesters</title>
        <meta
          name="description"
          content="Access free study materials, lecture notes, previous year papers and assignments for all 7 semesters at VVIT. Your complete engineering resource hub."
        />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <CTASection variant="contribute" />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
