import { redirect } from 'next/navigation'

export default function AdminDashboard() {
  // Redirect to the new comprehensive dashboard
  redirect('/admin/dashboard')
}
