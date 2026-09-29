import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollyExperience from './components/ScrollyExperience';
import BookingModal from './components/BookingModal';
import { FinalCTA, HowItWorks, ServicesGrid } from './components/Sections';
import { BookingProvider } from './context/BookingContext';

export default function App() {
  return (
    <BookingProvider>
      <a
        href="#experience"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to the escrow timeline
      </a>

      <Navbar />

      <main>
        <ScrollyExperience />
        <HowItWorks />
        <ServicesGrid />
        <FinalCTA />
      </main>

      <Footer />

      <BookingModal />
    </BookingProvider>
  );
}
