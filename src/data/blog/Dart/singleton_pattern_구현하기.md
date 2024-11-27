---
title: 'Singleton Pattern 구현하기'
description: 'Dart에서 Singleton Pattern을 구현하기(w. factory 생성자)'
publishedAt: '2024-11-24'
category: 'Dart'
---

## Singleton Pattern이란?
객체 지향 프로그래밍(<abbr title='Object-Oriented Programming'>OOP</abbr>)에서 클래스의 생성자가 여러 차례 호출되더라도 실제로 생성되는 객체는 **하나**이고 최초 생성 이후에 호출된 생성자는 생성된 객체를 반환하는 소프트웨어 디자인 패턴.  
즉, A 클래스의 생성자를 여러번 호출해도 동일한 객체를 반환함을 보장한다.
```dart
// normal
final a = NormalObject();
final b = NormalObject();

print(a == b); // false

// singleton
final a = SingletonObject();
final b = SingletonObject();

print(a == b); // true
```

---

## 구현하기

```dart
class SingletonObject {
  SingletonObject._internal(); // 1. _internal() 이라는 private 생성자를 만들어 준다.
  // 2. statc private 인스턴스를 생성한다.
  static final SingletonObject _instance = SingletonObject._internal();

  factory SingletonObject() => _instance; // 3. 생성자를 호출 시 인스턴스를 반환한다.
}
```
구현은 이렇게 3줄이면 끝이므로 중요한 키워드 2가지만 보고 넘어가자면

### static
`statc` 키워드는 특정 클래스에 속하지만 해당 클래스의 인스턴스와는 독립적으로 동작하도록 만드는 키워드로 인스턴스가 아닌 클래스에 귀속된다.  
_(underbar)를 붙여 private으로 선언했지만 `SingletonObject.instance`로 접근하는 것을 허용하려면 public으로 선언해도 된다.

### factory
`factory` 생성자는 클래스의 인스턴스를 생성할 때 특별한 로직을 구현하거나 캐싱 메커니즘을 제공하기 위해 사용된다. 일반 생성자와는 다르게, factory 생성자는 새로운 인스턴스를 반드시 생성하지 않아도 된다.

> _**특징**_
> 
> _반환 타입이 동일할 필요 없음 - 해당 클래스의 자식 클래스를 반환할 수도 있음._
> 
> _객체 생성 전에 유효성 검사, 객체 재사용 등의 작업을 처리할 수 있음._
> 
> _`this`에 접근할 수 없음._

`factory` 생성자의 이러한 특징들로 다양한 짓거리?들을 할 수 있는데 이는 추후 다뤄보도록 하자.

### 요약
즉, 위에 3줄의 코드는 private한 생성자를 만들고, static한 인스턴스를 생성해준 뒤, 생성자를 호출할 때마다 해당 인스턴스를 반환하는 **Singleton Pattern**을 가진 클래스 **SingletonObject**를 만드는 코드가 된다.