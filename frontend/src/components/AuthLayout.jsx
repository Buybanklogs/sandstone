import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand" aria-label="SandStoneFX">
          <span className="brand-white">SandStone</span>
          <span className="brand-blue">FX</span>
        </div>
        <Outlet />
      </section>
    </main>
  )
}
