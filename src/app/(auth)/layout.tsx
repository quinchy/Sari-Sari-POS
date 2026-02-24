export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="lg:grid lg:grid-cols-2">
        <div className="hidden bg-muted lg:flex flex-col items-center justify-center w-full h-dvh text-center gap-4">
          <h1 className="font-jaro text-primary text-8xl select-none">
            SariSariPOS
          </h1>
          <section className="space-y-2">
            <h2 className="font-jaro text-secondary text-5xl selection-secondary">
              Instant Sales. Zero Hassle.
            </h2>
            <p className="text-muted-foreground max-w-md text-lg text-balance">
              Easy setup, simple workflows, and all the tools a sari-sari store
              needs to sell, track, and grow — built for everyday retail in the
              Philippines.
            </p>
          </section>
        </div>
        <div className="bg-slant min-h-dvh max-h-dvh overflow-auto flex px-3 lg:px-0">
          <div className="m-auto">{children}</div>
        </div>
      </main>
    </>
  );
}
