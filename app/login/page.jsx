"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/app/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [particles, setParticles] = useState([])
  const [leftParticles, setLeftParticles] = useState([])

  // Generate particles only on client side
  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 5 + Math.random() * 10,
        delay: Math.random() * 5
      }))
    )
    
    setLeftParticles(
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: 20 + Math.random() * 60,
        top: 20 + Math.random() * 60,
        duration: 5 + Math.random() * 5,
        delay: Math.random() * 3
      }))
    )
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (formData.username === 'admin123' && formData.password === 'admin123') {
      // Set cookie for middleware
      document.cookie = 'isAuthenticated=true; path=/; max-age=86400'
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userEmail', 'demo-guest@planfact.io')
      router.push('/')
    } else {
      setError('Неверный логин или пароль')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-12 bg-white">
        {/* Form container */}
        <div className="w-full max-w-md">
          <div 
            className="bg-white rounded-3xl p-10 border border-slate-200"
            style={{
              animation: 'fadeSlideUp 0.8s ease-out',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.04)'
            }}
          >
            {/* Logo/Title */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-slate-900 mb-3"
                style={{
                  background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                ПланФакт
              </h1>
              <p className="text-slate-600 text-lg">Войдите в свой аккаунт</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Логин
                </label>
                <div className="relative group">
                  {/* Icon */}
                  <div className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300",
                    focusedField === 'username' ? "text-[#17a2b8] scale-110" : "text-slate-400"
                  )}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({ ...formData, username: e.target.value })
                      setError('')
                    }}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      "w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all text-slate-900 bg-white",
                      focusedField === 'username' 
                        ? "border-[#17a2b8]" 
                        : "border-slate-200 hover:border-slate-300"
                    )}
                    placeholder="Введите логин"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Пароль
                </label>
                <div className="relative group">
                  {/* Icon */}
                  <div className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300",
                    focusedField === 'password' ? "text-[#17a2b8] scale-110" : "text-slate-400"
                  )}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      setError('')
                    }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      "w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all text-slate-900 bg-white",
                      focusedField === 'password' 
                        ? "border-[#17a2b8]" 
                        : "border-slate-200 hover:border-slate-300"
                    )}
                    placeholder="Введите пароль"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="relative">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#17a2b8] to-[#138496] text-white py-3.5 rounded-xl font-medium hover:shadow-xl hover:shadow-[#17a2b8]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Вход...
                    </span>
                  ) : (
                    <span className="relative z-10">Войти</span>
                  )}
                </button>
                
                {/* Pulsing glow */}
                {!isSubmitting && (
                  <div className="absolute inset-0 rounded-xl bg-[#17a2b8]/20 -z-10 blur-xl"
                    style={{
                      animation: 'pulse 3s ease-in-out infinite'
                    }}
                  />
                )}
              </div>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-600 text-center">
                <span className="font-medium">Демо доступ:</span> admin123 / admin123
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Animated Background */}
      <div className="w-1/2 relative overflow-hidden bg-gradient-to-br from-[#17a2b8] via-[#138496] to-[#0e6b7a]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Large animated gradient orbs */}
          <div 
            className={cn(
              "absolute w-[500px] h-[500px] rounded-full blur-3xl transition-all duration-1000 ease-out",
              focusedField === 'username' ? "scale-125 opacity-30" : "scale-100 opacity-15"
            )}
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
              top: '20%',
              left: '20%',
              animation: 'float 10s ease-in-out infinite'
            }}
          />
          
          <div 
            className={cn(
              "absolute w-[400px] h-[400px] rounded-full blur-3xl transition-all duration-1000 ease-out",
              focusedField === 'password' ? "scale-125 opacity-30" : "scale-100 opacity-15"
            )}
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
              bottom: '20%',
              right: '20%',
              animation: 'float 12s ease-in-out infinite reverse'
            }}
          />

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '100px 100px'
              }}
            />
          </div>

          {/* Floating geometric shapes */}
          {[
            { left: 15, top: 10 },
            { left: 35, top: 20 },
            { left: 60, top: 15 },
            { left: 80, top: 25 },
            { left: 10, top: 40 },
            { left: 45, top: 50 },
            { left: 70, top: 45 },
            { left: 85, top: 55 },
            { left: 20, top: 70 },
            { left: 50, top: 80 },
            { left: 75, top: 75 },
            { left: 30, top: 85 }
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                animation: `float ${10 + i * 1.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              <div
                className="border-2 border-white/20 backdrop-blur-sm"
                style={{
                  width: i % 3 === 0 ? '48px' : i % 3 === 1 ? '40px' : '32px',
                  height: i % 3 === 0 ? '48px' : i % 3 === 1 ? '40px' : '32px',
                  borderRadius: i % 2 === 0 ? '50%' : '25%',
                  animation: `rotate ${15 + i * 2}s linear infinite`,
                  background: 'rgba(255,255,255,0.05)'
                }}
              />
            </div>
          ))}
        </div>

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-8">
          <div className="max-w-2xl w-full text-center">
            {/* Animated logo/icon */}
            <div className="mb-6 relative">
              <div 
                className="w-20 h-20 mx-auto relative"
                style={{
                  animation: 'float 6s ease-in-out infinite'
                }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30" 
                  style={{
                    animation: 'rotate 20s linear infinite'
                  }}
                />
                <div className="absolute inset-2 bg-white/10 rounded-xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-4 leading-tight"
              style={{
                animation: 'fadeSlideUp 0.8s ease-out',
                textShadow: '0 2px 20px rgba(0,0,0,0.2)'
              }}
            >
              Добро пожаловать в ПланФакт!
            </h2>
            
            {/* Animated rotating text */}
            <div className="h-40 mb-8 flex items-center justify-center overflow-hidden">
              <div className="relative w-full">
                {[
                  { 
                    text: 'Контролируйте денежные потоки в реальном времени',
                    icon: (
                      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )
                  },
                  { 
                    text: 'Планируйте бюджет на месяцы вперед',
                    icon: (
                      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                    )
                  },
                  { 
                    text: 'Получайте детальную аналитику и отчеты',
                    icon: (
                      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                    )
                  },
                  { 
                    text: 'Управляйте проектами эффективно',
                    icon: (
                      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                      </svg>
                    )
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                    style={{
                      animation: `textRotate 16s ease-in-out infinite`,
                      animationDelay: `${index * 4}s`,
                      opacity: 0
                    }}
                  >
                    <div className="text-white drop-shadow-lg">{item.icon}</div>
                    <p className="text-2xl text-white font-semibold px-8 drop-shadow-lg">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats or features grid */}
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {[
                { number: '10K+', label: 'Активных пользователей' },
                { number: '99.9%', label: 'Время работы' },
                { number: '24/7', label: 'Поддержка' },
                { number: '50+', label: 'Интеграций' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
                  style={{
                    animation: `fadeSlideUp 0.6s ease-out ${0.8 + index * 0.1}s backwards`
                  }}
                >
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.25;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.35;
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes gridMove {
          from {
            transform: rotateX(60deg) translateZ(-100px) translateY(0);
          }
          to {
            transform: rotateX(60deg) translateZ(-100px) translateY(80px);
          }
        }

        @keyframes slideDown {
          0% {
            transform: translateY(-100%) rotate(15deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(15deg);
            opacity: 0;
          }
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes textRotate {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          5% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          20% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          25% {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
          26%, 100% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  )
}
