# ShopCraft - API 설계

## 공통 사항

### Base URL
```
https://shopcraft.vercel.app/api
```

### 공통 헤더
| 헤더 | 값 | 설명 |
|------|------|------|
| `Content-Type` | `application/json` | 요청/응답 형식 |
| `Authorization` | `Bearer {token}` | 인증 토큰 (Supabase JWT) |

### 공통 에러 응답 형식
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "사람이 읽을 수 있는 에러 메시지"
  }
}
```

### 공통 에러 코드
| HTTP 상태 | 코드 | 설명 |
|-----------|------|------|
| 400 | `BAD_REQUEST` | 잘못된 요청 (유효성 검사 실패) |
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 권한 없음 |
| 404 | `NOT_FOUND` | 리소스 없음 |
| 409 | `CONFLICT` | 리소스 충돌 (중복) |
| 422 | `VALIDATION_ERROR` | 입력값 유효성 오류 |
| 429 | `RATE_LIMITED` | 요청 횟수 초과 |
| 500 | `INTERNAL_ERROR` | 서버 내부 오류 |

### 페이지네이션 공통 형식
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 1. 인증 API

### 1.1 POST /api/auth/signup — 회원가입

**인증 필요:** 아니오

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "MyPassword123!",
  "nickname": "홍길동"
}
```

| 필드 | 타입 | 필수 | 유효성 검사 |
|------|------|------|-------------|
| `email` | string | O | 이메일 형식, 최대 255자 |
| `password` | string | O | 최소 8자, 영문+숫자+특수문자 포함 |
| `nickname` | string | O | 2~50자 |

**Response (201 Created):**
```json
{
  "message": "회원가입이 완료되었습니다. 이메일 인증을 진행해주세요.",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "nickname": "홍길동"
  }
}
```

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 400 | `BAD_REQUEST` | 필수 필드 누락 |
| 409 | `CONFLICT` | 이미 등록된 이메일 |
| 422 | `VALIDATION_ERROR` | 비밀번호 규칙 미충족 |

---

### 1.2 POST /api/auth/login — 로그인

**인증 필요:** 아니오

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "MyPassword123!"
}
```

| 필드 | 타입 | 필수 | 유효성 검사 |
|------|------|------|-------------|
| `email` | string | O | 이메일 형식 |
| `password` | string | O | 비어있지 않음 |

**Response (200 OK):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "nickname": "홍길동",
    "avatarUrl": null,
    "isSeller": false
  },
  "session": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "v1.MjQ5OWZiYTkt...",
    "expiresAt": 1711612800
  }
}
```

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 400 | `BAD_REQUEST` | 필수 필드 누락 |
| 401 | `UNAUTHORIZED` | 이메일 또는 비밀번호 불일치 |
| 403 | `FORBIDDEN` | 이메일 인증 미완료 |

---

### 1.3 POST /api/auth/logout — 로그아웃

**인증 필요:** 예

**Request Body:** 없음

**Response (200 OK):**
```json
{
  "message": "로그아웃되었습니다."
}
```

---

### 1.4 GET /api/auth/callback — OAuth 콜백

**인증 필요:** 아니오

> Supabase Auth가 OAuth 인증 후 리다이렉트하는 엔드포인트.
> `code`를 세션 토큰으로 교환하고, 신규 사용자면 profiles 레코드를 자동 생성.

**Query Parameters:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `code` | string | O | OAuth 인증 코드 |

**Response:** `/` (메인 페이지)로 리다이렉트

---

### 1.5 GET /api/auth/me — 현재 사용자 정보

**인증 필요:** 예

**Request Body:** 없음

