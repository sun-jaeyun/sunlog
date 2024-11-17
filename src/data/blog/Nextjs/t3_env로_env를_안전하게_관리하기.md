---
title: 'T3 Env로 env를 안전하게 관리하기'
description: 'T3 Env를 사용해 Next.js에서 env를 안전하게 관리하는 방법'
publishedAt: '2024-11-06'
category: 'Nextjs'
---

## T3 Env란?

빌드에 필요한 환경변수를 잊어버린 경우 디버깅을 도와주고 타입 안전한 환경변수 사용을 도와주는 간단한 라이브러리로 다음과 같은 이점을 얻을 수 있음

1. zod를 통한 검증으로 env의 타입 안전성을 보장하고 타입 추론을 도와준다.
2. 빌드 시 빌드에 필요한 env를 미리 검증하고 알려준다.

> 빌드 중에 환경 변수를 잊어버리는 것은 번거롭고 누락된 환경 변수로 인해 버그가 발생할 경우 디버깅하기 어려울 수 있습니다. 이 패키지는 앱의 환경 변수 유효성 검사를 정의하는 간단한 방법을 제공합니다.
>
> 스키마를 정의하고 환경 변수를 안전하게 사용하기만 하면 이 라이브러리가 모든 지루한 작업을 대신 수행합니다.
> \- [T3 Env 소개](https://env.t3.gg/docs/introduction)
>
> \> _Forgetting environment variables during build can be a hassle and difficult to debug if a bug is caused by a missing environment variable. This package provides a simple way to define environment variables validation for your app._
>
> _This library does all the grunt work for you, simply define your schema and use your environment variables safely._
> _\- [T3 Env Introduction](https://env.t3.gg/docs/introduction)_

---

## 시작
1. `@t3-oss/env-nextjs`, `zod` 설치
```sh
pnpm add @t3-oss/env-nextjs zod
```
> @t3-oss/env-nextjs는 esm 전용이며 5.0.0 이상의 타입스크립트 버전을 필요로 함

2. 스키마 작성
```typescript
// /env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  // 서버에서 사용하는 환경변수
  server: {
    DATABASE_URL: z.string().url(),
    OPEN_AI_API_KEY: z.string().min(1),
  },
  // 클라이언트에 노출할 환경변수
  client: {
    NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
  },
  // Next.js >= 13.4.4 - 런타임 클라이언트 환경변수만 파괴하면 된다
  experimental__runtimeEnv: {
    NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  }
  // Next.js < 13.4.4 - 런타임 환경변수를 지정해야 한다
  // runtimeEnv: {
  //   DATABASE_URL: process.env.DATABASE_URL,
  //   OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // },
});
```
---

## 빌드 시 검증(권장)

`next.config.js`에서 만들었던 env 파일을 불러와 빌드 시 검증에 사용할 수 있다. config 파일의 경우 `.js`, `.mjs`를 사용하기 때문에 js 파일에서 ts 파일을 불러오기 위한 처리가 필요하다. 공식문서에선 [unjs/jiti](https://github.com/unjs/jiti)를 사용해 불러오는 방식을 소개한다.


```javascript
import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));
 
// jiti를 사용해 ts 파일을 불러옴
jiti("./env");
 
/** @type {import('next').NextConfig} */
export default {
  /** ... */
};
```

> Next.js 15~ 부터 `next.config.ts`를 지원하기 때문에 따로 ts 파일을 불러오기 위한 작업을 하지 않아도 된다.

### 확인
- `.env`에서 _DATABASE_URL_ 주석처리하고 실행해보면 다음과 같은 에러와 함께 실행이 되지 않는다
- dev, build 동일
![Invalid environment variables: { DATABASE_URL: [ 'Required' ] }](https://res.cloudinary.com/dlctyrcqk/image/upload/v1731295842/Screenshot_2024-11-11_at_12.29.29_PM_x2es3o.png)
---

## 환경변수 사용

`env.ts`만 임포트해서 사용하면 된다

```typescript
import { env } from "@/env";
 
export const GET = async () => {
  const magic = await fetch("...", {
    headers: { Authorization: env.OPEN_AI_API_KEY },
  });
};
```
---

## 활용방법

### 타입 검증, 변환하기
환경변수는 기본적으로 모두 **string**이지만 [zod](https://www.npmjs.com/package/zod)를 사용해 미리 검증, 변환하여 사용할 수 있다.

```typescript
export const env = createEnv({
  server: {
    // boolean
    COERCED_BOOLEAN: z
      .string()
      // ex) false, 0일 경우 false, 그 외 true
      .transform((s) => s !== "false" && s !== "0"),
    // "true", "false"만 허용
    ONLY_BOOLEAN: z
      .string()
      .refine((s) => s === "true" || s === "false")
      // boolean으로 변환
      .transform((s) => s === "true"),
    // number
    SOME_NUMBER: z.coerce.number(),
    // ...
  },
});
```
예제 외에도 zod에서 사용 가능한 모든 옵션 사용 가능

### 스토리북에서 사용

스토리북은 자체 번들러를 사용하므로 StroybookConfig에서 별도로 추가해서 사용 가능
```typescript
// .storybook/main.ts
import { env as t3Env } from "~/env/client.mjs";
 
const config: StorybookConfig = {
  // ...
  env: (env) => ({
    ...env,
    ...t3Env,
  })
};
 
export default config;
```

### 그 외 옵션

그 외에도 다양한 옵션들이 있으며 [공식문서](https://env.t3.gg/docs/customization)에서 확인 가능
- 검증 건너뛰기
- error handler 재정의
- 서버 환경 정의
- 빈 문자열 -> `undefined` 변환
- env 확장하기