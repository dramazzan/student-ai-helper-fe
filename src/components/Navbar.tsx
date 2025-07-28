"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Upload, BookOpen, LogOut, Menu, X, Brain, Sparkles, type LucideIcon } from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

interface NavbarProps {
  className?: string
}

const Navbar = ({ className = "" }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Memoized scroll handler for better performance
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 10
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled)
    }
  }, [isScrolled])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navItems: NavItem[] = [
    {
      href: "/main/generate",
      label: "Главная",
      icon: Home,
    },
    {
      href: "/main/dashboard",
      label: "Профиль",
      icon: User,
    },
    {
      href: "/main/upload",
      label: "Загрузить",
      icon: Upload,
    },
    {
      href: "/main/tests",
      label: "Тесты",
      icon: BookOpen,
    },
  ]

  const isActiveLink = useCallback(
    (href: string): boolean => {
      return pathname === href || pathname.startsWith(href + "/")
    },
    [pathname],
  )

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200" : "bg-white shadow-md"
        } ${className}`}
        role="navigation"
        aria-label="Основная навигация"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg"
              aria-label="Student AI Helper - Главная страница"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#C8102E] to-[#B00020] rounded-xl flex items-center justify-center group-hover:scale-110 group-focus:scale-110 transition-transform duration-200">
                  <Brain className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" aria-hidden="true" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                  Student AI Helper
                </h1>
                <p className="text-xs text-gray-600 -mt-1">Умный помощник студента</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = isActiveLink(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                      isActive
                        ? "bg-red-50 text-[#C8102E] shadow-sm border border-red-100"
                        : "text-gray-600 hover:text-black hover:bg-gray-50"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 transition-all duration-200 ${
                        isActive ? "text-[#C8102E]" : "text-gray-600 group-hover:text-black group-hover:scale-110"
                      }`}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <div
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#C8102E] rounded-full"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                )
              })}

              {/* Logout Button */}
              <div className="ml-4 pl-4 border-l border-gray-200">
                <Link
                  href="/auth/login"
                  className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <LogOut
                    className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
                    aria-hidden="true"
                  />
                  <span>Выйти</span>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100 border-t border-gray-200" : "max-h-0 opacity-0 overflow-hidden"
          }`}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="bg-white/95 backdrop-blur-md px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = isActiveLink(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                    isActive
                      ? "bg-red-50 text-[#C8102E] shadow-sm border border-red-100"
                      : "text-gray-600 hover:text-black hover:bg-gray-50"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-[#C8102E]" : "text-gray-600"}`} aria-hidden="true" />
                  <span>{item.label}</span>
                  {isActive && <div className="ml-auto w-2 h-2 bg-[#C8102E] rounded-full" aria-hidden="true" />}
                </Link>
              )
            })}

            {/* Mobile Logout */}
            <div className="pt-2 mt-2 border-t border-gray-200">
              <Link
                href="/auth/login"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <LogOut className="w-5 h-5" aria-hidden="true" />
                <span>Выйти</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default Navbar