**Response (200 OK):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "nickname": "홍길동",
    "avatarUrl": "https://xxx.supabase.co/storage/v1/...",
    "bio": "안녕하세요!",
    "isSeller": true,
    "sellerName": "길동의 디자인샵",
    "sellerDescription": "고품질 디자인 에셋을 판매합니다.",
    "createdAt": "2026-01-15T09:30:00Z"
  }
}
```

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 401 | `UNAUTHORIZED` | 인증 토큰 없음/만료 |

---

### 1.6 POST /api/auth/reset-password — 비밀번호 재설정 요청

**인증 필요:** 아니오

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "비밀번호 재설정 링크가 이메일로 발송되었습니다."
}
```

> 보안상 존재하지 않는 이메일이어도 동일한 응답을 반환합니다.

---

## 2. 프로필 API

### 2.1 GET /api/profiles/:id — 프로필 조회

**인증 필요:** 아니오

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | UUID | 사용자 ID |

**Response (200 OK):**
```json
{
  "profile": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nickname": "홍길동",
    "avatarUrl": "https://xxx.supabase.co/storage/v1/...",
    "bio": "안녕하세요!",
    "isSeller": true,
    "sellerName": "길동의 디자인샵",
    "sellerDescription": "고품질 디자인 에셋을 판매합니다.",
    "createdAt": "2026-01-15T09:30:00Z",
    "productCount": 12
  }
}
```

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 404 | `NOT_FOUND` | 존재하지 않는 사용자 |

---

### 2.2 PUT /api/profiles/:id — 프로필 수정

**인증 필요:** 예 (본인만)

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | UUID | 사용자 ID |

**Request Body:**
```json
{
  "nickname": "새닉네임",
  "bio": "새로운 자기소개",
  "isSeller": true,
  "sellerName": "나의 디자인샵",
  "sellerDescription": "고품질 디자인 에셋을 판매합니다."
}
```

| 필드 | 타입 | 필수 | 유효성 검사 |
|------|------|------|-------------|
| `nickname` | string | X | 2~50자 |
| `bio` | string | X | 최대 500자 |
| `isSeller` | boolean | X | - |
| `sellerName` | string | X | `isSeller=true`일 때 필수, 2~100자 |
| `sellerDescription` | string | X | 최대 1000자 |

**Response (200 OK):**
```json
{
  "profile": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nickname": "새닉네임",
    "avatarUrl": "https://xxx.supabase.co/storage/v1/...",
    "bio": "새로운 자기소개",
    "isSeller": true,
    "sellerName": "나의 디자인샵",
    "sellerDescription": "고품질 디자인 에셋을 판매합니다.",
    "updatedAt": "2026-03-28T10:30:00Z"
  }
}
```

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 다른 사용자의 프로필 수정 시도 |
| 404 | `NOT_FOUND` | 존재하지 않는 사용자 |
| 422 | `VALIDATION_ERROR` | 유효성 검사 실패 |

---

## 3. 상품 API

### 3.1 GET /api/products — 상품 목록

**인증 필요:** 아니오

**Query Parameters:**
| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | number | `1` | 페이지 번호 |
| `limit` | number | `20` | 페이지당 항목 수 (최대 50) |
| `category` | string | - | 카테고리 슬러그 (예: `templates`) |
| `search` | string | - | 검색어 (제목, 설명) |
| `sort` | string | `newest` | 정렬: `newest`, `popular`, `price_asc`, `price_desc`, `rating` |
| `minPrice` | number | - | 최소 가격 |
| `maxPrice` | number | - | 최대 가격 |
| `sellerId` | UUID | - | 특정 판매자 상품만 |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "title": "미니멀 노션 템플릿 세트",
      "description": "프로젝트 관리, 일정 관리, 메모 등 10가지 노션 템플릿...",
      "price": 5900,
      "status": "active",
      "salesCount": 42,
      "averageRating": 4.7,
      "reviewCount": 15,
      "thumbnailUrl": "https://xxx.supabase.co/storage/v1/...",
      "category": {
        "id": "cat-uuid",
        "name": "템플릿",
        "slug": "templates"
      },
      "seller": {
        "id": "seller-uuid",
        "nickname": "홍길동",
        "sellerName": "길동의 디자인샵"
      },
      "createdAt": "2026-03-01T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

