import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Configure DOMPurify for server-side usage
const window = new JSDOM('').window;
const DOMPurifyServer = DOMPurify(window as any);

// Sanitize HTML content to prevent XSS attacks
export const sanitizeHtml = (html: string): string => {
  return DOMPurifyServer.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
};

// Validate and sanitize user input
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  // Remove null bytes and other dangerous characters
  return input.replace(/\0/g, '').trim();
};