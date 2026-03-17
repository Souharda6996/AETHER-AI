import GlassNavbar from "@/components/GlassNavbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import ChatDemo from "@/components/ChatDemo";
import ReviewsSection from "@/components/ReviewsSection";
import FounderSection from "@/components/FounderSection";
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
      <FounderSection />
      <FooterSection />
    </div>
  );
};

export default Index;
