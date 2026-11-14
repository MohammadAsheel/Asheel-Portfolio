import { useEffect, useState } from 'react';
import Lede from '@/components/common/Lede';
import PageHero from '@/components/common/PageHero';
import Layout from '@/components/layout/Layout';
import { COLOR_GROUPS } from '@/lib/colors';
import { SITE_NAME } from '@/lib/site';

const DESCRIPTION = 'The color palette behind this site, in light and dark.';

function readColorValues(): Record<string, string> {
  const rootStyles = getComputedStyle(document.documentElement);
  const values: Record<string, string> = {};
  for (const group of COLOR_GROUPS) {
    for (const token of group.tokens) {
      values[token] = rootStyles.getPropertyValue(`--${token}`).trim();
    }
  }
  return values;
}

export default function ColorsPage() {
  const [colorValues, setColorValues] = useState<Record<string, string>>(() => readColorValues());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setColorValues(readColorValues());
    });
    observer.observe(document.documentElement, { attributeFilter: ['data-palette'] });
    return () => observer.disconnect();
  }, []);

  return (
    <Layout title={`Colors — ${SITE_NAME}`} description={DESCRIPTION} canonicalPath="/colors/">
      <main className="content-shell">
        <PageHero title="Colors" hideTitle>
          <Lede>
            The color palette behind this site, in <span className="palette-mode-dark">dark</span>
            <span className="palette-mode-light">light</span> mode.
          </Lede>
        </PageHero>

        <section className="section grid gap-10" aria-label="Color palette">
          {COLOR_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="m-0 mb-4 font-heading text-[1.3rem] font-bold text-ink">{group.title}</h2>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {group.tokens.map((token) => (
                  <div key={token} className="border-2 border-ink bg-bg-elevated shadow-[4px_4px_0_0_var(--ink)]">
                    <div className="h-20 border-b-2 border-ink" style={{ backgroundColor: `var(--${token})` }} />
                    <div className="p-3">
                      <p className="m-0 font-mono text-[0.8rem] font-bold text-ink">--{token}</p>
                      <p className="m-0 mt-1 font-mono text-[0.75rem] text-muted" data-color-value={token}>
                        {colorValues[token] || '\u00a0'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="section" aria-label="Acknowledgements">
          <p className="m-0 text-muted">
            The hard borders, offset shadows, and bold colors follow the Neubrutalism style:{' '}
            <a className="font-semibold text-accent" href="https://neubrutalism.com/" target="_blank" rel="noopener">
              neubrutalism.com
            </a>
          </p>
        </section>
      </main>
    </Layout>
  );
}
