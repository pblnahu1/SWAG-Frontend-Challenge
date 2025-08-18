import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}
const supabase = createClient(supabaseUrl, supabaseKey)

interface FormData {
  name: string
  email: string
  github_url: string
  demo_url: string
}

export default function SubmitChallenge() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    github_url: '',
    demo_url: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')
  const [score, setScore] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      // Submit to Supabase
      const candidateData = {
        name: formData.name,
        email: formData.email,
        github_url: formData.github_url,
        demo_url: formData.demo_url || null
      }
      
      const { data, error } = await supabase
        .from('candidates')
        .insert([candidateData])
        .select()
        .single()
      
      if (error) {
        throw error
      }
      
      // Try to get automatic evaluation
      try {
        const { data: evalData } = await supabase.functions.invoke('evaluate-candidate', {
          body: {
            github_url: candidateData.github_url,
            candidate_email: candidateData.email,
            candidate_name: candidateData.name,
            demo_url: candidateData.demo_url
          }
        })
        
        if (evalData && evalData.score !== undefined) {
          setScore(evalData.score)
        }
      } catch (evalError) {
        console.log('Evaluation will be processed later:', evalError)
      }
      
      setShowSuccess(true)
      setFormData({ name: '', email: '', github_url: '', demo_url: '' })
      
    } catch (error: any) {
      setError(error.message || 'Error al enviar el challenge')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            ¡Challenge enviado exitosamente!
          </h2>
          <div className="text-green-700 space-y-2">
            <p>Tu solución está siendo evaluada automáticamente.</p>
            <p>Te contactaremos en las próximas 24-48 horas.</p>
            {score !== null && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <div className="font-medium">Evaluación automática completada:</div>
                <div className="text-lg font-bold">Score inicial: {score}/100</div>
                <div className="text-xs mt-1">Este score puede cambiar tras la revisión manual</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="mt-6 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Enviar otro candidato
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🎯 Enviar Challenge</h2>
        <p className="text-gray-600">Completa el formulario para enviar tu solución</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            👤 Nombre Completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: María González"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            📧 Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="tu.email@ejemplo.com"
          />
        </div>

        <div>
          <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 mb-1">
            🔗 URL de tu repositorio GitHub
          </label>
          <input
            type="url"
            id="github_url"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://github.com/tu-usuario/frontend-challenge"
          />
        </div>

        <div>
          <label htmlFor="demo_url" className="block text-sm font-medium text-gray-700 mb-1">
            🚀 URL del Demo (Opcional)
          </label>
          <input
            type="url"
            id="demo_url"
            name="demo_url"
            value={formData.demo_url}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://tu-challenge.vercel.app"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '⏳ Enviando...' : '🚀 Enviar Challenge'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">📋 Qué sucede después</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Tu código será evaluado automáticamente</li>
          <li>• Revisaremos bugs corregidos y funcionalidades</li>
          <li>• Te enviaremos los resultados por email</li>
          <li>• Los mejores candidatos pasarán a video call</li>
        </ul>
      </div>
    </div>
  )
}