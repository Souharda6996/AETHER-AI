import GlassNavbar from "@/components/GlassNavbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import ChatDemo from "@/components/ChatDemo";
import ReviewsSection from "@/components/ReviewsSection";
import PricingSection from "@/components/PricingSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <GlassNavbar />
      <HeroSection />
      <FeaturesSection />
      <ArchitectureSection />
      <ChatDemo />
      <ReviewsSection />
      <PricingSection />
      <FooterSection />
    </div>
  );
};

export default Index;