> `status = 'active'`이고 `deleted_at IS NULL`인 상품만 반환.
> `thumbnailUrl`은 첫 번째 product_image의 URL.

---

### 3.2 GET /api/products/:id — 상품 상세

**인증 필요:** 아니오

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | UUID | 상품 ID |

**Response (200 OK):**
```json
{
  "product": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "미니멀 노션 템플릿 세트",
    "description": "프로젝트 관리, 일정 관리, 메모 등 10가지 노션 템플릿 모음입니다.\n\n포함 항목:\n- 프로젝트 트래커\n- 주간 플래너\n- 독서 기록\n...",
    "price": 5900,
    "status": "active",
    "salesCount": 42,
    "averageRating": 4.7,
    "reviewCount": 15,
    "images": [
      {
        "id": "img-uuid-1",
        "url": "https://xxx.supabase.co/storage/v1/...",
        "sortOrder": 0
      },
      {
        "id": "img-uuid-2",
        "url": "https://xxx.supabase.co/storage/v1/...",
        "sortOrder": 1
      }
    ],
    "files": [
      {
        "id": "file-uuid-1",
        "fileName": "notion-templates-v2.zip",
        "fileSize": 2048576,
        "mimeType": "application/zip"
      }
    ],
    "category": {
      "id": "cat-uuid",
      "name": "템플릿",
      "slug": "templates"
    },
    "seller": {
      "id": "seller-uuid",
      "nickname": "홍길동",
      "avatarUrl": "https://xxx.supabase.co/storage/v1/...",
      "sellerName": "길동의 디자인샵",
      "sellerDescription": "고품질 디자인 에셋을 판매합니다."
    },
    "createdAt": "2026-03-01T09:00:00Z",
    "updatedAt": "2026-03-15T14:00:00Z"
  }
}
```

> `files` 배열에는 파일 메타데이터만 포함 (다운로드 URL은 결제 후에만 제공).

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 404 | `NOT_FOUND` | 존재하지 않거나 삭제된 상품 |

---

### 3.3 POST /api/products — 상품 등록

**인증 필요:** 예 (판매자만)

**Request Body:**
```json
{
  "title": "미니멀 노션 템플릿 세트",
  "description": "프로젝트 관리, 일정 관리, 메모 등 10가지 노션 템플릿 모음입니다.",
  "price": 5900,
  "categoryId": "cat-uuid",
  "status": "draft"
}
```

| 필드 | 타입 | 필수 | 유효성 검사 |
|------|------|------|-------------|
| `title` | string | O | 2~200자 |
| `description` | string | O | 최소 10자 |
| `price` | number | O | 100 이상 정수 (원 단위) |
| `categoryId` | UUID | O | 유효한 카테고리 ID |
| `status` | string | X | `draft` (기본값) 또는 `active` |

**Response (201 Created):**
```json
{
  "product": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "미니멀 노션 템플릿 세트",
    "description": "프로젝트 관리, 일정 관리, 메모 등...",
    "price": 5900,
    "status": "draft",
    "categoryId": "cat-uuid",
    "sellerId": "seller-uuid",
    "createdAt": "2026-03-28T10:00:00Z"
  }
}
```

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 판매자가 아닌 사용자 |
| 422 | `VALIDATION_ERROR` | 유효성 검사 실패 |

---

### 3.4 PUT /api/products/:id — 상품 수정

**인증 필요:** 예 (상품 소유자만)

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | UUID | 상품 ID |

**Request Body:**
```json
{
  "title": "수정된 제목",
  "description": "수정된 설명",
  "price": 7900,
  "categoryId": "new-cat-uuid",
  "status": "active"
}
```

