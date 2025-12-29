import { SparklesSection } from '../components/SparklesSection';
import {
  Marquee,
  MarqueeFade,
} from '../components/Marquee';
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
  TestimonialVerifiedBadge,
} from '../components/Testimonials';

interface TestimonialData {
  authorAvatar: string;
  authorName: string;
  authorTagline: string;
  url: string;
  quote: string;
}

const TESTIMONIALS: TestimonialData[] = [
  {
    authorAvatar: '/images/paaji.png',
    authorName: 'Manu Arora',
    authorTagline: 'CEO @ AceternityUI',
    url: '#',
    quote: 'Pretty cool portfolio, loved the \'Hello\' intro & the UI',
  },
  {
    authorAvatar: '/images/Bun.svg',
    authorName: 'Programmer Filthi',
    authorTagline: 'Youtuber',
    url: '#',
    quote: 'Impressive UI/UX and projects',
  },
  {
    authorAvatar: '/images/mcaupy.png',
    authorName: 'Vishal Yadav',
    authorTagline: 'SWE @ Microsoft & Youtuber',
    url: '#',
    quote: 'Loved every single bit of the portfolio ❤️',
  },
];

export function TestimonialsSection() {
  return (
    <SparklesSection
      id="testimonials"
      className="scroll-section relative bg-[var(--bg-color)] text-[var(--text-color)] py-0 px-0 transition-colors duration-300
        before:content-[''] before:absolute before:left-1/2 before:top-0 before:-translate-x-1/2 before:w-screen before:border-t before:border-dashed before:border-[var(--edge)] before:h-0 before:pointer-events-none before:z-0 before:transition-colors before:duration-300"
    >
      <div className="w-full bg-[var(--bg-color)] relative overflow-hidden">
        <div className="relative max-w-[750px] mx-auto">
          <MarqueeFade side="left" />
          <MarqueeFade side="right" />
          <Marquee
            className="border-y border-[var(--edge)]"
            speed={40}
            pauseOnHover
            gradient={false}
            autoFill
          >
            {TESTIMONIALS.map((item, index) => (
              <div
                key={index}
                className="mx-2 h-auto w-80 flex-shrink-0"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full hover:opacity-90 transition-opacity duration-200"
                >
                  <Testimonial>
                    <TestimonialQuote>
                      <p className="text-[var(--text-color)] text-[16px] leading-relaxed font-normal">
                        {item.quote}
                      </p>
                    </TestimonialQuote>
                    <TestimonialAuthor>
                      <TestimonialAvatar>
                        <TestimonialAvatarImg
                          src={item.authorAvatar || '/images/pfp.jpg'}
                          alt={item.authorName}
                        />
                        <TestimonialAvatarRing />
                      </TestimonialAvatar>
                      <div className="flex flex-col">
                        <TestimonialAuthorName>
                          {item.authorName}
                          <TestimonialVerifiedBadge />
                        </TestimonialAuthorName>
                        <TestimonialAuthorTagline>
                          {item.authorTagline}
                        </TestimonialAuthorTagline>
                      </div>
                    </TestimonialAuthor>
                  </Testimonial>
                </a>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </SparklesSection>
  );
}

