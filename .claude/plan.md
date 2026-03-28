# ShopCraft 프로젝트 초기 세팅 계획

## 기술 스택
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Supabase Auth (Google OAuth + Email)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Payments**: Stripe Checkout
- **Deployment**: Vercel

## Phase 1: 프로젝트 초기 세팅 (지금)
1. Next.js 프로젝트 생성 (TypeScript, Tailwind, App Router)
2. 기본 폴더 구조 설정
3. ESLint, Prettier 설정
4. 환경변수 템플릿 (.env.example) 생성
5. README.md 작성
6. 첫 커밋 & 푸시

## Phase 2: 인증 (회원가입/로그인)
- Supabase Auth 연동
- Google OAuth + 이메일/비밀번호 로그인
- 로그인/회원가입 UI
- 보호된 라우트 (미들웨어)

## Phase 3: 데이터베이스 & 상품
- Prisma 스키마 설계 (User, Product, Order)
- 상품 CRUD API
- 상품 목록/상세 페이지
- 이미지 업로드 (Supabase Storage)

## Phase 4: 결제
- Stripe Checkout 연동
- 결제 성공/실패 처리
- Webhook으로 주문 상태 업데이트
- 디지털 상품 다운로드 링크 제공

## Phase 5: 대시보드
- 판매자 대시보드 (매출, 주문 현황)
- 구매 내역 페이지

## 폴더 구조 (Phase 1)
```
shopcraft/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── products/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── components/
│   │   └── ui/
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── stripe.ts
│   │   └── prisma.ts
│   └── types/
│       └── index.ts
├── prisma/
│   └── schema.prisma
├── public/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
