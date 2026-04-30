/**
 * Usage: node scripts/hash-admin-password.cjs "yourStrongPassword"
 * Paste output into ADMIN_PASSWORD_HASH (Vercel / .env.local).
 */
const bcrypt = require("bcryptjs");

const plain = process.argv[2];
if (!plain || plain.length < 8) {
  console.error('Usage: node scripts/hash-admin-password.cjs "<password-at-least-8-chars>"');
  process.exit(1);
}

console.log(bcrypt.hashSync(plain, 12));
