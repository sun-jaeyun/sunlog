---
title: 'Object가 동일한지 비교하기'
description: 'Dart의 메모리 구조와 Object끼리 비교하는 방법 이해하기'
publishedAt: '2024-12-01'
category: 'Dart'
---

## 어떨 때 필요한가?

종종 객체가 동일한지 비교를 해야할 때가 있다. 주로 Set으로 중복을 제거할 때, 원시 자료형의 경우 중복이 잘 제거되지만 객체의 경우 **같은 구성요소를 지녔지만** 중복이 제거되지 않는 경험을 할 때가 있다.

```dart
final user1 = User(id: 1, name: 'sun');
final user2 = User(id: 1, name: 'sun');

print(user1 == user2); // false

// ???
```

이는 객체 지향 프로그래밍(<abbr title='Object-Oriented Programming'>OOP</abbr>)에서 생성된 객체가 서로 다른 인스턴스이기 때문에 발생하는 현상으로 객체 지향 프로그래밍의 메모리 구조를 이해하며 따라가 보자.

## == 연산자는 왜 _false_ 인가?

이를 이해하기 위해선 Dart의 메모리 구조를 알아야하는데 간략하게만 짚어보자면,  
생성자를 통해 생성된 객체(인스턴스)는 **Heap** 메모리 영역에 할당되고 변수로 선언한 `user1`은 객체의 참조만 가져온다. `user2` 선언에선 생성자를 통해 새로운 객체가 할당되고 그 참조를 가져온다.  
`user1`와 `user2`는 참조하는 객체(인스턴스)도 다르고, 할당된 **Stack** 메모리도 다른 전혀 다른 변수이기 때문에 _false_ 이다.
![user1과 user2의 할당 참조](https://res.cloudinary.com/dlctyrcqk/image/upload/v1733234567/Frame_6_s6jszo.png)

## 그럼 어떻게 해야하는 가?

### identical

[identical](https://api.dart.dev/dart-core/identical.html)를 사용하면 두 객체가 서로 같은 인스턴스를 참조하고 있는지 확인할 수 있다.  
다음과 같은 경우에 **user1**과 **user2**는 같은 인스턴스를 참조하는 변수이기 때문에 `true`를 반환한다.

```dart
final user1 = User(id: 1, name: 'sun');
final user2 = user1;

print(identical(user1, user2)); // true
```

> 이는 같은 인스턴스를 참조하는 경우엔 `true`이지만 같은 구성요소를 가진 다른 인스턴스를 참조하는 경우엔 `false`를 반환한다.

### override == operator

결국 문제를 해결하기 위해선 다른 방법을 택해야한다.  
Dart에서 모든 class는 암묵적으로 Object를 상속한다. Object의 `==` 연산자를 override하여 이 문제를 해결할 수 있다. 이 방법을 사용할 때 공식문서의 가이드에 따라 구성요소가 같다면 hashCode도 동일함을 보장해야한다.

> 모든 객체에는 hashCode가 있고 이는 객체의 ID만 나타내므로 `==` 연산자를 재정의하는 경우 hashCode도 해당 상태를 나타내도록 변경해야 하며, 그렇지 않으면 Set 및 Map 구현과 같은 해시 기반 데이터 구조에서 객체를 사용할 수 없습니다. hashCode는 동일한 객체에 대해 동일해야 합니다. - [Dart docs](https://api.dart.dev/dart-core/Object/hashCode.html)

```dart
class User {
  final int id;
  final String name;

  User(this.id, this.name);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is User && other.id == id && other.name == name;

  @override
  int get hashCode => Object.hash(id, name); // 구성요소가 같으면 동일한 hashCode 반환
}
```

> 또한 주의해야할 점은 해당 방식을 통해 객체를 비교하는 것은 두 객체를 논리적으로 같은 객체로 취급하는 것일 뿐, 물리적으로 메모리에서 같은 객체라는 뜻은 아니다.

## `equatable` 라이브러리 사용

[equatable](https://pub.dev/packages/equatable) 라이브러리를 사용하면 동일한 기능을 편하게 구현할 수 있다. 물론 의존성이 추가되는 것이기에 개인적으로 선호하는 방식은 아니다.

### 사용법
```dart
import 'package:equatable/equatable.dart';

// 1. Equatable을 상속
class User extends Equatable {
  final int id;
  final String name;

  User(this.id, this.name);

  // 비교할 props를 등록
  @override
  List<Object> get props => [id, name];
}
```

### 라이브러리 분석

`equatable` 라이브러리는 어떻게 구현되어 있는가? 가볍게 분석해보자.  
Github에서 [equatable/lib/src/equatable.dart](https://github.com/felangel/equatable/blob/master/lib/src/equatable.dart)을 열고 주석을 제거하면 다음과 같다.

```dart
abstract class Equatable {
  const Equatable();

  List<Object?> get props;

  bool? get stringify => null;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        other is Equatable &&
            runtimeType == other.runtimeType &&
            iterableEquals(props, other.props);
  }

  @override
  int get hashCode => runtimeType.hashCode ^ mapPropsToHashCode(props);

  @override
  String toString() {
    if (stringify ?? EquatableConfig.stringify) {
      return mapPropsToString(runtimeType, props);
    }
    return '$runtimeType';
  }
}
```

Equatable을 상속하는 객체는 개발자가 props로 등록한 요소들을 기반으로 비교하는 것을 볼 수 있다. 즉, 동일한 방식을 사용하기 편하게 해둔 것.
