# ShopCraft - 보안 설계

## 1. 인증 (Authentication)

### 1.1 인증 방식

Supabase Auth를 사용한 JWT 기반 인증.

```
[클라이언트] → [Supabase Auth] → JWT 토큰 발급
[클라이언트] → Authorization: Bearer {JWT} → [API Route] → 토큰 검증
```

### 1.2 토큰 관리

| 항목 | 설정 |
|------|------|
| Access Token 유효기간 | 1시간 (3600초) |
| Refresh Token 유효기간 | 7일 |
| 토큰 저장 | HTTP-Only Secure Cookie (`sb-access-token`, `sb-refresh-token`) |
| 토큰 갱신 | Access Token 만료 시 Refresh Token으로 자동 갱신 |

### 1.3 비밀번호 정책

| 규칙 | 설명 |
|------|------|
| 최소 길이 | 8자 |
| 복잡도 | 영문 + 숫자 + 특수문자 각 1개 이상 |
| 해싱 | bcrypt (Supabase 기본) |
| 재설정 | 이메일 링크 방식, 링크 유효기간 1시간 |

### 1.4 OAuth 보안

| 항목 | 설정 |
|------|------|
| Provider | Google |
| PKCE | 활성화 (Authorization Code + PKCE 플로우) |
| Redirect URL | `https://shopcraft.vercel.app/api/auth/callback` |
| State 파라미터 | CSRF 방지용 자동 생성 |

---

## 2. 인가 (Authorization)

### 2.1 역할 기반 접근 제어

| 리소스 | 비회원 | 구매자 | 판매자 (본인) | 판매자 (타인) |
|--------|--------|--------|---------------|---------------|
| 상품 목록/상세 조회 | O | O | O | O |
| 상품 등록 | X | X | O | X |
| 상품 수정/삭제 | X | X | O | X |
| 상품 구매 | X | O | O (타인 상품) | O |
| 파일 다운로드 | X | O (구매한 것만) | O (구매한 것만) | O (구매한 것만) |
| 리뷰 작성 | X | O (구매한 것만) | O (구매한 것만) | O (구매한 것만) |
| 대시보드 | X | X | O | X |
| 프로필 수정 | X | O (본인) | O (본인) | X |

### 2.2 Supabase Row Level Security (RLS)

모든 테이블에 RLS를 활성화하여 DB 레벨에서 접근 제어.

**profiles 테이블:**
```sql
-- 누구나 프로필 조회 가능
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- 본인만 프로필 수정 가능
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

**products 테이블:**
```sql
-- active 상품은 누구나 조회 가능
CREATE POLICY "Active products are viewable by everyone"
ON products FOR SELECT
USING (status = 'active' AND deleted_at IS NULL);

-- 판매자만 상품 등록 가능
CREATE POLICY "Sellers can insert products"
ON products FOR INSERT
WITH CHECK (
  auth.uid() = seller_id
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_seller = true)
);

-- 본인 상품만 수정 가능
CREATE POLICY "Sellers can update own products"
ON products FOR UPDATE
USING (auth.uid() = seller_id);
```

**orders 테이블:**
```sql
-- 본인 주문만 조회 가능
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = buyer_id);

-- 인증된 사용자만 주문 생성 가능
CREATE POLICY "Authenticated users can create orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = buyer_id);
```

**downloads 테이블:**
```sql
-- 본인 다운로드 기록만 조회 가능
CREATE POLICY "Users can view own downloads"
ON downloads FOR SELECT
USING (auth.uid() = user_id);
```

**reviews 테이블:**
```sql
-- 누구나 리뷰 조회 가능
CREATE POLICY "Reviews are viewable by everyone"
ON reviews FOR SELECT
USING (true);

-- 인증된 사용자만 리뷰 작성 가능
CREATE POLICY "Authenticated users can create reviews"
ON reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 본인 리뷰만 수정/삭제 가능
CREATE POLICY "Users can update own reviews"
ON reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
ON reviews FOR DELETE
USING (auth.uid() = user_id);
```

---

## 3. API 보안

### 3.1 인증 미들웨어

모든 인증이 필요한 API Route에 공통 미들웨어 적용:

```
1. Authorization 헤더에서 Bearer 토큰 추출
2. Supabase에서 토큰 검증
3. 유효하지 않으면 401 반환
4. 유효하면 사용자 정보를 req에 주입
```

### 3.2 Rate Limiting

| 대상 | 제한 | 설명 |
|------|------|------|
| 인증 API (login, signup) | 5회/분 (IP 기준) | 무차별 대입 공격 방지 |
| 일반 API | 60회/분 (사용자 기준) | 남용 방지 |
| 파일 업로드 | 10회/분 (사용자 기준) | Storage 남용 방지 |

> Vercel Edge Middleware 또는 `upstash/ratelimit` 패키지 사용.

### 3.3 입력값 검증

| 계층 | 도구 | 검증 항목 |
|------|------|-----------|
| 클라이언트 | React Hook Form + Zod | 실시간 폼 유효성 검사 |
| 서버 (API Route) | Zod | Request Body/Params 스키마 검증 |
| 데이터베이스 | PostgreSQL 제약조건 | 타입, NOT NULL, CHECK, UNIQUE |

### 3.4 CORS 설정

```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

