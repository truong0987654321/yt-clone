import Image from "next/image";
import Link from "next/link";

const links = [
  {
    href: "https://github.com/truong0987654321",
    label: "GitHub",
  },
  {
    href: "https://www.youtube.com/@TruongTran-xe2uy",
    label: "Youtube",
  },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-md bg-black px-4 py-2 text-white cursor-pointer hover:bg-black/85"
    >
      {label}
    </Link>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* Logo / giới thiệu */}
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="flex items-center justify-center">
            <Image src={"logo.svg"} alt="logo" width={45} height={45}></Image>
          </p>

          <p className="mt-3 text-muted-foreground">
            A YouTube clone application.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            This is a non-commercial project created for learning purposes.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex w-full items-center justify-center p-8">
        <div className="text-center">
          <p className="text-xl text-primary">
            <span>TRỌNG TRƯỜNG | 2026</span>
          </p>

          <div className="mt-2 flex justify-center gap-2">
            {links.map((link) => (
              <FooterLink key={link.href} {...link} />
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
