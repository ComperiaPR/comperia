import { Facebook, Instagram, Twitter } from 'lucide-react';

// TODO: replace with the real profile URLs.
// Google+ was shut down in 2019, so it was swapped for Instagram here.
const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Instagram', href: '#', icon: Instagram },
];

// Floating, non-invasive social bar anchored to the right edge of the viewport.
export function SocialLinks() {
  return (
    <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-all hover:scale-110 hover:bg-pr-blue"
        >
          <social.icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