| 필드 | 타입 | 필수 | 유효성 검사 |
|------|------|------|-------------|
| `title` | string | X | 2~200자 |
| `description` | string | X | 최소 10자 |
| `price` | number | X | 100 이상 정수 |
| `categoryId` | UUID | X | 유효한 카테고리 ID |
| `status` | string | X | `draft`, `active`, `inactive` |

**Response (200 OK):**
```json
{
  "product": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "수정된 제목",
    "description": "수정된 설명",
    "price": 7900,
    "status": "active",
    "updatedAt": "2026-03-28T11:00:00Z"
  }
}
```

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 본인 상품이 아님 |
| 404 | `NOT_FOUND` | 존재하지 않는 상품 |
| 422 | `VALIDATION_ERROR` | 유효성 검사 실패 |

---

### 3.5 DELETE /api/products/:id — 상품 삭제 (소프트 삭제)

**인증 필요:** 예 (상품 소유자만)

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | UUID | 상품 ID |

**Request Body:** 없음

**Response (200 OK):**
```json
{
  "message": "상품이 삭제되었습니다."
}
```

> 실제로는 `deleted_at`에 현재 시각을 기록하는 소프트 삭제. 이미 구매된 주문의 다운로드는 유지.

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 본인 상품이 아님 |
| 404 | `NOT_FOUND` | 존재하지 않거나 이미 삭제된 상품 |

---

### 3.6 POST /api/products/:id/images — 상품 이미지 업로드

**인증 필요:** 예 (상품 소유자만)

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | UUID | 상품 ID |

**Request:** `multipart/form-data`

| 필드 | 타입 | 필수 | 유효성 검사 |
|------|------|------|-------------|
| `image` | File | O | JPEG/PNG/WebP, 최대 5MB |
| `sortOrder` | number | X | 정렬 순서 (기본값 0) |

**Response (201 Created):**
```json
{
  "image": {
    "id": "img-uuid",
    "url": "https://xxx.supabase.co/storage/v1/object/public/product-images/...",
    "sortOrder": 0,
    "createdAt": "2026-03-28T10:00:00Z"
  }
}
```

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 400 | `BAD_REQUEST` | 지원하지 않는 파일 형식 또는 크기 초과 |
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 본인 상품이 아님 |
| 409 | `CONFLICT` | 이미지 5개 초과 |

---

### 3.7 POST /api/products/:id/files — 상품 파일 업로드

**인증 필요:** 예 (상품 소유자만)

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | UUID | 상품 ID |

**Request:** `multipart/form-data`

| 필드 | 타입 | 필수 | 유효성 검사 |
|------|------|------|-------------|
| `file` | File | O | 최대 50MB |

**Response (201 Created):**
```json
{
  "file": {
    "id": "file-uuid",
    "fileName": "notion-templates-v2.zip",
    "fileSize": 2048576,
    "mimeType": "application/zip",
    "createdAt": "2026-03-28T10:00:00Z"
  }
}
```

> 파일은 Supabase Storage의 private 버킷에 저장. 직접 접근 불가.

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 400 | `BAD_REQUEST` | 파일 크기 초과 (50MB) |
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 본인 상품이 아님 |

---

## 4. 카테고리 API

### 4.1 GET /api/categories — 카테고리 목록

**인증 필요:** 아니오

**Request Body:** 없음

**Response (200 OK):**
```json
{
  "categories": [
    {
      "id": "cat-uuid-1",
      "name": "템플릿",
      "slug": "templates",
      "description": "노션, 엑셀, 파워포인트 등 다양한 템플릿",
      "productCount": 45
    },
    {
      "id": "cat-uuid-2",
      "name": "아이콘",
      "slug": "icons",
      "description": "웹, 앱, 프레젠테이션용 아이콘 세트",
      "productCount": 23
    }
  ]
}
```

> `productCount`는 해당 카테고리의 active 상품 수.

---

## 5. 주문/결제 API

### 5.1 POST /api/orders — 주문 생성

