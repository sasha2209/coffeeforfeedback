'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { formatCurrency, rupeesToPaise } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export function CreateProjectForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetPersona: '',
    interviewDuration: 30,
    totalPoolAmount: 5000,
    numParticipants: 5,
  })

  const perParticipantPay = Math.floor(formData.totalPoolAmount / formData.numParticipants)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalPoolAmount: rupeesToPaise(formData.totalPoolAmount),
          perParticipantPay: rupeesToPaise(perParticipantPay),
        }),
      })

      if (!response.ok) throw new Error('Failed to create project')

      const project = await response.json()
      router.push(`/projects/${project.id}`)
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Project Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., User interviews for B2B SaaS product"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what you're building and what feedback you need..."
          rows={4}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        />
        <p className="text-sm text-slate-500 mt-1">
          Be specific about your product, stage, and what you want to learn
        </p>
      </div>

      {/* Target Persona */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Target Persona <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.targetPersona}
          onChange={(e) => setFormData({ ...formData, targetPersona: e.target.value })}
          placeholder="e.g., Product Managers at B2B SaaS companies"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        />
      </div>

      {/* Interview Duration */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Interview Duration (minutes)
        </label>
        <select
          value={formData.interviewDuration}
          onChange={(e) => setFormData({ ...formData, interviewDuration: parseInt(e.target.value) })}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        >
          <option value={30}>30 minutes</option>
          <option value={45}>45 minutes</option>
          <option value={60}>60 minutes</option>
        </select>
      </div>

      {/* Compensation Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Total Pool Amount (₹)
          </label>
          <input
            type="number"
            required
            min={1000}
            step={100}
            value={formData.totalPoolAmount}
            onChange={(e) => setFormData({ ...formData, totalPoolAmount: parseInt(e.target.value) })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Number of Participants
          </label>
          <input
            type="number"
            required
            min={1}
            max={20}
            value={formData.numParticipants}
            onChange={(e) => setFormData({ ...formData, numParticipants: parseInt(e.target.value) })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Payment Preview */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <h3 className="font-semibold mb-4">Payment Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Per participant:</span>
            <span className="font-bold text-lg text-green-600">
              {formatCurrency(rupeesToPaise(perParticipantPay))}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Platform fee (10%):</span>
            <span>{formatCurrency(rupeesToPaise(formData.totalPoolAmount * 0.1))}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Payment processing (~3%):</span>
            <span>{formatCurrency(rupeesToPaise(formData.totalPoolAmount * 0.03))}</span>
          </div>
          <div className="pt-2 border-t border-purple-200 flex justify-between font-bold">
            <span>Total to fund:</span>
            <span>{formatCurrency(rupeesToPaise(formData.totalPoolAmount))}</span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="flex-1"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading ? 'Creating...' : 'Create Project & Fund'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>

      <p className="text-xs text-slate-500 text-center">
        By creating a project, you agree to fund the escrow amount. Payments are released only after interview completion.
      </p>
    </form>
  )
}
