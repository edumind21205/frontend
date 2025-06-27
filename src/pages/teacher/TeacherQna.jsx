import React from 'react'
import Searchbar from '../../components/SearchBar'
import QnA from './qna'

export default function TeacherQna() {
  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-white">
      
        <Searchbar />
        <QnA />

    </div>
  )
}
