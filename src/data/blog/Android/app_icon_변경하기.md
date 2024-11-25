---
title: 'App Icon 변경하기'
description: 'Android 앱의 아이콘을 변경하는 방법'
publishedAt: '2024-10-30'
category: 'Android'
---

## 준비물
1. 배경이 투명한 `png`파일
2. [Android Studio](https://developer.android.com/studio)
---

## 시작
1. Android Studio를 실행하고, 프로젝트 오픈 후 왼쪽 상단 뷰를 Android로 변경
![안드로이드 스튜디오 스크린샷](https://res.cloudinary.com/dlctyrcqk/image/upload/v1730782140/Pasted_image_20231206193650_cjqpjb.png)
2. **app/res**폴더에 마우스 우클릭 > New > Image Asset 선택
3. Foreground Layer 및 Background Layer 세팅
![Configure Image Asset](https://res.cloudinary.com/dlctyrcqk/image/upload/v1730782140/Pasted_image_20231206193355_filkaq.png)
   - Foreground Layer > Path를 클릭해서 png 파일 업로드
   - Background Layer에서 백그라운드 컬러 지정
4. Next > Finish