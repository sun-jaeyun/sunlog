---
title: 'GitHub에 SSH로 연결하기'
description: 'GitHub에 SSH로 연결하고 여러개의 계정을 관리하는 방법'
publishedAt: '2024-11-05'
category: 'GitHub'
---

## 시작

### 환경
- macOS Sequoia 15.1

### SSH 키 생성하기
1. 터미널에 아래 명령어를 입력한다. `"your_email@example.com"`은 본인의 이메일로 대치
```sh
ssh-keygen -t ed25519 -C "your_email@example.com"
```
> macOS High Sierra 10.12 이하에선 Ed25519 암호화 알고리즘을 공식적으로 지원하지 않기에
> 
> RSA 알고리즘으로 키를 생성하거나 ssh 버전을 올려야한다.

### ssh-agent에 키 등록하기
1. ssh-agent를 실행
```sh
eval "$(ssh-agent -s)"
```
2. `~/.ssh/config`파일을 연다.
3. 아래와 같이 수정한다
```
Host github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
```
4. Keychain에 등록한다.
```sh
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

### GitHub에 키 등록하기
1. 생성한 키를 복사한다
```sh
cat ~/.ssh/id_ed25519.pub | pbcopy
```
2. GitHub > Settings > SSH and GPG keys로 들어간다. [링크](https://github.com/settings/keys)
3. Add New SSH Key를 누르고 키를 등록한다.
> title은 자신이 구분할 수 있는 레이블로 등록하면 된다.

## 여러 계정을 하나의 디바이스에서 관리하기
ex) 개인용, 회사용 계정을 구분해서 사용해야할 때

### 회사용 SSH 키 생성하기하고 등록하기
1. 터미널에 아래 명령어를 입력한다. `"your_email@example.com"`은 회사 이메일로 대치
```sh
ssh-keygen -t ed25519 -C "your_email@example.com"
```
2. 키 이름을 변경 ex) `id_ed25519_work`
```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/jaeyunwoo/.ssh/id_ed25519):
/Users/jaeyunwoo/.ssh/id_ed25519_work
```
3. 회사용 GitHub 계정에 [키를 등록](#github에-키-등록하기)한다.

### ssh-agent에 회사용 키 등록하기
1. `~/.ssh/config` 파일을 연다.
2. 예시와 같이 수정한다.
```
# 개인용
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519

# 회사용
Host github.com-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work

Host *
   AddKeysToAgent yes
   IdentitiesOnly yes
```
3. Keychain에 등록한다.
```sh
ssh-add -D # optional: 기존에 등록된 모든 키를 지운다
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_work
```

### 확인
아래 명령어를 쳤을 때 각각 개인용/회사용 아이디가 나오면 완료된 것
```sh
ssh -T git@github.com
> Hi {{개인용}}! You've successfully authenticated, but GitHub does not provide shell access.
ssh -T git@github.com-work
> Hi {{회사용}}! You've successfully authenticated, but GitHub does not provide shell access.
```
---

참조
1. [Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
2. [How to Set Up Multiple SSH Keys for GitHub Accounts on macOS?](https://pratapsharma.io/github-miltiple-key/)