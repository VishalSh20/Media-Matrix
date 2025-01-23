"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";

export default function Header() {
  const { user, isSignedIn } = useAuth();
  const allTabs = ["Home", "Tools", "API", "Contact"];
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-b border-blue-500/20"
          : "bg-transparent"
      )}
    >
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between p-4 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-blue-600 rounded-xl rotate-45 group-hover:rotate-90 transition-all duration-300">
                <Sparkles
                  className="absolute -rotate-45 group-hover:rotate-45 transition-all duration-300 text-white/90"
                  size={24}
                  style={{ top: "8px", left: "8px" }}
                />
              </div>
              <div className="absolute inset-0 w-10 h-10 bg-blue-500/50 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Media Matrix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-6">
              {allTabs.map((tab, index) => (
                <Link
                  key={index}
                  href={`/${tab.toLowerCase()}`}
                  className="relative text-gray-400 hover:text-white transition-colors group"
                >
                  {tab}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {isSignedIn ? (
              <div className="flex gap-4 items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg relative group overflow-hidden"
                  onClick={() => router.push("/workspace")}
                >
                  <span className="relative z-10">Workspace</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
                </motion.button>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-75" />
                  <UserButton />
                </div>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <Link href="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-blue-500/50 rounded-lg hover:border-blue-400 hover:text-blue-400 transition-colors"
                  >
                    Sign up
                  </motion.button>
                </Link>
                <Link href="/sign-in">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg relative group overflow-hidden"
                  >
                    <span className="relative z-10">Sign in</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-500/20 bg-black/95 backdrop-blur-lg">
            <div className="flex flex-col gap-4 p-4">
              {allTabs.map((tab, index) => (
                <Link
                  key={index}
                  href={`/${tab.toLowerCase()}`}
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {tab}
                </Link>
              ))}
              {isSignedIn ? (
                <div className="flex flex-col gap-4 pt-4 border-t border-blue-500/20">
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    onClick={() => {
                      router.push("/workspace");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Workspace
                  </button>
                  <UserButton />
                </div>
              ) : (
                <div className="flex flex-col gap-4 pt-4 border-t border-blue-500/20">
                  <Link
                    href="/sign-up"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full px-4 py-2 border border-blue-500/50 rounded-lg hover:border-blue-400 hover:text-blue-400">
                      Sign up
                    </button>
                  </Link>
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      Sign in
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}