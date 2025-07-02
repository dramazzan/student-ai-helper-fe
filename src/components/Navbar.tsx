'use client'

import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="w-full px-6 py-4 bg-white shadow-md flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Student AI Helper</h1>

      <div className="flex space-x-6">
        <Link href="/main/generate" className="text-gray-700 hover:text-blue-600">Главная</Link>
        <Link href="/dashboard" className='text-gray-700 hover:text-blue-600'>Профиль</Link>
        <Link href="/dashboard/upload" className="text-gray-700 hover:text-blue-600">Загрузить</Link>
        <Link href="/main/tests" className="text-gray-700 hover:text-blue-600">Тесты</Link>
        <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">Выйти</Link>
    
      </div>
    </nav>
  )
}

export default Navbar
