'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  '🎨 Moda y Belleza',
  '💻 Tecnología',
  '🍳 Cocina y Recetas',
  '💪 Fitness y Salud',
  '🎮 Gaming',
  '🎵 Música',
  '✈️ Viajes',
  '🏠 Hogar y Decoración',
  '👶 Maternidad y Familia',
  '📚 Educación',
  '💼 Negocios',
  '🎭 Entretenimiento',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    displayName: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (step === 1 && !formData.displayName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!formData.category) {
      setError('Por favor selecciona una categoría');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: formData.displayName,
          category: formData.category,
          languagePreference: 'es',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save onboarding data');
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Hubo un error. Por favor intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Paso {step} de 2
            </span>
            <span className="text-sm font-medium text-purple-600">
              {step === 1 ? '50%' : '100%'}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Bienvenido a Academia! 🎉
              </h2>
              <p className="text-gray-600">
                Primero, cuéntanos un poco sobre ti
              </p>
            </div>

            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ¿Cómo te llamas?
              </label>
              <input
                type="text"
                id="displayName"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Tu nombre"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Category */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <button
                onClick={() => setStep(1)}
                className="text-purple-600 hover:text-purple-700 mb-4 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Atrás
              </button>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ¿Qué tipo de contenido creas?
              </h2>
              <p className="text-gray-600">
                Esto nos ayuda a encontrar creadores similares a ti
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setFormData({ ...formData, category })}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.category === category
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <span className="font-medium text-sm">{category}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : 'Completar Perfil'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
