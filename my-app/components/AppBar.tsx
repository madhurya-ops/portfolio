"use client";
import { Dock, DockIcon } from "@/components/ui/dock";
import ThemeToggle from "@/components/ui/toggleTheme";
import {
  BriefcaseBusinessIcon,
  GithubIcon,
  HomeIcon,
  ApertureIcon,
  LinkedinIcon,
  MailIcon,
  MessageCircleIcon,
  BookText,
  SquareUserRound,
  Sun,
  Moon
} from "lucide-react";
import { usePathname } from "next/navigation";

interface DockItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const dockItems = [
  {
    name: "Home",
    href: "/",
    icon: <HomeIcon className="text-white"/>,
  },
  {
    name: "Experience",
    href: "/experience",
    icon: <BriefcaseBusinessIcon className="text-white"/>,
  },
  {
    name: "Blog",
    href: "/blog",
    icon: <BookText className="text-white"/>,
  },
  {
    name: "Art",
    href: "/art",
    icon: <ApertureIcon className="text-white"/>
  },
  {
    name: "Github",
    href: "https://github.com/madhurya-ops",
    icon: <GithubIcon className="text-white"/>,
  },
  {
    name: "Linkedin",
    href: "https://www.linkedin.com/in/madhurya-mishra/",
    icon: <LinkedinIcon className="text-white"/>,
  },
  {
    name: "Resume",
    href: "https://drive.google.com/file/d/10PxxSBUCXdJxS07pkpzor3U2x-52hGta/view?usp=drive_link",
    icon: <SquareUserRound className="text-white"/>,
  },
  {
    name: "Email",
    href: "mailto:madhuryamishra@gmail.com",
    icon: <MailIcon className="text-white"/>,
  },
];

export function HomeDock() {
  const pathname = usePathname();
  if (pathname === "/chat") return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-[101] -translate-x-1/2 md:bottom-10 md:w-auto">
      <Dock
        magnification={60}
        distance={140}
        className="scale-90 border-black/20 bg-neutral-900 md:scale-100"
      >
        {dockItems.map((item: DockItem) => (
          <DockIcon
            key={item.name}
            href={item.href}
            tooltip={item.name}
            className="cursor-pointer"
          >
            {item.icon}
          </DockIcon>
        ))}
        {/* Remove DockIcon wrapper and just render ThemeToggle directly */}
        <div className="flex items-center justify-center p-2">
          <ThemeToggle />
        </div>
      </Dock>
    </div>
  );
}