**인증 필요:** 예

**Request Body:**
```json
{
  "productIds": [
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  ]
}
```

| 필드 | 타입 | 필수 | 유효성 검사 |
|------|------|------|-------------|
| `productIds` | UUID[] | O | 1개 이상, 유효한 active 상품 ID |

**Response (201 Created):**
```json
{
  "order": {
    "id": "order-uuid",
    "orderNumber": "SC-20260328-0001",
    "totalAmount": 5900,
    "status": "pending",
    "items": [
      {
        "id": "item-uuid",
        "productId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "title": "미니멀 노션 템플릿 세트",
        "price": 5900
      }
    ],
    "createdAt": "2026-03-28T10:00:00Z"
  }
}
```

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 400 | `BAD_REQUEST` | 빈 상품 목록 |
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 404 | `NOT_FOUND` | 존재하지 않거나 비활성 상품 |
| 409 | `CONFLICT` | 이미 구매한 상품 포함 |

---

### 5.2 GET /api/orders — 내 주문 목록

**인증 필요:** 예

**Query Parameters:**
| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | number | `1` | 페이지 번호 |
| `limit` | number | `20` | 페이지당 항목 수 |
| `status` | string | - | 주문 상태 필터 |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "order-uuid",
      "orderNumber": "SC-20260328-0001",
      "totalAmount": 5900,
      "status": "paid",
      "itemCount": 1,
      "items": [
        {
          "id": "item-uuid",
          "product": {
            "id": "product-uuid",
            "title": "미니멀 노션 템플릿 세트",
            "thumbnailUrl": "https://..."
          },
          "price": 5900
        }
      ],
      "createdAt": "2026-03-28T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### 5.3 GET /api/orders/:id — 주문 상세

**인증 필요:** 예 (본인 주문만)

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | UUID | 주문 ID |

**Response (200 OK):**
```json
{
  "order": {
    "id": "order-uuid",
    "orderNumber": "SC-20260328-0001",
    "totalAmount": 5900,
    "status": "paid",
    "items": [
      {
        "id": "item-uuid",
        "product": {
          "id": "product-uuid",
          "title": "미니멀 노션 템플릿 세트",
          "thumbnailUrl": "https://...",
          "seller": {
            "id": "seller-uuid",
            "sellerName": "길동의 디자인샵"
          }
        },
        "price": 5900,
        "downloadable": true,
        "downloadCount": 2
      }
    ],
    "payment": {
      "id": "payment-uuid",
      "amount": 5900,
      "currency": "krw",
      "status": "succeeded",
      "createdAt": "2026-03-28T10:01:00Z"
    },
    "createdAt": "2026-03-28T10:00:00Z"
  }
}
```

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 본인 주문이 아님 |
| 404 | `NOT_FOUND` | 존재하지 않는 주문 |

---

### 5.4 POST /api/stripe/checkout — Stripe 결제 세션 생성

**인증 필요:** 예

**Request Body:**
```json
{
  "orderId": "order-uuid"
}
```

| 필드 | 타입 | 필수 | 유효성 검사 |
|------|------|------|-------------|
| `orderId` | UUID | O | 본인의 pending 상태 주문 |

