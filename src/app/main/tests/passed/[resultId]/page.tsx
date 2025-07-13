import React from 'react'
const TestResult = React.lazy(() => import('@/components/passing/TestResult'))

const ResultPage = () => {
  return (
    <div>
        <TestResult />
    </div>
  )
}

export default ResultPage