### 3.5 HTTP 보안 헤더

| 헤더 | 값 | 목적 |
|------|------|------|
| `X-Content-Type-Options` | `nosniff` | MIME 스니핑 방지 |
| `X-Frame-Options` | `DENY` | 클릭재킹 방지 |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | HTTPS 강제 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer 정보 제한 |
| `Content-Security-Policy` | 최소 필요 정책 | XSS 방지 |

---

## 4. 파일 업로드 보안

### 4.1 이미지 업로드

| 항목 | 제한 |
|------|------|
| 허용 형식 | JPEG, PNG, WebP |
| 최대 크기 | 5MB |
| 저장 위치 | Supabase Storage `product-images` 버킷 (public) |
| 파일명 | UUID 기반 랜덤 파일명으로 변환 |
| 검증 | MIME 타입 + 매직 바이트 검사 (Content-Type 헤더만 신뢰하지 않음) |

### 4.2 상품 파일 업로드

| 항목 | 제한 |
|------|------|
| 최대 크기 | 50MB |
| 저장 위치 | Supabase Storage `product-files` 버킷 (private) |
| 파일명 | UUID 기반 랜덤 파일명으로 변환 |
| 접근 방식 | 서명된 URL만 가능 (유효시간 60분) |
| 직접 접근 | 불가 (private 버킷) |

### 4.3 Storage 버킷 구성

| 버킷 | 접근 | 용도 |
|------|------|------|
| `avatars` | public | 프로필 이미지 |
| `product-images` | public | 상품 미리보기 이미지 |
| `product-files` | private | 판매용 디지털 파일 |

---

## 5. Stripe 결제 보안

### 5.1 Webhook 서명 검증

```
1. Stripe가 Webhook 요청 시 Stripe-Signature 헤더 포함
2. 서버에서 STRIPE_WEBHOOK_SECRET으로 서명 검증
3. 서명 불일치 시 400 반환, 처리 중단
```

### 5.2 결제 무결성

| 항목 | 방법 |
|------|------|
| 금액 검증 | Checkout 세션 생성 시 서버에서 금액 계산 (클라이언트 전달 금액 무시) |
| 멱등성 | `stripe_payment_intent_id`로 중복 처리 방지 |
| 통화 | 서버에서 'krw' 고정 (클라이언트 변조 방지) |

### 5.3 Stripe 키 관리

| 키 | 환경변수 | 용도 |
|----|----------|------|
| Publishable Key | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | 클라이언트 (공개 가능) |
| Secret Key | `STRIPE_SECRET_KEY` | 서버 전용 (절대 노출 금지) |
| Webhook Secret | `STRIPE_WEBHOOK_SECRET` | 서버 전용 (Webhook 검증) |

---

## 6. 환경변수 관리

### 6.1 환경변수 목록

| 변수명 | 용도 | 노출 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 클라이언트 (공개 가능) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | 클라이언트 (공개 가능, RLS로 보호) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 키 | 서버 전용 (RLS 우회 가능, 절대 노출 금지) |
| `DATABASE_URL` | DB 연결 (Connection Pooling) | 서버 전용 |
| `DIRECT_URL` | DB 직접 연결 (Migration용) | 서버 전용 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 공개 키 | 클라이언트 |
| `STRIPE_SECRET_KEY` | Stripe 시크릿 키 | 서버 전용 |
| `STRIPE_WEBHOOK_SECRET` | Stripe 웹훅 시크릿 | 서버 전용 |
| `NEXT_PUBLIC_APP_URL` | 앱 URL | 클라이언트 |

### 6.2 환경별 관리

| 환경 | 파일 | 설명 |
|------|------|------|
| 로컬 개발 | `.env.local` | 개발용 키, .gitignore에 포함 |
| 프로덕션 | Vercel 환경변수 | Vercel 대시보드에서 설정 |
| CI/CD | Vercel 환경변수 | 빌드 시 자동 주입 |

### 6.3 `.env.example` (커밋 가능)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database (Supabase)
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 7. 추가 보안 고려사항

### 7.1 XSS 방지
- React의 기본 이스케이핑 활용 (`dangerouslySetInnerHTML` 사용 금지)
- 사용자 입력 마크다운은 sanitize 라이브러리로 정화 후 렌더링

### 7.2 SQL Injection 방지
- Prisma ORM 사용 (파라미터 바인딩 자동 적용)
- Raw Query 사용 시 `Prisma.$queryRaw` 파라미터 바인딩 필수

### 7.3 CSRF 방지
- SameSite Cookie 설정 (Lax)
- Supabase Auth가 PKCE 플로우로 OAuth CSRF 방지

### 7.4 에러 메시지 보안
- 프로덕션 환경에서 스택 트레이스 노출 금지
- 일반적인 에러 메시지만 클라이언트에 반환
- 상세 에러 로그는 서버 로그에만 기록
