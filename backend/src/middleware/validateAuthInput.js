export function validateRegisterInput(req, res, next) {
  const { name, email, password } = req.body

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters.' })
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' })
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' })
  }

  next()
}

export function validateLoginInput(req, res, next) {
  const { email, password } = req.body

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' })
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required.' })
  }

  next()
}
