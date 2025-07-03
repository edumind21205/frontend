import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Setting() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true) // default true for initial fetch
  const [user, setUser] = useState(null)

  // Get token from localStorage (adjust if you store it elsewhere)
  const token = localStorage.getItem('token')
  // console.log('Token:', token)
  const username = localStorage.getItem('user')
  // console.log('User:', username)


  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://eduminds-production-180d.up.railway.app/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data && res.data.user) {
          setUser(res.data.user)
          setForm(f => ({
            ...f,
            name: res.data.user.name || '',
            email: res.data.user.email || ''
          }))
        } else {
          setError('User data not found')
        }
      } catch (err) {
        setError('Failed to load user info')
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchUser()
    else setLoading(false);
  }, [token])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpdate = async e => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await axios.put(
        'https://eduminds-production-180d.up.railway.app/api/auth/profile',
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage(res.data.message)
      setForm({ ...form, password: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await axios.delete('https://eduminds-production-180d.up.railway.app/api/auth/delete-profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage(res.data.message)
      // Optionally, log out user after deletion
      localStorage.removeItem('token')
      window.location.href = '/'
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Loading spinner - match AdminQnaCard style */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">Update Profile</h2>
              <p className="text-gray-600 text-base md:text-lg">
                Manage your account information and security settings.
              </p>
            </div>
            <img
              src="/assets/logo.png"
              alt="Settings"
              className="w-20 h-20 md:w-28 md:h-28 object-contain hidden md:block"
            />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
            {user && (
              <div className="mb-4 p-3 bg-gray-100 rounded">
                <div><b>Current Name:</b> {user.name}</div>
                <div><b>Current Email:</b> {user.email}</div>
                <div><b>Role:</b> {user.role}</div>
              </div>
            )}
            {message && <div className="mb-2 text-green-600">{message}</div>}
            {error && <div className="mb-2 text-red-600">{error}</div>}
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">New Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className="w-full border border-blue-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">New Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full border border-blue-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">New Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange}
                  className="w-full border border-blue-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400" />
              </div>
              <button type="submit" disabled={!!loading}
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition">
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
            <hr className="my-6" />
            <button onClick={handleDelete} disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full">
              {loading ? 'Processing...' : 'Delete Account'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

