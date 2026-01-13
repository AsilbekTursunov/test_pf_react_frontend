"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PokazateliPage() {
    const router = useRouter()
    
    useEffect(() => {
        // Перенаправляем на главную страницу
        router.replace('/')
    }, [router])

    // Показываем пустую страницу во время перенаправления
    return null
}