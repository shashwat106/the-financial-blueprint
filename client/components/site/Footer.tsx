export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container py-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href="/" className="text-xl font-extrabold">FinSight</a>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            Take control of your money with beautiful, smart AI tools.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:underline" href="#about">About</a></li>
            <li><a className="hover:underline" href="#contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:underline" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a className="hover:underline" href="/news">News</a></li>
            <li><a className="hover:underline" href="#privacy">Privacy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Stay updated</h4>
          <p className="text-sm text-muted-foreground">More features coming soon.</p>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-6 text-sm text-muted-foreground flex items-center justify-between">
          <p>© {new Date().getFullYear()} FinSight. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:underline">Privacy</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
