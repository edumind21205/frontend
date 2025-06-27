import React from 'react'
import Searchbar from '../../components/SearchBar'
import AdminNotifyCard from './AdminNotifyCard'


export default function AdminNotify() {
    // const notifyList = [
    //     { id: 1, title: 'System Update', content: 'The system will be updated on Saturday.' },
    //     { id: 2, title: 'Maintenance Notice', content: 'Scheduled maintenance on Sunday.' },
    //     { id: 3, title: 'New Feature', content: 'A new feature has been added to the dashboard.' }
    // ];
  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-white">
        <Searchbar />
      <AdminNotifyCard  />
    </div>
  )
}
