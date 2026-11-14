import { type FormEvent, useState } from 'react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Icon from '@/components/common/Icon';
import Lede from '@/components/common/Lede';
import PageHero from '@/components/common/PageHero';
import CopyEmailButton from '@/components/contact/CopyEmailButton';
import Layout from '@/components/layout/Layout';
import { getIcon } from '@/lib/icons';
import { withBase } from '@/lib/paths';
import { PORTFOLIO_PROFILE } from '@/lib/portfolio';
import { CONTACT_DESCRIPTION, SITE_URL } from '@/lib/site';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [topic, setTopic] = useState(PORTFOLIO_PROFILE.contactTopics[0]);
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = senderEmail.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatusMessage('Please fill in your name, email address, and message first.');
      return;
    }

    const subject = encodeURIComponent(`[${topic}] Message from ${trimmedName}`);
    const body = encodeURIComponent(
      `Hi ${PORTFOLIO_PROFILE.name},\n\n${trimmedMessage}\n\n— ${trimmedName} (${trimmedEmail})`,
    );
    window.location.href = `mailto:${PORTFOLIO_PROFILE.email}?subject=${subject}&body=${body}`;
    setStatusMessage(`Draft prepared for ${PORTFOLIO_PROFILE.email} in your email client.`);
  };

  const baseSite = (import.meta.env.VITE_SITE_URL || SITE_URL).replace(/\/+$/, '');
  const breadcrumbSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: new URL(withBase('/'), baseSite).toString(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact',
        item: new URL(withBase('/contact/'), baseSite).toString(),
      },
    ],
  }).replace(/</g, '\\u003c');

  return (
    <Layout
      title={`Contact — ${PORTFOLIO_PROFILE.name} | Cyber Security & Development`}
      description="Get in touch with Asheel Mohammad for cybersecurity projects, ethical hacking discussions, internships, or web development collaborations."
      canonicalPath="/contact/"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      <main className="content-shell">
        <PageHero title="Contact" eyebrow={PORTFOLIO_PROFILE.availability}>
          <Lede>{CONTACT_DESCRIPTION}</Lede>
        </PageHero>

        <section
          className="section grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]"
          aria-label="Contact details"
        >
          <div className="flex flex-col gap-6">
            <Card>
              <h2 className="m-0 font-heading text-[1.4rem] font-bold text-ink">Direct Channels</h2>
              <p className="mt-3 leading-[1.6] text-ink-soft">
                Best way to reach me is by email or LinkedIn. I typically respond within one business day.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={`mailto:${PORTFOLIO_PROFILE.email}`}>
                  <Icon icon={getIcon('mail')} />
                  Email me
                </Button>
                <CopyEmailButton email={PORTFOLIO_PROFILE.email} />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={PORTFOLIO_PROFILE.githubUrl} variant="secondary" target="_blank" rel="noopener">
                  <Icon icon={getIcon('brand-github')} />
                  GitHub
                </Button>
                <Button href={PORTFOLIO_PROFILE.linkedinUrl} variant="secondary" target="_blank" rel="noopener">
                  <Icon icon={getIcon('brand-linkedin')} />
                  LinkedIn
                </Button>
              </div>
            </Card>

            <Card>
              <h2 className="m-0 font-heading text-[1.3rem] font-bold text-ink">Availability &amp; Focus</h2>
              <dl className="mt-4 space-y-3 text-[0.95rem]">
                <div className="flex items-start gap-2.5">
                  <Icon icon={getIcon('map-pin')} className="mt-1 shrink-0 text-accent" />
                  <div>
                    <dt className="font-mono text-[0.75rem] font-bold text-muted uppercase">Location</dt>
                    <dd className="m-0 font-heading font-semibold text-ink">{PORTFOLIO_PROFILE.location}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Icon icon={getIcon('briefcase')} className="mt-1 shrink-0 text-accent" />
                  <div>
                    <dt className="font-mono text-[0.75rem] font-bold text-muted uppercase">
                      Collaboration &amp; Focus
                    </dt>
                    <dd className="m-0 font-heading font-semibold text-ink">
                      {PORTFOLIO_PROFILE.preferredRoles.join(' · ')}
                    </dd>
                  </div>
                </div>
              </dl>
            </Card>
          </div>

          <Card>
            <h2 className="m-0 font-heading text-[1.4rem] font-bold text-ink">Send a Quick Note</h2>
            <p className="mt-2 text-[0.95rem] text-ink-soft">
              Compose an inquiry below to open a pre-filled message straight in your email client.
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <span className="mb-2 block font-mono text-[0.75rem] font-bold text-muted uppercase">Topic</span>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Inquiry topic">
                  {PORTFOLIO_PROFILE.contactTopics.map((option) => {
                    const selected = topic === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setTopic(option)}
                        className={[
                          'cursor-pointer border-2 border-ink px-3 py-1 font-heading text-[0.85rem] font-bold transition-colors',
                          selected ? 'bg-accent text-bg' : 'bg-bg text-ink hover:bg-accent hover:text-bg',
                        ].join(' ')}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[0.75rem] font-bold text-ink uppercase">Your Name</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full border-2 border-ink bg-bg px-3.5 py-2.5 font-body text-[0.95rem] text-ink placeholder:text-muted focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block font-mono text-[0.75rem] font-bold text-ink uppercase">Your Email</span>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(event) => setSenderEmail(event.target.value)}
                    placeholder="alex@company.com"
                    className="w-full border-2 border-ink bg-bg px-3.5 py-2.5 font-body text-[0.95rem] text-ink placeholder:text-muted focus:outline-none"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block font-mono text-[0.75rem] font-bold text-ink uppercase">Message</span>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tell me a little about the role, project, or timeline..."
                  className="w-full resize-y border-2 border-ink bg-bg px-3.5 py-2.5 font-body text-[0.95rem] text-ink placeholder:text-muted focus:outline-none"
                />
              </label>

              {statusMessage && (
                <p
                  role="status"
                  className="m-0 border-2 border-ink bg-bg px-4 py-3 font-heading text-[0.9rem] font-semibold text-ink"
                >
                  {statusMessage}
                </p>
              )}

              <button
                type="submit"
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-none border-2 border-ink bg-accent px-6 py-3 font-heading text-base font-bold text-bg shadow-[4px_4px_0_0_var(--ink)] transition-[translate,box-shadow] duration-120 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--ink)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                <Icon icon={getIcon('send')} />
                Compose Email
              </button>
            </form>
          </Card>
        </section>
      </main>
    </Layout>
  );
}
