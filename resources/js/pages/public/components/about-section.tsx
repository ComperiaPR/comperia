import { AboutContent } from '@/components/about-content';

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-pr-blue mb-4">About Us</h2>
        </div>

        <AboutContent />
      </div>
    </section>
  )
}