**Response (200 OK):**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_..."
}
```

> 클라이언트는 `checkoutUrl`로 리다이렉트하여 Stripe 호스팅 결제 페이지에서 결제 진행.

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 400 | `BAD_REQUEST` | pending 상태가 아닌 주문 |
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 본인 주문이 아님 |
| 404 | `NOT_FOUND` | 존재하지 않는 주문 |

---

### 5.5 POST /api/stripe/webhook — Stripe 웹훅 처리

**인증 필요:** 아니오 (Stripe 서명 검증)

> Stripe가 결제 이벤트 발생 시 호출하는 엔드포인트. `Stripe-Signature` 헤더로 요청 검증.

**처리하는 이벤트:**

| 이벤트 | 처리 내용 |
|--------|-----------|
| `checkout.session.completed` | 주문 상태 → `paid`, 결제 상태 → `succeeded`, 상품 `sales_count` 증가 |
| `checkout.session.expired` | 주문 상태 → `failed`, 결제 상태 → `failed` |
| `charge.refunded` | 주문 상태 → `refunded`, 결제 상태 → `refunded` |

**Request Headers:**
| 헤더 | 설명 |
|------|------|
| `Stripe-Signature` | Stripe 웹훅 서명 |

**Request Body:** Stripe Event 객체 (raw body)

**Response (200 OK):**
```json
{
  "received": true
}
```

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 400 | `BAD_REQUEST` | 서명 검증 실패 |

---

## 6. 다운로드 API

### 6.1 GET /api/downloads/:orderItemId — 파일 다운로드

**인증 필요:** 예 (주문 소유자만)

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `orderItemId` | UUID | 주문 항목 ID |

**Response (200 OK):**
```json
{
  "downloadUrl": "https://xxx.supabase.co/storage/v1/object/sign/...",
  "fileName": "notion-templates-v2.zip",
  "fileSize": 2048576,
  "expiresAt": "2026-03-28T11:00:00Z"
}
```

> `downloadUrl`은 60분간 유효한 서명된 URL.
> 다운로드 기록이 `downloads` 테이블에 저장됨.

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 본인 주문 항목이 아님 |
| 404 | `NOT_FOUND` | 존재하지 않는 주문 항목 |
| 403 | `FORBIDDEN` | 결제 미완료 주문 |

---

## 7. 리뷰 API

### 7.1 GET /api/products/:id/reviews — 리뷰 목록

**인증 필요:** 아니오

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | UUID | 상품 ID |

**Query Parameters:**
| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | number | `1` | 페이지 번호 |
| `limit` | number | `10` | 페이지당 항목 수 |
| `sort` | string | `newest` | 정렬: `newest`, `oldest`, `rating_high`, `rating_low` |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "review-uuid",
      "rating": 5,
      "comment": "정말 유용한 템플릿입니다! 프로젝트 관리가 훨씬 편해졌어요.",
      "user": {
        "id": "user-uuid",
        "nickname": "김철수",
        "avatarUrl": "https://..."
      },
      "createdAt": "2026-03-20T15:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  },
  "summary": {
    "averageRating": 4.7,
    "totalReviews": 15,
    "distribution": {
      "5": 10,
      "4": 3,
      "3": 1,
      "2": 1,
      "1": 0
    }
  }
}
```

---

### 7.2 POST /api/products/:id/reviews — 리뷰 작성

**인증 필요:** 예 (해당 상품 구매자만)

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | UUID | 상품 ID |

**Request Body:**
```json
{
  "rating": 5,
  "comment": "정말 유용한 템플릿입니다!"
}
```

| 필드 | 타입 | 필수 | 유효성 검사 |
|------|------|------|-------------|
| `rating` | number | O | 1~5 정수 |
| `comment` | string | X | 최대 1000자 |

**Response (201 Created):**
```json
{
  "review": {
    "id": "review-uuid",
    "productId": "product-uuid",
    "rating": 5,
    "comment": "정말 유용한 템플릿입니다!",
    "createdAt": "2026-03-28T10:00:00Z"
  }
}
```

> 리뷰 작성 시 `products.average_rating`과 `products.review_count`가 자동 업데이트.

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 해당 상품 미구매 |
| 409 | `CONFLICT` | 이미 리뷰 작성함 |
| 422 | `VALIDATION_ERROR` | 유효성 검사 실패 |

---

### 7.3 PUT /api/reviews/:id — 리뷰 수정

**인증 필요:** 예 (리뷰 작성자만)

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | UUID | 리뷰 ID |

