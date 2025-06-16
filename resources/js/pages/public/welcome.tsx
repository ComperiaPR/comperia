import { Head } from '@inertiajs/react';

import { FeaturesSection } from '@/pages/public/components/features-section';
import { Footer } from '@/pages/public/components/footer';
import { Header } from '@/pages/public/components/header';
import { HeroSection } from '@/pages/public/components/hero-section';
import { PricingSection } from '@/pages/public/components/pricing-section';
import { StatsSection } from '@/pages/public/components/stats-section';
import { TestimonialsSection } from '@/pages/public/components/testimonials-section';

export default function Welcome() {

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-background">
                <Header />
                <main>
                    <HeroSection />
                    <FeaturesSection />
                    <StatsSection />
                    <PricingSection />
                    <TestimonialsSection />
                </main>
                <Footer />
            </div>
        </>
    );
}
