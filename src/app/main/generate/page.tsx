import React from 'react'
import GenerateTestForm from '@/components/GenerateTestForm'
import GenerateTestFromUrlForm from '@/components/GenerateTestFromUrlForm'

const GeneratePage = () => {
  return (
    <div>
         <div className="min-h-screen p-8 bg-gray-50">
      <GenerateTestForm />
      <GenerateTestFromUrlForm/>
    </div>
    </div>
  )
}

export default GeneratePage