**Request Body:**
```json
{
  "rating": 4,
  "comment": "수정된 리뷰 내용"
}
```

| 필드 | 타입 | 필수 | 유효성 검사 |
|------|------|------|-------------|
| `rating` | number | X | 1~5 정수 |
| `comment` | string | X | 최대 1000자 |

**Response (200 OK):**
```json
{
  "review": {
    "id": "review-uuid",
    "rating": 4,
    "comment": "수정된 리뷰 내용",
    "updatedAt": "2026-03-28T11:00:00Z"
  }
}
```

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 본인 리뷰가 아님 |
| 404 | `NOT_FOUND` | 존재하지 않는 리뷰 |

---

### 7.4 DELETE /api/reviews/:id — 리뷰 삭제

**인증 필요:** 예 (리뷰 작성자만)

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | UUID | 리뷰 ID |

**Request Body:** 없음

**Response (200 OK):**
```json
{
  "message": "리뷰가 삭제되었습니다."
}
```

> 삭제 시 `products.average_rating`과 `products.review_count` 재계산.

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 본인 리뷰가 아님 |
| 404 | `NOT_FOUND` | 존재하지 않는 리뷰 |

---

## 8. 판매자 대시보드 API

### 8.1 GET /api/dashboard/stats — 매출 통계

**인증 필요:** 예 (판매자만)

**Query Parameters:**
| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `period` | string | `30d` | 기간: `7d`, `30d`, `90d`, `all` |

**Response (200 OK):**
```json
{
  "stats": {
    "totalRevenue": 1250000,
    "totalOrders": 85,
    "totalProducts": 12,
    "averageOrderAmount": 14706,
    "periodRevenue": 350000,
    "periodOrders": 24,
    "revenueByDate": [
      { "date": "2026-03-01", "revenue": 15000, "orders": 2 },
      { "date": "2026-03-02", "revenue": 23000, "orders": 3 },
      { "date": "2026-03-03", "revenue": 0, "orders": 0 }
    ],
    "topProducts": [
      {
        "id": "product-uuid",
        "title": "미니멀 노션 템플릿 세트",
        "salesCount": 42,
        "revenue": 247800
      }
    ]
  }
}
```

**에러 응답:**
| 상태 | 코드 | 상황 |
|------|------|------|
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 판매자가 아님 |

---

### 8.2 GET /api/dashboard/orders — 판매 주문 목록

**인증 필요:** 예 (판매자만)

**Query Parameters:**
| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | number | `1` | 페이지 번호 |
| `limit` | number | `20` | 페이지당 항목 수 |
| `status` | string | - | 주문 상태 필터 |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "order-uuid",
      "orderNumber": "SC-20260328-0001",
      "buyer": {
        "id": "buyer-uuid",
        "nickname": "김철수"
      },
      "items": [
        {
          "productId": "product-uuid",
          "title": "미니멀 노션 템플릿 세트",
          "price": 5900
        }
      ],
      "totalAmount": 5900,
      "status": "paid",
      "createdAt": "2026-03-28T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 85,
    "totalPages": 5
  }
}
```

> 본인 상품이 포함된 주문만 반환. 다른 판매자의 상품 정보는 제외.

---

### 8.3 GET /api/dashboard/products — 내 상품 관리

**인증 필요:** 예 (판매자만)

**Query Parameters:**
| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | number | `1` | 페이지 번호 |
| `limit` | number | `20` | 페이지당 항목 수 |
| `status` | string | - | 상태 필터: `draft`, `active`, `inactive` |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "product-uuid",
      "title": "미니멀 노션 템플릿 세트",
      "price": 5900,
      "status": "active",
      "salesCount": 42,
      "averageRating": 4.7,
      "reviewCount": 15,
      "thumbnailUrl": "https://...",
      "createdAt": "2026-03-01T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

> 소프트 삭제된 상품도 표시 (`deleted_at IS NOT NULL`인 경우 별도 표시).
