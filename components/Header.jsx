"use client"

import { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, Video, Apple, Smartphone, Play, MoreVertical, Maximize2 } from 'lucide-react'
import { cn } from '@/app/lib/utils'

export function Header() {
    const [isHelpOpen, setIsHelpOpen] = useState(false)
    const [isBalanceOpen, setIsBalanceOpen] = useState(false)
    const [balanceView, setBalanceView] = useState('groups')
    const [expandedEntities, setExpandedEntities] = useState([])
    const [expandedGroups, setExpandedGroups] = useState(['unallocated'])
    const [activeEntityMenu, setActiveEntityMenu] = useState(null)
    const [activeGroupMenu, setActiveGroupMenu] = useState(null)
    const [modalMode, setModalMode] = useState('full')
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isProfileClosing, setIsProfileClosing] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [isEntitiesDropdownOpen, setIsEntitiesDropdownOpen] = useState(false)

    const helpRef = useRef(null)
    const balanceRef = useRef(null)
    const entityMenuRef = useRef(null)
    const groupMenuRef = useRef(null)
    const viewRef = useRef(null)
    const profileRef = useRef(null)
    const notificationsRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (helpRef.current && !helpRef.current.contains(event.target)) {
                setIsHelpOpen(false)
            }
            if (balanceRef.current && !balanceRef.current.contains(event.target)) {
                setIsBalanceOpen(false)
                setActiveEntityMenu(null)
                setActiveGroupMenu(null)
            }
            if (entityMenuRef.current && !entityMenuRef.current.contains(event.target)) {
                setActiveEntityMenu(null)
            }
            if (groupMenuRef.current && !groupMenuRef.current.contains(event.target)) {
                setActiveGroupMenu(null)
            }
            if (viewRef.current && !viewRef.current.contains(event.target)) {
                setIsViewOpen(false)
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileClosing(true)
                setTimeout(() => {
                    setIsProfileOpen(false)
                    setIsProfileClosing(false)
                }, 200)
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsNotificationsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        if (isBalanceOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [isBalanceOpen])

    const toggleExpandEntity = (id) => {
        setExpandedEntities(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        )
        setActiveEntityMenu(null)
    }

    const toggleExpandGroup = (id) => {
        setExpandedGroups(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        )
        setActiveGroupMenu(null)
    }

    return (
        <>
            {/* Backdrop Dimming Effect */}
            {isBalanceOpen && (
                <div className="fixed inset-0 bg-black/40 z-[45] animate-in fade-in duration-300 pointer-events-none" />
            )}

            <header className="fixed top-0 right-0 left-[90px] h-[55px] bg-[#34495e] border-b border-[#2c3e50] flex items-center justify-between px-4 z-50 text-white shadow-sm">
                {/* Left section: Help & Training Dropdown */}
                <div className="flex items-center relative" ref={helpRef}>
                    <button
                        onClick={() => {
                            setIsHelpOpen(!isHelpOpen)
                            setIsBalanceOpen(false)
                        }}
                        className={cn(
                            "flex items-center gap-1 px-3 py-1 rounded transition-colors text-[13px] font-normal group",
                            isHelpOpen ? "bg-[#2c3e50]" : "hover:bg-[#2c3e50]"
                        )}
                    >
                        <span>Помощь и обучение</span>
                        <ChevronDown size={14} className={cn("text-white/70 transition-transform duration-200", isHelpOpen && "rotate-180")} />
                    </button>

                    {/* Mega Menu Dropdown */}
                    {isHelpOpen && (
                        <div className="absolute top-full left-0 mt-2 w-[850px] bg-white rounded-lg shadow-2xl border border-slate-200 p-8 flex gap-10 z-[60] text-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Sections... (omitted for brevity in logic but kept in full write) */}
                            <div className="flex-1">
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-5">Примеры бизнеса</h3>
                                <ul className="flex flex-col gap-3">
                                    {['Строительный бизнес', 'Продажи на Wildberries', 'Маркетинговое агентство', 'Оптово-розничная торговля', 'Тендерный бизнес', 'Медицинский центр'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="text-[14px] text-[#17a2b8] hover:underline decoration-1 underline-offset-4">{item}</a>
                                        </li>
                                    ))}
                                </ul>
                                
                                <div className="mt-8">
                                    <div className="relative">
                                        <button 
                                            onClick={() => setIsEntitiesDropdownOpen(!isEntitiesDropdownOpen)}
                                            className="w-full flex items-center justify-between p-3 bg-[#17a2b8] text-white rounded-lg hover:bg-[#138496] transition-colors"
                                        >
                                            <span className="text-[14px] font-medium">Юрлица и счета</span>
                                            <ChevronDown size={16} className={cn("transition-transform duration-200", isEntitiesDropdownOpen && "rotate-180")} />
                                        </button>
                                        
                                        {isEntitiesDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-[70] overflow-hidden">
                                                <div className="p-4 border-b border-slate-100">
                                                    <div className="relative">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Поиск по списку"
                                                            className="w-full pl-10 pr-4 py-2 border border-[#17a2b8] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#17a2b8]/20"
                                                        />
                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <circle cx="11" cy="11" r="8"></circle>
                                                                <path d="m21 21-4.35-4.35"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="max-h-[300px] overflow-y-auto">
                                                    {[
                                                        'ИП Алексеенко Михаил Фе...',
                                                        'Сейф',
                                                        'Альфа банк',
                                                        'Карта физ. лица',
                                                        'ООО "Прометей"',
                                                        'Т-Банк'
                                                    ].map((item, idx) => (
                                                        <button 
                                                            key={idx}
                                                            className="w-full text-left px-4 py-3 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0"
                                                        >
                                                            {item}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-5 uppercase">Демонстрация ПланФакта</h3>
                                <div className="flex flex-col gap-4">
                                    <div className="w-10 h-10 bg-[#4285f4] rounded-full flex items-center justify-center text-white">
                                        <Video size={20} fill="currentColor" />
                                    </div>
                                    <p className="text-[14px] text-slate-500 leading-snug">
                                        Эксперт ПланФакта за 15 минут бесплатно покажет, как сервис будет полезен вашему бизнесу
                                    </p>
                                    <a href="#" className="text-[14px] text-[#17a2b8] font-medium hover:underline decoration-1 underline-offset-4">Записаться на демо</a>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-5 uppercase">Мобильное приложение</h3>
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-3 text-slate-600">
                                        <Apple size={24} className="hover:text-black cursor-pointer" />
                                        <Play size={24} className="hover:text-blue-600 cursor-pointer" />
                                        <Smartphone size={24} className="hover:text-sky-500 cursor-pointer" />
                                    </div>
                                    <p className="text-[14px] text-slate-500 leading-snug">
                                        Управляйте бизнесом со смартфона с помощью приложения ПланФакт
                                    </p>
                                    <a href="#" className="text-[14px] text-[#17a2b8] font-medium hover:underline decoration-1 underline-offset-4">Скачать</a>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-5 uppercase">Полезные материалы</h3>
                                <ul className="flex flex-col gap-3">
                                    {['Справка и инструкции', 'Обучающие видео'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="text-[14px] text-[#17a2b8] hover:underline decoration-1 underline-offset-4">{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right side containers */}
                <div className="flex items-center h-full">
                    {/* Balance Section */}
                    <div className="flex flex-col items-center px-6 border-r border-white/5 justify-center h-[35px] my-auto relative" ref={balanceRef}>
                        <div
                            onClick={() => {
                                setIsBalanceOpen(!isBalanceOpen)
                                setIsHelpOpen(false)
                            }}
                            className="flex items-center gap-1.5 cursor-pointer leading-none mb-0.5 group"
                        >
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            <span className="text-[13px] font-bold text-white whitespace-nowrap">На счетах 2 975 071 <span className="font-serif">₽</span></span>
                            <ChevronDown size={14} className={cn("text-white/70 group-hover:text-white transition-opacity", isBalanceOpen && "rotate-180")} />
                        </div>
                        <p className="text-[10px] text-yellow-500 font-bold leading-none">Разрыв с 21.08.25 по 19.01.26</p>

                        {/* Balance Modal */}
                        {isBalanceOpen && (
                            <div className={cn(
                                "absolute top-[calc(100%+12px)] right-[-100px] lg:right-[-250px] bg-white rounded shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 z-[60] text-slate-800 animate-in fade-in zoom-in-95 duration-200 overflow-hidden max-h-[80vh] overflow-y-auto",
                                modalMode === 'full' ? "w-[950px] p-8" : "w-[450px] p-0"
                            )}>
                                {/* Modal Mode: Compact or Full */}
                                {modalMode === 'compact' ? (
                                    <div className="flex flex-col">
                                        <div className="p-6 border-b border-slate-50">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                                    <h2 className="text-[26px] font-bold text-slate-800 leading-none">2 975 071 ₽</h2>
                                                </div>
                                                <div className="relative" ref={viewRef}>
                                                    <button
                                                        onClick={() => setIsViewOpen(!isViewOpen)}
                                                        className="flex items-center gap-2 bg-white px-4 py-2 rounded text-[13px] text-slate-700 border border-slate-200 font-normal hover:bg-slate-50 transition-colors"
                                                    >
                                                        <span>Вид</span>
                                                        <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", isViewOpen && "rotate-180")} />
                                                    </button>

                                                    {isViewOpen && (
                                                        <div className="absolute top-full right-0 mt-2 w-[220px] bg-white rounded shadow-xl border border-slate-100 py-3 z-[100] animate-in fade-in zoom-in-95 duration-150">
                                                            <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Режим окна</span>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setModalMode('compact')
                                                                    setIsViewOpen(false)
                                                                }}
                                                                className={cn(
                                                                    "w-full flex items-center justify-between px-4 py-2.5 text-[13px] hover:bg-slate-50 transition-colors text-left",
                                                                    modalMode === 'compact' ? "text-[#17a2b8] font-semibold" : "text-slate-700"
                                                                )}
                                                            >
                                                                <span>Компактный</span>
                                                                {modalMode === 'compact' && <span className="text-[#17a2b8]">✓</span>}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setModalMode('full')
                                                                    setIsViewOpen(false)
                                                                }}
                                                                className={cn(
                                                                    "w-full flex items-center justify-between px-4 py-2.5 text-[13px] hover:bg-slate-50 transition-colors text-left",
                                                                    modalMode === 'full' ? "text-[#17a2b8] font-semibold" : "text-slate-700"
                                                                )}
                                                            >
                                                                <span>Полный</span>
                                                                {modalMode === 'full' && <span className="text-[#17a2b8]">✓</span>}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-[12px] text-slate-400 ml-5.5 font-normal">13 Января 2026 | 12:46</p>
                                        </div>

                                        <div className="flex flex-col p-4 gap-4 max-h-[400px] overflow-y-auto">
                                            {balanceView === 'accounts' && [
                                                { name: 'Альфа банк', balance: '930 894', status: 'Разрыв с 09.03.26', color: 'bg-red-500' },
                                                { name: 'Карта физ. лица', balance: '110 000', color: 'bg-green-500' },
                                                { name: 'Наличка', balance: '1 397 082', color: 'bg-green-500' },
                                                { name: 'Сбер', balance: '450 067', status: 'Разрыв с 23.02.26', color: 'bg-red-500' },
                                                { name: 'Сейф', balance: '-178 226', status: 'Разрыв с 21.08.25 по 19.01.26', color: 'bg-red-500' },
                                                { name: 'Т-Банк', balance: '265 254', status: 'Разрыв с 15.02.26 по 16.02.26', color: 'bg-red-500' }
                                            ].map((acc, idx) => (
                                                <div key={idx} className="flex items-start justify-between px-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", acc.color)}></div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[15px] font-normal text-slate-800">{acc.name}</span>
                                                            {acc.status && (
                                                                <span className="text-[11px] text-red-500 font-semibold leading-tight mt-0.5">{acc.status}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-[15px] font-semibold text-slate-800 whitespace-nowrap ml-4">
                                                        {acc.balance} <span className="text-slate-400 font-normal">₽</span>
                                                    </span>
                                                </div>
                                            ))}

                                            {balanceView === 'groups' && [
                                                { name: 'Основные счета', balance: '2 100 000', color: 'bg-blue-500' },
                                                { name: 'Резервные счета', balance: '875 071', color: 'bg-green-500' },
                                                { name: 'Проблемные счета', balance: '-178 226', status: 'Требует внимания', color: 'bg-red-500' }
                                            ].map((group, idx) => (
                                                <div key={idx} className="flex items-start justify-between px-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", group.color)}></div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[15px] font-normal text-slate-800">{group.name}</span>
                                                            {group.status && (
                                                                <span className="text-[11px] text-red-500 font-semibold leading-tight mt-0.5">{group.status}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-[15px] font-semibold text-slate-800 whitespace-nowrap ml-4">
                                                        {group.balance} <span className="text-slate-400 font-normal">₽</span>
                                                    </span>
                                                </div>
                                            ))}

                                            {balanceView === 'entities' && [
                                                { name: 'ООО "Прометей"', balance: '2 112 403', color: 'bg-blue-500' },
                                                { name: 'ИП Алексеенко М.Ф.', balance: '862 668', color: 'bg-green-500' }
                                            ].map((entity, idx) => (
                                                <div key={idx} className="flex items-start justify-between px-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", entity.color)}></div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[15px] font-normal text-slate-800">{entity.name}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-[15px] font-semibold text-slate-800 whitespace-nowrap ml-4">
                                                        {entity.balance} <span className="text-slate-400 font-normal">₽</span>
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        {/* Modal Header */}
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                                        <h2 className="text-[26px] font-bold text-slate-800 leading-none">2 975 071 ₽</h2>
                                                    </div>
                                                    <p className="text-[12px] text-slate-400 ml-5.5 mt-1 font-normal">13 Января 2026 | 12:25</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex rounded overflow-hidden">
                                                    <button
                                                        onClick={() => setBalanceView('groups')}
                                                        className={cn(
                                                            "px-5 py-2 text-[13px] font-normal transition-colors",
                                                            balanceView === 'groups'
                                                                ? "bg-white text-[#17a2b8] border border-[#17a2b8] z-10"
                                                                : "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
                                                        )}
                                                    >
                                                        По группам
                                                    </button>
                                                    <button
                                                        onClick={() => setBalanceView('entities')}
                                                        className={cn(
                                                            "px-5 py-2 text-[13px] font-normal transition-colors -ml-[1px]",
                                                            balanceView === 'entities'
                                                                ? "bg-white text-[#17a2b8] border border-[#17a2b8] z-10"
                                                                : "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
                                                        )}
                                                    >
                                                        По юрлицам
                                                    </button>
                                                </div>
                                                <div className="relative" ref={viewRef}>
                                                    <button
                                                        onClick={() => setIsViewOpen(!isViewOpen)}
                                                        className="flex items-center gap-2 bg-white px-4 py-2 rounded text-[13px] text-slate-700 border border-slate-200 font-normal hover:bg-slate-50 transition-colors"
                                                    >
                                                        <span>Вид</span>
                                                        <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", isViewOpen && "rotate-180")} />
                                                    </button>

                                                    {isViewOpen && (
                                                        <div className="absolute top-full right-0 mt-2 w-[220px] bg-white rounded shadow-xl border border-slate-100 py-3 z-[100] animate-in fade-in zoom-in-95 duration-150">
                                                            <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Режим окна</span>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setModalMode('compact')
                                                                    setIsViewOpen(false)
                                                                }}
                                                                className={cn(
                                                                    "w-full flex items-center justify-between px-4 py-2.5 text-[13px] hover:bg-slate-50 transition-colors text-left",
                                                                    modalMode === 'compact' ? "text-[#17a2b8] font-semibold" : "text-slate-700"
                                                                )}
                                                            >
                                                                <span>Компактный</span>
                                                                {modalMode === 'compact' && <span className="text-[#17a2b8]">✓</span>}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setModalMode('full')
                                                                    setIsViewOpen(false)
                                                                }}
                                                                className={cn(
                                                                    "w-full flex items-center justify-between px-4 py-2.5 text-[13px] hover:bg-slate-50 transition-colors text-left",
                                                                    modalMode === 'full' ? "text-[#17a2b8] font-semibold" : "text-slate-700"
                                                                )}
                                                            >
                                                                <span>Полный</span>
                                                                {modalMode === 'full' && <span className="text-[#17a2b8]">✓</span>}
                                                            </button>
                                                            
                                                            <div className="px-4 py-2 border-t border-slate-50 mt-1 pt-3">
                                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Группировка</span>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setBalanceView('accounts')
                                                                    setIsViewOpen(false)
                                                                }}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-4 py-2.5 text-[13px] hover:bg-slate-50 transition-colors text-left",
                                                                    balanceView === 'accounts' ? "text-[#17a2b8] font-semibold" : "text-slate-700"
                                                                )}
                                                            >
                                                                <span>По счетам</span>
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setBalanceView('groups')
                                                                    setIsViewOpen(false)
                                                                }}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-4 py-2.5 text-[13px] hover:bg-slate-50 transition-colors text-left",
                                                                    balanceView === 'groups' ? "text-[#17a2b8] font-semibold" : "text-slate-700"
                                                                )}
                                                            >
                                                                <span>По группам</span>
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setBalanceView('entities')
                                                                    setIsViewOpen(false)
                                                                }}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-4 py-2.5 text-[13px] hover:bg-slate-50 transition-colors text-left",
                                                                    balanceView === 'entities' ? "text-[#17a2b8] font-semibold" : "text-slate-700"
                                                                )}
                                                            >
                                                                <span>По юр. лицам</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => setExpandedGroups(expandedGroups.length ? [] : ['unallocated'])}
                                                    className="text-[13px] text-[#17a2b8] font-normal ml-4 hover:underline"
                                                >
                                                    {expandedGroups.length === 0 ? 'Развернуть группы' : 'Свернуть группы'}
                                                </button>
                                            </div>
                                        </div>

                                        {balanceView === 'groups' && (
                                            <div className="grid grid-cols-3 gap-5">
                                                {[
                                                    {
                                                        id: 'unallocated',
                                                        name: 'Нераспределенные (6)',
                                                        balance: '2 975 071',
                                                        accounts: [
                                                            { name: 'Наличка', color: 'bg-green-500' },
                                                            { name: 'Альфа банк', balance: '930 894', status: 'Разрыв с 09.03.26', color: 'bg-red-500' },
                                                            { name: 'Сбер', balance: '450 067', status: 'Разрыв с 23.02.26', color: 'bg-red-500' },
                                                            { name: 'Т-Банк', balance: '265 254', status: 'Разрыв с 15.02.26 по 16.02.26', color: 'bg-red-500' },
                                                            { name: 'Карта физ. лица', balance: '110 000', color: 'bg-green-500' },
                                                            { name: 'Сейф', balance: '-178 226', status: 'Разрыв с 21.08.25 по 19.01.26', color: 'bg-red-500' }
                                                        ]
                                                    },
                                                    { id: 'deposits', name: 'Депозиты (0)', balance: '0', accounts: [] },
                                                    { id: 'new', name: 'Новая группа (0)', balance: '0', accounts: [] }
                                                ].map((group) => (
                                                    <div key={group.id} className="flex flex-col gap-4">
                                                        <div className="relative">
                                                            <div className="flex items-center justify-between bg-[#f4f6f8] px-4 py-2.5 rounded group">
                                                                <span className="text-[13px] font-semibold text-slate-700">{group.name}</span>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-[13px] font-bold">{group.balance} <span className="text-slate-400 font-normal">₽</span></span>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActiveGroupMenu(activeGroupMenu === group.id ? null : group.id);
                                                                        }}
                                                                        className="hover:text-slate-600 transition-colors"
                                                                    >
                                                                        <MoreVertical size={16} className="text-slate-300" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Group Actions Dropdown */}
                                                            {activeGroupMenu === group.id && (
                                                                <div
                                                                    ref={groupMenuRef}
                                                                    className="absolute left-[30px] top-[calc(100%+4px)] w-[180px] bg-white rounded shadow-xl border border-slate-100 z-[70] py-1 animate-in fade-in zoom-in-95 duration-150"
                                                                >
                                                                    <button
                                                                        onClick={() => toggleExpandGroup(group.id)}
                                                                        className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors group"
                                                                    >
                                                                        <Maximize2 size={16} className="text-slate-400 group-hover:text-[#17a2b8]" />
                                                                        <span>{expandedGroups.includes(group.id) ? 'Свернуть' : 'Развернуть'}</span>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Expanded Content or Placeholder */}
                                                        {expandedGroups.includes(group.id) ? (
                                                            group.accounts.length > 0 ? (
                                                                <div className="flex flex-col gap-4 pl-4 mt-2">
                                                                    {group.accounts.map((acc, idx) => (
                                                                        <div key={idx} className="flex items-start justify-between">
                                                                            <div className="flex items-start gap-2.5">
                                                                                <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", acc.color)}></div>
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-[13px] font-normal text-slate-700">{acc.name}</span>
                                                                                    {acc.status && (
                                                                                        <span className="text-[10px] text-red-500 font-bold leading-tight mt-0.5">{acc.status}</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            {acc.balance && (
                                                                                <span className="text-[13px] font-semibold text-slate-800 whitespace-nowrap ml-4">
                                                                                    {acc.balance} <span className="text-slate-400 font-normal">₽</span>
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="flex justify-center mt-4">
                                                                    <span className="text-[12px] text-slate-400">Переместите счета в эту группу</span>
                                                                </div>
                                                            )
                                                        ) : (
                                                            <div className="flex justify-center mt-4">
                                                                <span className="text-[12px] text-slate-400">Переместите счета в эту группу</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Modal Content - Legal Entities View */}
                                        {balanceView === 'entities' && (
                                            <div className="grid grid-cols-3 gap-5">
                                                {[
                                                    { id: 'prometey', name: 'ООО "Прометей" (3)', balance: '2 112 403', accounts: [] },
                                                    {
                                                        id: 'alekseenko',
                                                        name: 'ИП Алексеенко Михаил Федоро...',
                                                        balance: '862 668',
                                                        accounts: [
                                                            { name: 'Альфа банк', balance: '930 894', status: 'Разрыв с 09.03.26', color: 'bg-red-500' },
                                                            { name: 'Карта физ. лица', balance: '110 000', color: 'bg-green-500' },
                                                            { name: 'Сейф', balance: '-178 226', status: 'Разрыв с 21.08.25 по 19.01.26', color: 'bg-red-500' }
                                                        ]
                                                    }
                                                ].map((entity) => (
                                                    <div key={entity.id} className="flex flex-col gap-4">
                                                        <div className="relative">
                                                            <div className="flex items-center justify-between bg-[#f4f6f8] px-4 py-2.5 rounded group">
                                                                <span className="text-[13px] font-semibold text-slate-700 truncate mr-2" title={entity.name}>{entity.name}</span>
                                                                <div className="flex items-center gap-3 shrink-0">
                                                                    <span className="text-[13px] font-bold">{entity.balance} <span className="text-slate-400 font-normal">₽</span></span>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActiveEntityMenu(activeEntityMenu === entity.id ? null : entity.id);
                                                                        }}
                                                                        className="hover:text-slate-600 transition-colors"
                                                                    >
                                                                        <MoreVertical size={16} className="text-slate-300" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Entity Actions Dropdown */}
                                                            {activeEntityMenu === entity.id && (
                                                                <div
                                                                    ref={entityMenuRef}
                                                                    className="absolute left-[30px] top-[calc(100%+4px)] w-[180px] bg-white rounded shadow-xl border border-slate-100 z-[70] py-1 animate-in fade-in zoom-in-95 duration-150"
                                                                >
                                                                    <button
                                                                        onClick={() => toggleExpandEntity(entity.id)}
                                                                        className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors group"
                                                                    >
                                                                        <Maximize2 size={16} className="text-slate-400 group-hover:text-[#17a2b8]" />
                                                                        <span>Развернуть</span>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Expanded Accounts List */}
                                                        {expandedEntities.includes(entity.id) && entity.accounts.length > 0 && (
                                                            <div className="flex flex-col gap-4 pl-4 mt-2">
                                                                {entity.accounts.map((acc, idx) => (
                                                                    <div key={idx} className="flex items-start justify-between">
                                                                        <div className="flex items-start gap-2.5">
                                                                            <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", acc.color)}></div>
                                                                            <div className="flex flex-col">
                                                                                <span className="text-[13px] font-normal text-slate-700">{acc.name}</span>
                                                                                {acc.status && (
                                                                                    <span className="text-[10px] text-red-500 font-bold leading-tight mt-0.5">{acc.status}</span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-[13px] font-semibold text-slate-800 whitespace-nowrap ml-4">
                                                                            {acc.balance} <span className="text-slate-400 font-normal">₽</span>
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                )}
                            </div>
                        )}
                    </div>
                    {/* Sparkline Section */}
                    <div
                        onClick={() => {
                            setIsBalanceOpen(!isBalanceOpen)
                            setIsHelpOpen(false)
                        }}
                        className="flex items-center px-6 h-[35px] my-auto border-r border-white/5 cursor-pointer group"
                    >
                        <div className="h-6 w-24">
                            <svg viewBox="0 0 100 30" width="100%" height="100%" preserveAspectRatio="none" className="overflow-visible group-hover:opacity-80 transition-opacity">
                                <path
                                    d="M0,8 L10,8 L11,15 L15,10 L18,22 L22,12 L25,18 L30,12 L35,15 L40,8 L45,18 L50,12 L55,20 L60,15 L65,18 L70,8 L75,18 L80,22 L85,15"
                                    fill="none"
                                    stroke="#4ade80"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M85,15 L88,25 L92,25 L95,15 L100,20"
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    opacity="0.6"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* User Info Section */}
                    <div className="flex flex-col items-end px-6 h-[35px] my-auto justify-center relative" ref={profileRef}>
                        <div 
                            onClick={() => {
                                if (isProfileOpen) {
                                    setIsProfileClosing(true)
                                    setTimeout(() => {
                                        setIsProfileOpen(false)
                                        setIsProfileClosing(false)
                                    }, 200)
                                } else {
                                    setIsProfileOpen(true)
                                }
                            }}
                            className="flex items-center gap-1 text-[13px] font-bold cursor-pointer leading-none mb-0.5 group"
                        >
                            <span className="whitespace-nowrap">demo-guest@planfact.io</span>
                            <ChevronDown size={14} className={cn("text-white/70 group-hover:text-white transition-all duration-200", isProfileOpen && "rotate-180")} />
                        </div>
                        <p className="text-[10px] text-white/50 leading-none">Подписка активна</p>

                        {/* Profile Dropdown */}
                        {(isProfileOpen || isProfileClosing) && (
                            <div 
                                className={cn(
                                    "absolute top-full right-0 mt-2 w-[280px] bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-[70] overflow-hidden transition-all duration-200",
                                    isProfileClosing ? "opacity-0 translate-y-[-8px]" : "opacity-100 translate-y-0"
                                )}
                            >
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <div className="text-[14px] font-semibold text-slate-800">demo-guest@planfact.io</div>
                                    <div className="text-[12px] text-slate-500">Подписка активна</div>
                                </div>
                                
                                <div className="py-2">
                                    {[
                                        { 
                                            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>,
                                            text: 'Тарифы и оплата' 
                                        },
                                        { 
                                            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>,
                                            text: 'Внедрить под ключ' 
                                        },
                                        { 
                                            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>,
                                            text: 'Обучиться ПланФакту' 
                                        },
                                        { 
                                            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>,
                                            text: 'Настройки аккаунта' 
                                        },
                                        { 
                                            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>,
                                            text: 'Помощь и справка' 
                                        },
                                        { 
                                            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>,
                                            text: 'Стать партнером' 
                                        },
                                        { 
                                            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                            </svg>,
                                            text: 'Программа лояльности' 
                                        },
                                        { 
                                            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>,
                                            text: 'Скидки от друзей' 
                                        },
                                        { 
                                            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>,
                                            text: 'История обновлений' 
                                        },
                                        { 
                                            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>,
                                            text: 'Соглашение' 
                                        }
                                    ].map((item, idx) => (
                                        <button 
                                            key={idx}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors text-left"
                                            style={{ 
                                                animation: isProfileClosing 
                                                    ? `fadeSlideOut 0.15s ease-in ${(9 - idx) * 0.02}s backwards`
                                                    : `fadeSlideUp 0.2s ease-out ${idx * 0.03}s backwards`
                                            }}
                                        >
                                            <span className="text-slate-600">{item.icon}</span>
                                            <span>{item.text}</span>
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="border-t border-slate-100">
                                    <button 
                                        onClick={async () => {
                                            setIsLoggingOut(true)
                                            await new Promise(resolve => setTimeout(resolve, 800))
                                            document.cookie = 'isAuthenticated=; path=/; max-age=0'
                                            localStorage.removeItem('isAuthenticated')
                                            localStorage.removeItem('userEmail')
                                            window.location.href = '/pages/auth'
                                        }}
                                        disabled={isLoggingOut}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-red-600 hover:bg-red-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ 
                                            animation: isProfileClosing 
                                                ? 'fadeSlideOut 0.15s ease-in 0s backwards'
                                                : 'fadeSlideUp 0.2s ease-out 0.3s backwards'
                                        }}
                                    >
                                        {isLoggingOut ? (
                                            <>
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="font-medium">Выход...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                <span className="font-medium">Выйти из аккаунта</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notification & Billing */}
                    <div className="flex items-center gap-4 pl-4">
                        <div className="relative" ref={notificationsRef}>
                            <button 
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <Bell size={18} fill="currentColor" />
                            </button>

                            {/* Notifications Modal */}
                            {isNotificationsOpen && (
                                <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center animate-in fade-in duration-300">
                                    <div className="bg-white rounded-lg shadow-2xl w-[500px] max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200">
                                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                            <h2 className="text-[20px] font-bold text-slate-800">Уведомления</h2>
                                            <button 
                                                onClick={() => setIsNotificationsOpen(false)}
                                                className="text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </button>
                                        </div>
                                        
                                        <div className="flex flex-col items-center justify-center py-16 px-8">
                                            <div className="w-24 h-24 mb-6 relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 rounded-full"></div>
                                                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                        </svg>
                                                    </div>
                                                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center ml-2">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                            <path d="M9 11l3 3l8-8"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-[24px] font-bold text-slate-800 mb-3">Здесь пока пусто</h3>
                                            <p className="text-[16px] text-slate-500 text-center leading-relaxed">
                                                Новые уведомления появятся в этом окне
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="px-4 py-1.5 border border-white/40 rounded text-[13px] font-normal hover:bg-white hover:text-[#34495e] transition-all whitespace-nowrap">
                            Тарифы и оплата
                        </button>
                    </div>
                </div>
            </header>
        </>
    )
}
