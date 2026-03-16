// Security Enhancement Test
// This demonstrates the password hashing and HTML escaping features

import { hashPassword, escapeHtml, isValidEmail, isValidPassword } from './security';

// Test password hashing
const testPassword = 'MySecurePass123!';
const hashedPassword = hashPassword(testPassword);
console.log('Original password:', testPassword);
console.log('Hashed password:', hashedPassword);

// Test HTML escaping
const maliciousInput = '<script>alert("XSS Attack!")</script><img src=x onerror=alert(1)>';
const safeOutput = escapeHtml(maliciousInput);
console.log('Malicious input:', maliciousInput);
console.log('Safe output:', safeOutput);

// Test validation
console.log('Valid email:', isValidEmail('user@example.com'));
console.log('Invalid email:', isValidEmail('not-an-email'));
console.log('Valid password:', isValidPassword('SecurePass123!'));
console.log('Invalid password:', isValidPassword('weak'));

export { hashPassword, escapeHtml, isValidEmail, isValidPassword };