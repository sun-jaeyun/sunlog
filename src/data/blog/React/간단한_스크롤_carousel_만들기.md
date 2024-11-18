---
title: '간단한 스크롤 Carousel 만들기'
description: 'React에서 라이브러리 없이 스크롤 가능한 Carousel 만들기'
publishedAt: '2024-11-15'
category: 'React'
---

## 목표
- React 외 라이브러리 의존성 X
- 기본 가로 스크롤 및 마우스 사용환경에서 클릭&드래그로 스크롤 가능
---

## 구조
![캐러셀 아키텍쳐](https://res.cloudinary.com/dlctyrcqk/image/upload/v1731853871/Frame_3_tmhlui.png)

보여줄 크기를 가진 **container** 안에 컨텐츠를 담을 **body**가 있는 구조로 `css`로 대부분의 처리를 하고 클랙&드래그만 `js`로 처리하는 구조

## 시작

### 기본 구조와 `css` 설정
```jsx
import React from 'react';
import './style.css';

const ScrollCarousel = ({ children }: { children?: React.ReactNode; }) => {
  return (
    <div className='carousel-container'>
      <div className='carousel-body'>{children}</div>
    </div>
  );
};

export default ScrollCarousel;
```
```css
/* style.css */
.carousel-container {
  width: 100%;
  position: relative;
}

.carousel-body {
  display: flex;
  flexWrap: nowrap;
  overflowX: auto;
  scrollbarWidth: none;
  msOverflowStyle: none;
  user-selct: none;
}

.carousel-body::-webkit-scrollbar {
  display: none;
}

/* children */
.carousel-body > * {
  flex: none;
}
```

여기까지만 해도 가로 스크롤이 지원되는 환경에선 자연스러운 스크롤이 가능한 Carousel이 완성됨.  
다음 단계는 마우스 사용환경에서 클릭&드래그를 지원하기 위한 파트

### state와 이벤트 핸들러 설정
```jsx
import React from 'react';
import './style.css';

const ScrollCarousel = ({ children }: { children?: React.ReactNode; }) => {
  // 드래그 여부
  const [isDown, setIsDown] = useState(false);
  // 마우스 다운 이벤트 발생 시 마우스의 X 좌표를 저장
  const [startX, setStartX] = useState(0);
  // 마우스 다운 이벤트 발생 시 body의 스크롤 위치를 저장
  const [scrollLeft, setScrollLeft] = useState(0);

  // 마우스가 눌렸을 때
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDown(true); // 드래그 시작 상태로 변경
    setStartX(e.pageX - e.currentTarget.offsetLeft); // 마우스의 X 좌표를 시작점으로 저장
    setScrollLeft(e.currentTarget.scrollLeft); // 현재 스크롤 위치 저장
  };

  // 마우스가 움직일 때
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // 마우스가 눌리지 않은 경우 동작하지 않음
    if (!isDown) {
      return;
    }
    e.preventDefault(); // 기본 동작 방지 (예: 텍스트 선택 방지)
    const x = e.pageX - e.currentTarget.offsetLeft; // 현재 마우스의 X 좌표 계산
    const moveX = x - startX; // 마우스가 움직인 거리 계산
    e.currentTarget.scrollLeft = scrollLeft - moveX; // 움직인 거리를 기반으로 스크롤 위치 업데이트
  };

  // 마우스를 뗐을 때
  const onMouseUp = () => {
    setIsDown(false); // 드래그 종료 상태로 변경
  };

  // 마우스가 요소 밖으로 나갔을 때
  const onMouseLeave = () => {
    setIsDown(false); // 드래그 종료 상태로 변경
  };

  return (
    <div className='carousel-container'>
      <div
        className='carousel-body'
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}>
          {children}
        </div>
    </div>
  );
};

export default ScrollCarousel;
```
```css
/* style.css */

/* ... */

/* children */
.carousel-body > * {
  flex: none;
  pointer-events: none; /* update: children이 드래그 되는 걸 방지 */
}
```

### `css` 추가옵션  

**body**의 cursor를 `grab`으로, 드래그 중일 땐 cursor를 `grabbing`으로 바꿔주면 더 자연스러움  
해당 내용은 편의상 [Tailwind CSS](https://tailwindcss.com/)로 작성.

```jsx
import React, { useState } from 'react';

const ScrollCarousel = ({ children }: { children?: React.ReactNode }) => {
  // 드래그 여부
  const [isDown, setIsDown] = useState(false);
  // 마우스 다운 이벤트 발생 시 마우스의 X 좌표를 저장
  const [startX, setStartX] = useState(0);
  // 마우스 다운 이벤트 발생 시 body의 스크롤 위치를 저장
  const [scrollLeft, setScrollLeft] = useState(0);

  // 마우스가 눌렸을 때
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDown(true); // 드래그 시작 상태로 변경
    setStartX(e.pageX - e.currentTarget.offsetLeft); // 마우스의 X 좌표를 시작점으로 저장
    setScrollLeft(e.currentTarget.scrollLeft); // 현재 스크롤 위치 저장
  };

  // 마우스가 움직일 때
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // 마우스가 눌리지 않은 경우 동작하지 않음
    if (!isDown) {
      return;
    }
    e.preventDefault(); // 기본 동작 방지 (예: 텍스트 선택 방지)
    const x = e.pageX - e.currentTarget.offsetLeft; // 현재 마우스의 X 좌표 계산
    const moveX = x - startX; // 마우스가 움직인 거리 계산
    e.currentTarget.scrollLeft = scrollLeft - moveX; // 움직인 거리를 기반으로 스크롤 위치 업데이트
  };

  // 마우스를 뗐을 때
  const onMouseUp = () => {
    setIsDown(false); // 드래그 종료 상태로 변경
  };

  // 마우스가 요소 밖으로 나갔을 때
  const onMouseLeave = () => {
    setIsDown(false); // 드래그 종료 상태로 변경
  };

  return (
    <div className='w-full relative'>
      <div
        className={`flex flex-nowrap overflow-x-auto select-none scrollbar-hide ${isDown ? 'cursor-grabbing' : 'cursor-grab'} [&>*]:flex-none [&>*]:pointer-events-none`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollCarousel;
```
scrollbar-hide 속성은 [tailwind-scrollbar-hide](https://www.npmjs.com/package/tailwind-scrollbar-hide) 사용

## 결과
![](https://res.cloudinary.com/dlctyrcqk/image/upload/v1731888695/scroll_carousel_result_ijiclb.gif)