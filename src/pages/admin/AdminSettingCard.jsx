import React from 'react'
import Setting from '../../components/Setting'
import SearchBar from '../../components/SearchBar'

export default function AdminSettingCard() {
  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-white">
    <SearchBar />
     <Setting />
    </div>
  )
}
