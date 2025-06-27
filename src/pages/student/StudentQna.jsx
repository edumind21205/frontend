import React from 'react'
import SearchBar from '../../components/SearchBar'
import QnA from "./StudentQnaCard"

export default function StudentQna() {
  return (
    <div className='p-4 bg-gradient-to-br from-blue-50 to-white'>
     <SearchBar />
     <QnA/>
    </div>
  )
}
