import React from 'react'
import SearchBar from "../../components/SearchBar"
import QnA from './AdminQnaCard'

export default function AdminQna() {
  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-white"> 
      <SearchBar />
        <QnA />
      
    </div>
  )
}
