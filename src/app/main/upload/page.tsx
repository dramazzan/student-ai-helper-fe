import React from 'react'
const TestDownloadList = React.lazy(() => import('@/components/fetching/TestDownloadList'))

const UploadPage = () => {
  return (
    <div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <TestDownloadList />
      </React.Suspense>
    </div>
  )
}

export default UploadPage