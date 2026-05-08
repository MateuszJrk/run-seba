import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { NavLink } from "@/components/nav-link";
import { MobileMenu } from "@/components/mobile-menu";

const NAV = [
  { href: "/", label: "Blog" },
  { href: "/tagi", label: "Tagi" },
  { href: "/kalkulator", label: "Tempo" },
  { href: "/o-mnie", label: "O mnie" },
  { href: "/kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-3">
          <ul className="relative hidden items-center gap-1 text-sm font-medium sm:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} />
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <MobileMenu items={NAV} />
        </nav>
      </div>
    </header>
  );
}
