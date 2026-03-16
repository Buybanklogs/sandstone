import { useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Zm2 .62v.3l6 4.53 6-4.53v-.3a.75.75 0 0 0-.75-.75H6.75A.75.75 0 0 0 6 7.37Zm12 2.8-5.4 4.08a1 1 0 0 1-1.2 0L6 10.17v7.08c0 .41.34.75.75.75h10.5c.41 0 .75-.34.75-.75v-7.08Z"/>
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.75a5 5 0 0 0-5 5v2.25H6.75A2.75 2.75 0 0 0 4 11.75v7.5A2.75 2.75 0 0 0 6.75 22h10.5A2.75 2.75 0 0 0 20 19.25v-7.5A2.75 2.75 0 0 0 17.25 9H17V6.75a5 5 0 0 0-5-5Zm-3 7.25V6.75a3 3 0 1 1 6 0V9H9Zm3 3a1.75 1.75 0 0 1 .9 3.25v1.5a.9.9 0 1 1-1.8 0v-1.5A1.75 1.75 0 0 1 12 12Z"/>
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.75a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5Zm0 11.5c-4.02 0-7.25 2.41-7.25 5.39 0 .5.41.86.9.86h12.7c.49 0 .9-.36.9-.86 0-2.98-3.23-5.39-7.25-5.39Z"/>
    </svg>
  )
}

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5c5.2 0 9.27 4.4 10.5 6.03a1.6 1.6 0 0 1 0 1.94C21.27 14.6 17.2 19 12 19S2.73 14.6 1.5 12.97a1.6 1.6 0 0 1 0-1.94C2.73 9.4 6.8 5 12 5Zm0 2C8 7 4.6 10.14 3.37 12 4.6 13.86 8 17 12 17s7.4-3.14 8.63-5C19.4 10.14 16 7 12 7Zm0 1.75a3.25 3.25 0 1 1 0 6.5 3.25 3.25 0 0 1 0-6.5Z"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.7 3.99a1 1 0 1 0-1.4 1.42l2.36 2.34A14.86 14.86 0 0 0 1.5 11.03a1.6 1.6 0 0 0 0 1.94C2.73 14.6 6.8 19 12 19c2.03 0 3.86-.67 5.42-1.61l3.88 3.86a1 1 0 1 0 1.4-1.42L2.7 3.99Zm8.54 8.53 2.28 2.27A3.24 3.24 0 0 1 11.24 12.52ZM12 7c4 0 7.4 3.14 8.63 5-.49.74-1.32 1.73-2.4 2.66l-1.47-1.46a5.25 5.25 0 0 0-6.97-6.95L8.22 4.68A9.27 9.27 0 0 1 12 7Z"/>
    </svg>
  )
}

function TextField({ icon, endAdornment, type = 'text', ...props }) {
  return (
    <label className="field">
      <span className="field-icon">{icon}</span>
      <input type={type} {...props} />
      {endAdornment ? <span className="field-end">{endAdornment}</span> : null}
    </label>
  )
}

export default function AuthForm({ mode = 'login' }) {
  const isLogin = mode === 'login'
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: true
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin
        ? {
            email: form.email,
            password: form.password
          }
        : {
            name: form.name,
            email: form.email,
            password: form.password
          }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Request failed')
      }

      setMessage(data.message || (isLogin ? 'Login successful.' : 'Account created.'))

      if (!isLogin) {
        setForm({
          name: '',
          email: '',
          password: '',
          rememberMe: true
        })
      }
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-wrap">
      <h1 className="sr-only">{isLogin ? 'Login' : 'Create account'}</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <TextField
            icon={<UserIcon />}
            name="name"
            type="text"
            placeholder="Enter full name"
            autoComplete="name"
            value={form.name}
            onChange={updateField}
            required
          />
        )}

        <TextField
          icon={<MailIcon />}
          name="email"
          type="email"
          placeholder="Enter email"
          autoComplete="email"
          value={form.email}
          onChange={updateField}
          required
        />

        <TextField
          icon={<LockIcon />}
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder={isLogin ? 'Enter password' : 'Create password'}
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          value={form.password}
          onChange={updateField}
          required
          minLength={8}
          endAdornment={
            <button
              type="button"
              className="icon-button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((current) => !current)}
            >
              <EyeIcon open={showPassword} />
            </button>
          }
        />

        {isLogin ? (
          <div className="form-meta">
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={updateField}
              />
              <span>Remember me</span>
            </label>
          </div>
        ) : (
          <p className="form-hint">Use at least 8 characters for your password.</p>
        )}

        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
        </button>
      </form>

      {(message || error) && (
        <div className={`status-message ${error ? 'error' : 'success'}`} role="status">
          {error || message}
        </div>
      )}

      {isLogin ? (
        <div className="auth-links">
          <a href="#" onClick={(e) => e.preventDefault()}>
            Forgotten Password
          </a>
          <span className="divider" aria-hidden="true" />
          <Link to="/register">Create Account Now</Link>
        </div>
      ) : (
        <div className="auth-links single">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      )}
    </div>
  )
}
