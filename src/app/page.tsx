import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Users, Shield, Zap, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50 pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
        
        <div className="max-w-6xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            Get 5 qualified interviews in 48 hours
          </div>
          
          <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-tight">
            Stop chasing users.
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Start learning.
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            CoffeeForFeedback is a trusted marketplace connecting startup founders with verified professionals for paid user interviews. Quality feedback, guaranteed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/projects/new">
              <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                Create Interview Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl">
                Browse Opportunities
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Verified professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Escrow protection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>48hr turnaround</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">How It Works</h2>
            <p className="text-lg text-slate-600">Three simple steps to quality user interviews</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-8 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 transition-all card-hover">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Create & Fund</h3>
              <p className="text-slate-600 leading-relaxed">
                Define your interview needs and fund an escrow pool. Money is held securely until interviews are completed.
              </p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                <strong>Example:</strong> ₹5,000 for 5 interviews
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-purple-50 to-white hover:border-purple-300 transition-all card-hover">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Match & Schedule</h3>
              <p className="text-slate-600 leading-relaxed">
                Verified professionals apply. You select participants and schedule interviews at your convenience.
              </p>
              <div className="mt-4 p-3 bg-purple-50 rounded-lg text-sm text-purple-700">
                <strong>Avg match time:</strong> 24-48 hours
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-green-50 to-white hover:border-green-300 transition-all card-hover">
              <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Interview & Pay</h3>
              <p className="text-slate-600 leading-relaxed">
                Conduct interviews, gain insights, and mark complete. Payments are released automatically.
              </p>
              <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                <strong>Completion rate:</strong> 95%+
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Built on Trust</h2>
            <p className="text-lg text-slate-600">Industry-leading safety and quality controls</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Escrow Protection</h3>
              <p className="text-sm text-slate-600">100% secure payment holding</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Verified Profiles</h3>
              <p className="text-sm text-slate-600">LinkedIn + manual review</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Quality Ratings</h3>
              <p className="text-sm text-slate-600">Two-way review system</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <CheckCircle2 className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Dispute Resolution</h3>
              <p className="text-sm text-slate-600">Fair conflict handling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold mb-4">Transparent Pricing</h2>
          <p className="text-lg text-slate-600 mb-12">No hidden fees. Pay only for completed interviews.</p>
          
          <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-8 border-2 border-purple-200">
            <div className="text-5xl font-bold mb-2">₹1,000</div>
            <div className="text-slate-600 mb-6">per 30-minute interview</div>
            
            <div className="space-y-3 text-left max-w-md mx-auto mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Verified professional participants</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Escrow-protected payments</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Quality guarantee with ratings</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">10% platform fee (transparent)</span>
              </div>
            </div>

            <Link href="/projects/new">
              <Button size="lg" className="px-8">
                Start Your First Project
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to get quality feedback?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of founders validating ideas with real users
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/projects/new">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-xl">
                Create Interview Project
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/30">
                Explore as Professional
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
