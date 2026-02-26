export default function Home() {
  return (
    <>
      {/* Intro */}
      <section>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">Spencer Reyka</h1>
        <p className="text-muted text-[0.9rem] mb-4">AI Team Lead · Los Angeles, CA</p>
        <p className="text-[#bbb] text-[0.95rem] max-w-[520px] mb-3">
          I build backend systems and AI tooling.
        </p>
        <p className="text-[#bbb] text-[0.95rem] max-w-[520px] mb-3">
          Currently leading AI product development at Packback — plagiarism detection, real-time
          feedback, and the infra holding it all together.
        </p>
        <p className="text-[#bbb] text-[0.95rem] max-w-[520px]">
          Previously at Compass, ExxonMobil, and Northrop Grumman.
        </p>
      </section>

      {/* Links */}
      <h2 className="section-heading">Links</h2>
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
        <a href="https://github.com/SpencerReyka" target="_blank" rel="noopener" className="text-accent text-sm hover:underline">GitHub</a>
        <a href="https://linkedin.com/in/spencerreyka" target="_blank" rel="noopener" className="text-accent text-sm hover:underline">LinkedIn</a>
        <a href="mailto:spencer.reyka@gmail.com" className="text-accent text-sm hover:underline">Email</a>
        <a href="/Reyka-Resume.pdf" target="_blank" rel="noopener" className="text-accent text-sm hover:underline">Resume</a>
      </div>

      {/* Projects */}
      <h2 className="section-heading">Projects</h2>

      <div className="mb-7">
        <div className="flex justify-between items-baseline gap-4 flex-wrap">
          <span className="font-semibold text-[0.95rem]">
            <a href="https://github.com/SpencerReyka" className="text-accent hover:underline">project-one</a>
          </span>
          <span className="text-[0.8rem] text-muted whitespace-nowrap">In progress</span>
        </div>
        <p className="text-[0.85rem] text-muted mt-1">Placeholder — something you're currently building.</p>
      </div>

      <div className="mb-7">
        <div className="flex justify-between items-baseline gap-4 flex-wrap">
          <span className="font-semibold text-[0.95rem]">
            <a href="https://github.com/SpencerReyka" className="text-accent hover:underline">project-two</a>
          </span>
          <span className="text-[0.8rem] text-muted whitespace-nowrap">2024</span>
        </div>
        <p className="text-[0.85rem] text-muted mt-1">Placeholder — short description of what this does and why it's cool.</p>
      </div>

      <div className="mb-7">
        <div className="flex justify-between items-baseline gap-4 flex-wrap">
          <span className="font-semibold text-[0.95rem]">
            <a href="https://github.com/SpencerReyka" className="text-accent hover:underline">project-three</a>
          </span>
          <span className="text-[0.8rem] text-muted whitespace-nowrap">2023</span>
        </div>
        <p className="text-[0.85rem] text-muted mt-1">Placeholder — short description of what this does and why it's cool.</p>
      </div>

      {/* Experience */}
      <h2 className="section-heading">Experience</h2>

      <div className="mb-7">
        <div className="flex justify-between items-baseline gap-4 flex-wrap">
          <span className="font-semibold text-[0.95rem]">
            AI Team Lead —{' '}
            <a href="https://packback.co" target="_blank" rel="noopener" className="text-accent hover:underline">Packback</a>
          </span>
          <span className="text-[0.8rem] text-muted whitespace-nowrap">Feb 2024 – Present</span>
        </div>
        <p className="text-[0.85rem] text-muted mt-1 mb-2">Los Angeles, CA</p>
        <ul className="entry-list list-none p-0 space-y-[0.15rem]">
          <li className="text-[0.875rem] text-[#aaa]">Own the full dev cycle across FastAPI and Django microservices on GCP Kubernetes</li>
          <li className="text-[0.875rem] text-[#aaa]">Shipped AI-powered plagiarism detection, real-time feedback chatbots, and grammar correction</li>
          <li className="text-[0.875rem] text-[#aaa]">Overhauled GitLab CI infrastructure — cut queue times, execution durations, and compute costs</li>
          <li className="text-[0.875rem] text-[#aaa]">Led evaluation and transitions across SERP APIs, AI detection models, and prompt tooling</li>
        </ul>
      </div>

      <div className="mb-7">
        <div className="flex justify-between items-baseline gap-4 flex-wrap">
          <span className="font-semibold text-[0.95rem]">
            Backend Engineer —{' '}
            <a href="https://compass.com" target="_blank" rel="noopener" className="text-accent hover:underline">Compass</a>
          </span>
          <span className="text-[0.8rem] text-muted whitespace-nowrap">Jun 2021 – Nov 2022</span>
        </div>
        <p className="text-[0.85rem] text-muted mt-1 mb-2">Seattle, WA</p>
        <ul className="entry-list list-none p-0 space-y-[0.15rem]">
          <li className="text-[0.875rem] text-[#aaa]">Built emailing features for a CRM serving 25k agents — OAuth, scheduling, templating, retries, across 50M DB records and 400k req/month</li>
          <li className="text-[0.875rem] text-[#aaa]">Implemented transactional outbox pattern publishing 10M weekly events from Postgres to Kafka via Debezium</li>
          <li className="text-[0.875rem] text-[#aaa]">Migrated event tracking from a Rails monolith into a Go/gRPC microservice</li>
        </ul>
      </div>

      <div className="mb-7">
        <div className="flex justify-between items-baseline gap-4 flex-wrap">
          <span className="font-semibold text-[0.95rem]">
            Full Stack Engineer —{' '}
            <a href="https://exxonmobil.com" target="_blank" rel="noopener" className="text-accent hover:underline">ExxonMobil</a>
          </span>
          <span className="text-[0.8rem] text-muted whitespace-nowrap">Mar 2019 – Jun 2021</span>
        </div>
        <p className="text-[0.85rem] text-muted mt-1 mb-2">Spring, TX</p>
        <ul className="entry-list list-none p-0 space-y-[0.15rem]">
          <li className="text-[0.875rem] text-[#aaa]">Co-led a 5-person team building 20+ apps to help geoscientists assess drilling viability</li>
          <li className="text-[0.875rem] text-[#aaa]">Wrote a Python optimizer for well placement in non-uniform polygons — turned a 14-day process into overnight, saving ~$70k/well</li>
        </ul>
      </div>

      <div className="mb-7">
        <div className="flex justify-between items-baseline gap-4 flex-wrap">
          <span className="font-semibold text-[0.95rem]">
            Software Engineer —{' '}
            <a href="https://northropgrumman.com" target="_blank" rel="noopener" className="text-accent hover:underline">Northrop Grumman</a>
          </span>
          <span className="text-[0.8rem] text-muted whitespace-nowrap">May 2017 – Feb 2019</span>
        </div>
        <p className="text-[0.85rem] text-muted mt-1 mb-2">Orlando, FL</p>
        <ul className="entry-list list-none p-0 space-y-[0.15rem]">
          <li className="text-[0.875rem] text-[#aaa]">Built RESTful APIs and a secure OS wrapper for a firewall application</li>
          <li className="text-[0.875rem] text-[#aaa]">Scripted 1000+ pages of MIL-SPECs into test files, automating hundreds of hours of manual work per quarter</li>
        </ul>
      </div>

      {/* GitHub Activity */}
      <h2 className="section-heading">Activity</h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/api/ghchart"
        alt="GitHub contribution chart"
        className="w-full h-auto opacity-85"
      />

      {/* Contact */}
      <h2 className="section-heading">Contact</h2>
      <p className="text-[0.85rem] text-muted">
        Best way to reach me is email —{' '}
        <a href="mailto:spencer.reyka@gmail.com" className="text-accent hover:underline">spencer.reyka@gmail.com</a>
      </p>

      <footer className="mt-20 text-[0.75rem] text-border">
        <p>Updated February 2026</p>
      </footer>
    </>
  )
}
