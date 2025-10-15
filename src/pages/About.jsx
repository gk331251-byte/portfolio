import { Download } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-light-text dark:text-dark-text">
            About Me
          </h1>

          {/* Photo Placeholder */}
          <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-6xl font-bold">
            GK
          </div>
        </div>

        {/* Story Sections */}
        <div className="space-y-12">
          {/* Background */}
          <section className="bg-light-bg dark:bg-dark-bg p-8 rounded-lg shadow-lg border border-neutral/20">
            <h2 className="text-3xl font-bold mb-4 text-primary dark:text-secondary">
              Background
            </h2>
            <p className="text-lg leading-relaxed text-light-text dark:text-dark-text mb-4">
              I graduated from Tulane University with a degree in Engineering Physics, where I ranked
              2nd in my major with a 3.8 GPA. My academic journey combined rigorous theoretical foundations
              with hands-on problem-solving, from quantum mechanics to computational modeling.
            </p>
            <p className="text-lg leading-relaxed text-light-text dark:text-dark-text">
              During my time at Tulane, I worked in a quantum optics research lab, developing experimental
              setups and analyzing complex data sets. This experience taught me to translate abstract
              concepts into practical implementations—a skill that has proven invaluable in my technical career.
            </p>
          </section>

          {/* Transition */}
          <section className="bg-light-bg dark:bg-dark-bg p-8 rounded-lg shadow-lg border border-neutral/20">
            <h2 className="text-3xl font-bold mb-4 text-primary dark:text-secondary">
              The Transition
            </h2>
            <p className="text-lg leading-relaxed text-light-text dark:text-dark-text mb-4">
              After graduation, I discovered my passion for cloud architecture and customer-facing technical
              work. I pursued and earned my GCP Professional Cloud Architect certification, diving deep into
              distributed systems, infrastructure as code, and scalable application design.
            </p>
            <p className="text-lg leading-relaxed text-light-text dark:text-dark-text">
              I've since built full-stack applications deployed on Google Cloud Platform, integrated complex
              third-party APIs, and created technical demonstrations for diverse audiences. The transition from
              physics to tech felt natural—both fields require breaking down complex systems, identifying core
              principles, and communicating findings clearly.
            </p>
          </section>

          {/* What I Do */}
          <section className="bg-light-bg dark:bg-dark-bg p-8 rounded-lg shadow-lg border border-neutral/20">
            <h2 className="text-3xl font-bold mb-4 text-primary dark:text-secondary">
              What I Do
            </h2>
            <p className="text-lg leading-relaxed text-light-text dark:text-dark-text mb-4">
              As a Solutions Engineer, I specialize in translating complex technical concepts into
              customer-facing solutions. I build proof-of-concept integrations, design cloud architectures
              for scalability and cost-efficiency, and create compelling technical demonstrations that
              showcase product capabilities.
            </p>
            <p className="text-lg leading-relaxed text-light-text dark:text-dark-text mb-4">
              My technical toolkit includes FastAPI, React, Docker, Google Cloud Platform, and a variety
              of third-party APIs including Stripe, Google Maps, and authentication providers. I'm
              comfortable working across the full stack and enjoy the challenge of making technical
              products accessible and valuable to customers.
            </p>
            <p className="text-lg leading-relaxed text-light-text dark:text-dark-text">
              What sets me apart is my ability to bridge technical depth with customer empathy. I don't
              just understand the technology—I understand how to position it, explain it, and demonstrate
              its value in ways that resonate with technical and non-technical stakeholders alike.
            </p>
          </section>

          {/* What's Next */}
          <section className="bg-light-bg dark:bg-dark-bg p-8 rounded-lg shadow-lg border border-neutral/20">
            <h2 className="text-3xl font-bold mb-4 text-primary dark:text-secondary">
              What's Next
            </h2>
            <p className="text-lg leading-relaxed text-light-text dark:text-dark-text mb-4">
              I'm seeking Solutions Engineer or Customer Success Engineer roles at B2B SaaS companies
              where I can leverage my technical skills and customer-facing abilities. I'm particularly
              drawn to companies with complex technical products, API-first platforms, or cloud-native
              architectures.
            </p>
            <p className="text-lg leading-relaxed text-light-text dark:text-dark-text">
              I'm excited about opportunities to build technical relationships, design custom integrations,
              and help customers unlock the full potential of innovative platforms. If you're looking for
              someone who can code, architect, and communicate with equal confidence, let's connect.
            </p>
          </section>
        </div>

        {/* Resume Download Button */}
        <div className="mt-16 text-center">
          <a
            href="/images/demos/resume/Resume-GavinKelly.pdf"
            download="Gavin_Kelly_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-primary dark:bg-secondary text-white dark:text-dark-bg rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            <Download size={20} />
            <span>Download Resume</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
