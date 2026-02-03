"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/app/lib/utils'
import { useLogin } from '@/hooks/useAuth'
import styles from './auth.module.scss'

export default function LoginPage() {
  const router = useRouter()
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [particles, setParticles] = useState([])
  const [leftParticles, setLeftParticles] = useState([])
  
  // Login mutation
  const loginMutation = useLogin()

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

  const formatPhone = (value) => {
    // Убираем все кроме цифр
    let phone = value.replace(/\D/g, '')
    // Форматируем как +7 (XXX) XXX-XX-XX
    if (phone.length > 0) {
      if (phone[0] !== '7' && phone[0] !== '8') {
        phone = '7' + phone
      }
      if (phone[0] === '8') {
        phone = '7' + phone.slice(1)
      }
      if (phone.length > 1) {
        phone = `+7 (${phone.slice(1, 4)}${phone.length > 4 ? ') ' : ''}${phone.slice(4, 7)}${phone.length > 7 ? '-' : ''}${phone.slice(7, 9)}${phone.length > 9 ? '-' : ''}${phone.slice(9, 11)}`
      } else {
        phone = '+7'
      }
    }
    return phone
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (isRegisterMode) {
      // Registration logic
      if (formData.password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов')
        return
      }
      
      if (!formData.username) {
        setError('Укажите логин')
        return
      }
      
      if (!formData.email) {
        setError('Укажите email')
        return
      }
      
      if (!formData.phone) {
        setError('Укажите номер телефона')
        return
      }
      
      setIsSubmitting(true)
      
      try {
        // TODO: Реализовать API для регистрации
        // const response = await fetch('/api/auth/register', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     username: formData.username,
        //     email: formData.email,
        //     phone: formData.phone,
        //     password: formData.password,
        //     name: formData.name
        //   })
        // })
        
        // Пока просто переключаем на режим входа
        setTimeout(() => {
          setIsSubmitting(false)
          setIsRegisterMode(false)
          setFormData({
            username: '',
            email: '',
            phone: '',
            password: ''
          })
        }, 1500)
      } catch (error) {
        console.error('Registration error:', error)
        setError(error.message || 'Ошибка при регистрации')
        setIsSubmitting(false)
      }
    } else {
      // Login logic
    try {
      await loginMutation.mutateAsync({
        username: formData.username,
        password: formData.password,
      })
      
        // Redirect immediately after successful login
      router.push('/pages/operations')
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.message || 'Ошибка при входе'
      setError(errorMessage)
      }
    }
  }

  return (
    <div className="min-h-screen flex" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Left Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-12 bg-white">
        {/* Form container */}
        <div className="w-full max-w-md">
          <div 
            className={cn("bg-white rounded-3xl p-10 border border-slate-200", styles.formContainer)}
          >
            {/* Logo/Title */}
            <div className="mb-10">
              <h1 className={cn("text-4xl font-bold text-slate-900 mb-3", styles.titleGradient)}
              >
                ФинансУчет
              </h1>
              <p className="text-slate-600 text-lg">
                {isRegisterMode ? 'Создайте новый аккаунт' : 'Войдите в свой аккаунт'}
              </p>
              <p className="text-slate-500 text-sm mt-2">
                {isRegisterMode ? (
                  <>
                    Уже есть аккаунт?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(false)
                        setError('')
                        setFormData({
                          username: '',
                          email: '',
                          phone: '',
                          password: ''
                        })
                      }}
                      className="text-[#6366f1] hover:underline font-medium"
                    >
                      Войти
                    </button>
                  </>
                ) : (
                  <>
                    Нет аккаунта?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(true)
                        setError('')
                        setFormData({
                          username: '',
                          email: '',
                          phone: '',
                          password: ''
                        })
                      }}
                      className="text-[#6366f1] hover:underline font-medium"
                    >
                      Зарегистрироваться
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username/Login - для входа и регистрации */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Логин
                </label>
                <div className="relative group">
                  <div className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300",
                    focusedField === 'username' ? "text-[#6366f1] scale-110" : "text-slate-400"
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
                        ? "border-[#6366f1]" 
                        : "border-slate-200 hover:border-slate-300"
                    )}
                    placeholder="Введите логин"
                    required={isRegisterMode}
                  />
                </div>
              </div>

              {/* Email - только для регистрации */}
              {isRegisterMode && (
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Электронная почта
                  </label>
                  <div className="relative group">
                    <div className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300",
                      focusedField === 'email' ? "text-[#6366f1] scale-110" : "text-slate-400"
                    )}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        setError('')
                      }}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all text-slate-900 bg-white",
                        focusedField === 'email' 
                          ? "border-[#6366f1]" 
                          : "border-slate-200 hover:border-slate-300"
                      )}
                      placeholder="Введите email"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Phone - только для регистрации */}
              {isRegisterMode && (
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Номер телефона
                  </label>
                  <div className="relative group">
                    <div className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300",
                      focusedField === 'phone' ? "text-[#6366f1] scale-110" : "text-slate-400"
                    )}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: formatPhone(e.target.value) })
                        setError('')
                      }}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all text-slate-900 bg-white",
                        focusedField === 'phone' 
                          ? "border-[#6366f1]" 
                          : "border-slate-200 hover:border-slate-300"
                      )}
                      placeholder="+7 (XXX) XXX-XX-XX"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Пароль
                </label>
                <div className="relative group">
                  <div className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300",
                    focusedField === 'password' ? "text-[#6366f1] scale-110" : "text-slate-400"
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
                        ? "border-[#6366f1]" 
                        : "border-slate-200 hover:border-slate-300"
                    )}
                    placeholder={isRegisterMode ? "Минимум 6 символов" : "Введите пароль"}
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
                  disabled={isRegisterMode ? isSubmitting : loginMutation.isPending}
                  className="w-full bg-gradient-to-r from-[#6366f1] to-[#138496] text-white py-3.5 rounded-xl font-medium hover:shadow-xl hover:shadow-[#6366f1]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  {(isRegisterMode ? isSubmitting : loginMutation.isPending) ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isRegisterMode ? 'Регистрация...' : 'Вход...'}
                    </span>
                  ) : (
                    <span className="relative z-10">{isRegisterMode ? 'Зарегистрироваться' : 'Войти'}</span>
                  )}
                </button>
                
                {/* Pulsing glow */}
                {!(isRegisterMode ? isSubmitting : loginMutation.isPending) && (
                  <div className={cn("absolute inset-0 rounded-xl bg-[#6366f1]/20 -z-10 blur-xl", styles.pulsingGlow)} />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Animated Background */}
      <div className="w-1/2 relative overflow-hidden bg-gradient-to-br from-[#6366f1] via-[#138496] to-[#0e6b7a]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Large animated gradient orbs */}
          <div 
            className={cn(
              "absolute w-[500px] h-[500px] rounded-full blur-3xl transition-all duration-1000 ease-out",
              focusedField === 'username' ? styles.gradientOrb1Focused : styles.gradientOrb1Unfocused
            )}
          />
          
          <div 
            className={cn(
              "absolute w-[400px] h-[400px] rounded-full blur-3xl transition-all duration-1000 ease-out",
              focusedField === 'password' ? styles.gradientOrb2Focused : styles.gradientOrb2Unfocused
            )}
          />

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className={cn("absolute inset-0", styles.gridPattern)} />
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
          ].map((pos, i) => {
            const width = i % 3 === 0 ? '48px' : i % 3 === 1 ? '40px' : '32px';
            const height = i % 3 === 0 ? '48px' : i % 3 === 1 ? '40px' : '32px';
            const borderRadius = i % 2 === 0 ? '50%' : '25%';
            const floatDuration = `${10 + i * 1.5}s`;
            const rotateDuration = `${15 + i * 2}s`;
            const delay = `${i * 0.5}s`;
            
            return (
              <div
                key={i}
                className={cn("absolute", styles.floatingShape)}
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  animationName: 'float',
                  animationDuration: floatDuration,
                  animationTimingFunction: 'ease-in-out',
                  animationIterationCount: 'infinite',
                  animationDelay: delay
                }}
              >
                <div
                  className={cn(
                    "border-2 border-white/20 backdrop-blur-sm",
                    styles.shapeInner
                  )}
                  style={{
                    width: width,
                    height: height,
                    borderRadius: borderRadius,
                    animationName: 'rotate',
                    animationDuration: rotateDuration,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite'
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-8">
          <div className="max-w-2xl w-full text-center">
            {/* Animated logo/icon */}
            <div className="mb-6 relative">
              <div className={cn("w-20 h-20 mx-auto relative", styles.logoContainer)}>
                <div className={cn("absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30", styles.logoInner)} />
                <div className="absolute inset-2 bg-white/10 rounded-xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className={cn("text-4xl font-bold mb-4 leading-tight", styles.welcomeTitle)}>
              {isRegisterMode ? 'Начните управлять финансами уже сегодня!' : 'Добро пожаловать в ФинансУчет!'}
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
                    className={cn("absolute inset-0 flex flex-col items-center justify-center gap-4", styles.rotatingTextItem)}
                    data-index={index}
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
                  className={cn("bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105", styles.statCard)}
                  data-index={index}
                >
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
