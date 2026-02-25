import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Mission from "@/components/landing/Mission";
import Programs from "@/components/landing/Programs";
import DonationCTA from "@/components/landing/DonationCTA";
import Events from "@/components/landing/Events";
import Gallery from "@/components/landing/Gallery";
import Testimonials from "@/components/landing/Testimonials";
import VolunteerCTA from "@/components/landing/VolunteerCTA";
import Newsletter from "@/components/landing/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Mission />
      <Programs />
      <DonationCTA />
      <Events />
      <Gallery />
      <Testimonials />
      <VolunteerCTA />
      <Newsletter />
    </>
  );
}

