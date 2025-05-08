// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // src 폴더 내의 모든 파일 포함
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      screens: {
        // 기본 설정 오버라이드
        sm: '640px',
        md: '768px',
        // lg 브레이크포인트를 1200px로 변경 (태블릿 디바이스가 모바일 레이아웃으로 보이도록)
        lg: '1200px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
