---
title: 'App Icon 변경하기'
description: 'iOS 앱의 아이콘을 변경하는 방법'
publishedAt: '2024-10-31'
category: 'iOS'
---

## 준비물
1. **1024x1024** 사이즈의 `png` 파일
---

## 시작
1. [아이콘 파일 생성 사이트](https://www.appicon.co/)에 업로드 후 타겟 디바이스에 맞게 체크
![앱아이콘 사이트 스크린샷](https://res.cloudinary.com/dlctyrcqk/image/upload/v1730779757/Screenshot_2024-11-05_at_1.09.09_PM_yxzrpj.png)
2. 다운로드 받은 파일 압축 해제
3. /Assets.xcassets/AppIcon.appiconset 폴더로 프로젝트의 /Runner/Assets.xcassets/AppIcon.appiconset 폴더 대치
---

## 확인
Xcode를 실행하고 Runner/Runner/Assets.xcassets/AppIcon 확인
![Xcode 스크린샷](https://res.cloudinary.com/dlctyrcqk/image/upload/v1730779950/Pasted_image_20231206195051_geoxk2.png)