import React from 'react'
import SearchBar from '../../components/SearchBar'
import NotifyCard from '../student/NotifyCard'


export default function StudentNotify() {
  return (
    <div calssName='p-4 bg-gradient-to-br from-blue-50 to-white'>
      <SearchBar />
      <NotifyCard />
    </div>
  )
}
