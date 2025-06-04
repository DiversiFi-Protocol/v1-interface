export function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="text-xl font-semibold mb-4">Fully Decentralized</h3>
          <p className="text-muted-foreground">
            Fully decentralized protocol with no central point of failure
          </p>
        </div>
        <div className="p-6 rounded-lg border bg-popover">
          <h3 className="text-xl font-semibold mb-4">Mitigate Risks</h3>
          <p className="text-muted-foreground">
            Protect yourself by diversifying your risk exposure to underlying assets
          </p>
        </div>
        <div className="p-6 rounded-lg border bg-background">
          <h3 className="text-xl font-semibold mb-4">Efficient</h3>
          <p className="text-muted-foreground">
            Optimized for low gas fees and maximum capital efficiency
          </p>
        </div>
      </div>
    </section>
  );
}
