"use client"

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, ChevronDown, Send } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import styles from './ChatWidget.module.scss'

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
        className={styles.chatButton}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className={styles.chatWidget}>
          {/* Header */}
          <div className={styles.header}>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
            >
              <ChevronDown size={20} />
            </button>
            
            <div className={styles.headerAvatars}>
              <div className={styles.avatarStack}>
                <div className={styles.avatar}>
                  <span className={styles.avatarText}>ПФ</span>
                </div>
                <div className={cn(styles.avatar, styles.secondary)}>
                  <span className={styles.avatarText}>СП</span>
                </div>
              </div>
            </div>
            
            <h3 className={styles.headerTitle}>ПланФакт на связи</h3>
            <p className={styles.headerSubtitle}>Мы тут и готовы помочь</p>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <div className={styles.actionsRow}>
              <button className={cn(styles.actionButton, styles.actionButtonPrimary)}>
                <div className={styles.actionButtonIcon}>
                  <MessageCircle size={16} />
                </div>
                <span className={styles.actionButtonText}>Написать</span>
              </button>
              <button className={cn(styles.actionButton, styles.actionButtonSecondary)}>
                <div className={styles.actionButtonIconSecondary}>
                  <Send size={16} />
                </div>
                <span className={styles.actionButtonText}>Telegram</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            {/* History Header */}
            <div className={styles.historyHeader}>
              <span className={styles.historyHeaderText}>История</span>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
              </div>
            )}

            {/* Messages List */}
            <div className={styles.messagesList}>
              {messages.map((message) => (
                <div key={message.id} className={styles.message}>
                  <div className={styles.messageAvatar}>
                    {message.sender === 'Максим' && (
                      <span className={styles.messageAvatarText}>М</span>
                    )}
                    {message.sender === 'Поддержка' && (
                      <MessageCircle size={16} className={styles.messageAvatarIcon} />
                    )}
                    {message.sender === 'Планфакт на связи' && (
                      <MessageCircle size={16} className={styles.messageAvatarIcon} />
                    )}
                    {message.sender === 'Анастасия К.' && (
                      <span className={styles.messageAvatarText}>А</span>
                    )}
                    {message.isOwn && (
                      <span className={styles.messageAvatarText}>Я</span>
                    )}
                  </div>
                  
                  <div className={styles.messageContent}>
                    <div className={styles.messageHeader}>
                      <span className={styles.messageSender}>{message.sender}</span>
                      <div className={styles.messageMeta}>
                        <span className={styles.messageTime}>{message.time}</span>
                        {message.hasNotification && (
                          <div className={styles.messageNotification}>
                            1
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className={styles.messageText}>{message.message}</p>
                    
                    {message.subtitle && (
                      <p className={styles.messageSubtitle}>{message.subtitle}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className={styles.inputSection}>
            <div className={styles.inputRow}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите сообщение..."
                className={styles.input}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={styles.sendButton}
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