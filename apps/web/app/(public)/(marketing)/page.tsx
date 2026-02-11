import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'afena-ui/components/accordion';
import { AnimateOnScroll } from 'afena-ui/components/animate-on-scroll';
import { Avatar, AvatarFallback } from 'afena-ui/components/avatar';
import { Badge } from 'afena-ui/components/badge';
import { Button } from 'afena-ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from 'afena-ui/components/card';
import { Progress } from 'afena-ui/components/progress';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  Globe,
  Lock,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

import { ThemeToggle } from './theme-toggle';

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col text-foreground">
      {/* ── Nav ── */}
      <header className="glass sticky top-0 z-50 border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <span className="text-lg font-bold tracking-tight text-primary">
            Afena
          </span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/sign-up">
                Get started
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-6 pb-16 pt-24 text-center md:pt-32">
        <AnimateOnScroll animation="animate-fade-in">
          <Badge variant="secondary" className="gap-1.5">
            <Sparkles className="size-3" />
            Now in Early Access
          </Badge>
        </AnimateOnScroll>
        <AnimateOnScroll animation="animate-slide-up">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            The modern ERP for
            <span className="text-primary"> growing businesses</span>
          </h1>
        </AnimateOnScroll>
        <AnimateOnScroll animation="animate-fade-in" delay="delay-150">
          <p className="max-w-2xl text-lg text-muted-foreground">
            Afena unifies finance, inventory, HR, and operations into one
            collaborative platform — built for teams that move fast.
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll animation="animate-slide-up" delay="delay-200">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Start for free
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">See features</Link>
            </Button>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ── Trust Bar ── */}
      <AnimateOnScroll animation="animate-fade-in" className="mx-auto w-full max-w-4xl px-6 pb-20">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {trustLogos.map((name) => (
            <span
              key={name}
              className="text-sm font-semibold text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </AnimateOnScroll>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── Product Preview ── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <AnimateOnScroll animation="animate-slide-up">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Your operations, at a glance
            </h2>
            <p className="mt-3 text-muted-foreground">
              Real-time metrics, team activity, and system health — all in one dashboard.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="animate-scale-in">
          <div className="grid gap-5 md:grid-cols-3">
            {/* Metric Card: Revenue */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                  <TrendingUp className="size-4 text-success" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tabular-nums">$48,352</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-success">
                  <ArrowUpRight className="size-3" />
                  +12.5% from last month
                </div>
                <div className="mt-3 flex gap-1">
                  {[65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88, 92].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-primary/20"
                      style={{ height: `${h * 0.4}px` }}
                    >
                      <div
                        className="w-full rounded-sm bg-primary"
                        style={{ height: `${h * 0.4}px`, opacity: 0.4 + (h / 100) * 0.6 }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Metric Card: Active Users */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                  <Users className="size-4 text-info" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tabular-nums">2,847</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-info">
                  <Activity className="size-3" />
                  342 online now
                </div>
                <div className="mt-3 flex -space-x-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="size-7 rounded-full border-2 border-background"
                      style={{ background: `var(--palette-${(i % 10) + 1})` }}
                    />
                  ))}
                  <div className="flex size-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-bold text-muted-foreground">
                    +99
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metric Card: System Health */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
                  <Shield className="size-4 text-success" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tabular-nums">99.97%</div>
                <div className="mt-1 text-xs text-muted-foreground">Uptime last 30 days</div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="status-success inline-flex size-5 items-center justify-center rounded-full text-[10px]"><CheckCircle2 className="size-3" /></span>
                      API
                    </span>
                    <span className="font-mono text-success">120ms</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="status-warning inline-flex size-5 items-center justify-center rounded-full text-[10px]"><Clock className="size-3" /></span>
                      Auth
                    </span>
                    <span className="font-mono text-warning">410ms</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="status-success inline-flex size-5 items-center justify-center rounded-full text-[10px]"><CheckCircle2 className="size-3" /></span>
                      Database
                    </span>
                    <span className="font-mono text-success">45ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimateOnScroll>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── Features (2 hero + 4 compact) ── */}
      <section
        id="features"
        className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28"
      >
        <AnimateOnScroll animation="animate-slide-up">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-3 text-muted-foreground">
              Modular by design — activate only the modules your business needs.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Hero features: 2 large cards */}
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          {heroFeatures.map((f) => (
            <AnimateOnScroll key={f.title} animation="animate-slide-up">
              <Card className="h-full">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                  <div className="mt-auto pt-2">
                    <Progress value={f.progress} className="h-1.5" />
                    <p className="mt-1.5 text-xs text-muted-foreground">{f.progressLabel}</p>
                  </div>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Compact features: 4 smaller cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {compactFeatures.map((f, i) => (
            <AnimateOnScroll key={f.title} animation="animate-slide-up" delay={`delay-${(i + 1) * 75}`}>
              <Card className="h-full">
                <CardContent className="flex flex-col gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── Stats ── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <AnimateOnScroll key={s.label} animation="animate-slide-up" delay={`delay-${i * 75}`}>
              <Card className="text-center">
                <CardContent className="flex flex-col items-center gap-2 pt-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {s.icon}
                  </div>
                  <div className="text-3xl font-bold tracking-tight text-primary tabular-nums">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── Testimonials ── */}
      <section className="mx-auto w-full max-w-4xl px-6 py-20 md:py-28">
        <AnimateOnScroll animation="animate-slide-up">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Loved by teams who ship
            </h2>
            <p className="mt-3 text-muted-foreground">
              Hear from teams already running their operations on Afena.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <AnimateOnScroll key={t.name} animation="animate-slide-up" delay={`delay-${i * 100}`}>
              <Card className="h-full">
                <CardContent className="flex flex-col gap-4 p-6">
                  <p className="text-sm leading-relaxed text-muted-foreground italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-auto flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs font-bold" style={{ background: `var(--palette-${i + 3})`, color: 'var(--primary-foreground)' }}>
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── FAQ ── */}
      <section className="mx-auto w-full max-w-3xl px-6 py-20 md:py-28">
        <AnimateOnScroll animation="animate-slide-up">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Frequently asked questions
            </h2>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="animate-fade-in">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimateOnScroll>
      </section>

      <div className="section-divider mx-auto max-w-5xl" />

      {/* ── Final CTA ── */}
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center md:py-28">
        <AnimateOnScroll animation="animate-slide-up">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to streamline your operations?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join teams already running on Afena. Free during Early Access.
          </p>
          <div className="mt-6">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Get started now
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ── Footer (4 columns) ── */}
      <footer className="border-t bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="mb-3 text-sm font-semibold">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} Afena</span>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Data ── */

const trustLogos = [
  'Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Stark Industries', 'Wayne Enterprises', 'Cyberdyne', 'Soylent',
];

const heroFeatures = [
  {
    icon: <BarChart3 className="size-6" />,
    title: 'Financial Management',
    description:
      'General ledger, accounts payable & receivable, budgeting, multi-currency support, and real-time reporting with drill-down analytics.',
    progress: 92,
    progressLabel: '92% of Fortune 500 requirements covered',
  },
  {
    icon: <Building2 className="size-6" />,
    title: 'Inventory & Supply Chain',
    description:
      'Track stock levels across warehouses, automate reordering with smart thresholds, and manage suppliers with full audit trails.',
    progress: 87,
    progressLabel: '87% reduction in stockouts reported',
  },
];

const compactFeatures = [
  {
    icon: <Users className="size-5" />,
    title: 'HR & Payroll',
    description: 'Employee records, leave management, payroll processing, and org charts.',
  },
  {
    icon: <Zap className="size-5" />,
    title: 'Workflow Automation',
    description: 'Approval chains, notifications, and custom automations — no code required.',
  },
  {
    icon: <Lock className="size-5" />,
    title: 'Multi-Tenant Security',
    description: 'Row-level security, org-based isolation, and role-based access out of the box.',
  },
  {
    icon: <Sparkles className="size-5" />,
    title: 'AI-Powered Insights',
    description: 'Anomaly detection, forecasting, and natural-language queries across your data.',
  },
];

const stats = [
  { icon: <Globe className="size-5" />, value: '10K+', label: 'Active organizations' },
  { icon: <Shield className="size-5" />, value: '99.97%', label: 'Uptime SLA' },
  { icon: <Zap className="size-5" />, value: '<120ms', label: 'API response time' },
  { icon: <Users className="size-5" />, value: '50K+', label: 'Users worldwide' },
];

const testimonials = [
  {
    quote: 'Afena replaced three separate tools for us. The unified dashboard alone saved our ops team 10 hours a week.',
    name: 'Sarah Chen',
    role: 'COO, TechFlow',
    initials: 'SC',
  },
  {
    quote: 'The multi-tenant security model is exactly what we needed. RLS out of the box — no custom middleware.',
    name: 'Marcus Rivera',
    role: 'CTO, DataScale',
    initials: 'MR',
  },
  {
    quote: 'We went from spreadsheet chaos to real-time inventory tracking in under a week. The onboarding was seamless.',
    name: 'Aisha Patel',
    role: 'Head of Operations, GreenLeaf',
    initials: 'AP',
  },
];

const faqs = [
  {
    q: 'Is Afena really free during Early Access?',
    a: 'Yes. All core modules are free during Early Access. We\'ll introduce paid plans for advanced features (AI insights, premium support) after GA, but early adopters get a permanent discount.',
  },
  {
    q: 'How does multi-tenant security work?',
    a: 'Every data row is scoped to your organization via row-level security (RLS) enforced at the database level. Even if application code has a bug, data cannot leak between tenants.',
  },
  {
    q: 'Can I migrate from my existing ERP?',
    a: 'We provide CSV/API import tools and a dedicated migration guide. For enterprise migrations, our team offers hands-on support to map your existing data model.',
  },
  {
    q: 'What tech stack does Afena use?',
    a: 'Next.js 16, Neon Postgres (serverless), Drizzle ORM, and a custom design system built on shadcn/ui. Everything is TypeScript end-to-end.',
  },
];

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Status', href: '#' },
      { label: 'Design System', href: '/design-system' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'DPA', href: '#' },
    ],
  },
];
