import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../db.js'
import { validateLoginInput, validateRegisterInput } from '../middleware/validateAuthInput.js'

const router = express.Router()

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

router.post('/register', validateRegisterInput, async (req, res) => {
  const { name, email, password } = req.body

  try {
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [email.toLowerCase()]
    )

    if (existingUser.rowCount > 0) {
      return res.status(409).json({ message: 'Email is already registered.' })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const result = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name.trim(), email.toLowerCase(), passwordHash]
    )

    return res.status(201).json({
      message: 'Registration successful.',
      user: result.rows[0]
    })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({ message: 'Server error during registration.' })
  }
})

router.post('/login', validateLoginInput, async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await query(
      `SELECT id, name, email, password_hash
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email.toLowerCase()]
    )

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const user = result.rows[0]
    const passwordMatches = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = signToken(user)

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Server error during login.' })
  }
})

export default router
