"use client"

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, ChevronDown, Send } from 'lucide-react'
import { cn } from '@/app/lib/utils'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Симуляция загрузки истории чата
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsLoading(true)
      setTimeout(() => {
        setMessages([
          {
            id: 1,
            sender: 'Максим',
            avatar: '/avatars/maxim.jpg',
            message: 'Техническая поддержка Планфакта завершает работу. ...',
            time: '28 декабря',
            isSupport: true
          },
          {
            id: 2,
            sender: 'Поддержка',
            avatar: '/avatars/support.jpg',
            message: '📅 Плавающий период в Быстрых фильтрах ...',
            time: '2 декабря',
            isSupport: true,
            hasIcon: true
          },
          {
            id: 3,
            sender: 'Планфакт на связи',
            avatar: '/avatars/planfact.jpg',
            message: '📱 Поп-ап',
            time: '11 ноября',
            isSupport: true,
            hasIcon: true,
            hasNotification: true
          },
          {
            id: 4,
            sender: 'Анастасия К.',
            avatar: '/avatars/anastasia.jpg',
            message: 'Пожалуйста, оцените работу агентов',
            time: '10 ноября',
            isSupport: false,
            subtitle: 'Работает на 🥕 Carrot quest'
          }
        ])
        setIsLoading(false)
      }, 1000)
    }
  }, [isOpen])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'Вы',
        message: newMessage,
        time: 'сейчас',
        isSupport: false,
        isOwn: true
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#4FC3F7] hover:bg-[#29B6F6] text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[#4FC3F7] text-white p-4 rounded-t-lg relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronDown size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">ПФ</span>
                </div>
                <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">СП</span>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-1">ПланФакт на связи</h3>
            <p className="text-sm text-white/90">Мы тут и готовы помочь</p>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex gap-4">
              <button className="flex-1 flex flex-col items-center gap-2 p-3 bg-[#4FC3F7] text-white rounded-lg hover:bg-[#29B6F6] transition-colors">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle size={16} />
                </div>
                <span className="text-sm font-medium">Написать</span>
              </button>
              <button className="flex-1 flex flex-col items-center gap-2 p-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                  <Send size={16} />
                </div>
                <span className="text-sm font-medium">Telegram</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {/* History Header */}
            <div className="p-4 text-center">
              <span className="text-sm text-slate-400">История</span>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-[#4FC3F7] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Messages List */}
            <div className="px-4 pb-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center">
                    {message.sender === 'Максим' && (
                      <span className="text-sm font-medium text-slate-600">М</span>
                    )}
                    {message.sender === 'Поддержка' && (
                      <MessageCircle size={16} className="text-[#4FC3F7]" />
                    )}
                    {message.sender === 'Планфакт на связи' && (
                      <MessageCircle size={16} className="text-[#4FC3F7]" />
                    )}
                    {message.sender === 'Анастасия К.' && (
                      <span className="text-sm font-medium text-slate-600">А</span>
                    )}
                    {message.isOwn && (
                      <span className="text-sm font-medium text-slate-600">Я</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">{message.sender}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{message.time}</span>
                        {message.hasNotification && (
                          <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            1
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 leading-relaxed">{message.message}</p>
                    
                    {message.subtitle && (
                      <p className="text-xs text-slate-400 mt-1">{message.subtitle}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите сообщение..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4FC3F7] focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-[#4FC3F7] text-white rounded-lg hover:bg-[#29B6F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}