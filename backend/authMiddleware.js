import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'DEV_ONLY_CHANGE_THIS_IN_PROD';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'] || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload: { id, email, role, iat, exp }
    req.user = payload;
    next();
  } catch (err) {
    console.error('❌ Error verificando token JWT:', err.message);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};