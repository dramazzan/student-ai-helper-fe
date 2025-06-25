import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div>
        <ul>
            <li>
                <Link href="/auth/login">Войти</Link>
            </li>
            <li>
                <Link href="/auth/register">Регистрация</Link>
            </li>
        </ul>
    
    </div>
  )
}

export default Navbar