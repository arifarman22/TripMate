# Security Best Practices

## Password Security
- Minimum 6 characters (increase to 8+ in production)
- Bcrypt hashing with salt rounds = 10
- Never log or expose passwords

## Token Security
- Store JWT_SECRET in environment variables
- Use strong, random secrets (32+ characters)
- Short access token expiry (15 minutes)
- Longer refresh token expiry (7 days)

## API Security
- Always use HTTPS in production
- Implement rate limiting
- Validate all inputs
- Sanitize user data
- Use CORS properly

## Database Security
- Use parameterized queries (Prisma handles this)
- Principle of least privilege for DB user
- Regular backups
- Encrypt sensitive data at rest

## Monitoring
- Log authentication failures
- Monitor for suspicious patterns
- Alert on multiple failed login attempts
- Track token usage
