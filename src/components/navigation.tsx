'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Coffee, User, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export function Navigation() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl hover:opacity-80 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:inline">CoffeeForFeedback</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-slate-700 hover:text-slate-900 font-medium transition">
              Browse Projects
            </Link>
            <Link href="/how-it-works" className="text-slate-700 hover:text-slate-900 font-medium transition">
              How It Works
            </Link>
            
            {status === 'authenticated' ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/projects/new">
                  <Button>Create Project</Button>
                </Link>
                <Button variant="ghost" onClick={() => signOut()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => signIn('google')}>
                  Sign In
                </Button>
                <Button onClick={() => signIn('google')}>Get Started</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-slate-200">
            <Link href="/browse" className="block text-slate-700 hover:text-slate-900 font-medium">
              Browse Projects
            </Link>
            <Link href="/how-it-works" className="block text-slate-700 hover:text-slate-900 font-medium">
              How It Works
            </Link>
            
            {status === 'authenticated' ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/projects/new">
                  <Button className="w-full">Create Project</Button>
                </Link>
                <Button variant="ghost" onClick={() => signOut()} className="w-full justify-start">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => signIn('google')} className="w-full">
                  Sign In
                </Button>
                <Button onClick={() => signIn('google')} className="w-full">
                  Get Started
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
