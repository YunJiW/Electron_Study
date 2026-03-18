# Electron STOMP Chat Client

## 프로젝트 개요
Spring Boot 백엔드와 웹소켓(STOMP)으로 양방향 통신하는 순수 바닐라 자바스크립트 기반의 일렉트론(Electron) 1:1 채팅 데스크톱 클라이언트입니다. 
무거운 프론트엔드 프레임워크를 배제하고 가볍고 직관적인 아키텍처로 구성되어 있으며, 데스크톱 환경에 필수적인 보안 표준과 최적의 메신저 UX를 제공합니다.

## 핵심 아키텍처 및 보안 (Architecture & Security)

* **프로세스 격리 (Context Isolation 및 nodeIntegration 차단):** * 운영체제 자원에 접근하는 메인 프로세스(`main.js`)와 화면을 그리는 렌더러 프로세스(UI)를 완벽하게 분리했습니다. 이를 통해 XSS 등의 프론트엔드 취약점이 Node.js 시스템 권한 탈취로 이어지는 것을 원천 차단했습니다.
* **다이렉트 라우팅 통신 (Explicit Channel Routing):**
    * 무거운 세션 기반의 Spring Security 의존성을 배제했습니다. 대신 `stompClient.subscribe('/topic/private.{userId}')` 형태의 명시적 구독 방식을 채택하여, 브로커가 아이디 기반으로 즉각적이고 가벼운 1:1 메시지 라우팅을 수행하도록 설계했습니다.
* **관심사의 분리 및 상태 비저장 (Decoupling & Stateless):**
    * 데이터 전송 대상(Target)과 메시지 입력부를 분리하고, DOM 조작과 STOMP 네트워크 로직을 독립시켜 향후 기능 확장(파일 업로드 등) 시 유지보수성을 극대화했습니다.

## 기술 스택 (Tech Stack)

* **Core:** Electron, Node.js
* **Frontend:** HTML5, CSS3 (Flexbox Layout), Vanilla JavaScript
* **Network:** `@stomp/stompjs` (v7.0.0 UMD CDN)
* **UI Components:** `emoji-picker-element` (Web Component CDN)

## 폴더 구조 (Directory Structure)

\`\`\`text
📦 electron-chat-client
├── 📄 package.json        # 의존성 및 실행 스크립트 관리
├── 📄 main.js             # Electron 메인 프로세스 (진입점, 창 생성, 이전 캐시 정리 로직 포함)
└── 📂 src
    └── 📂 renderer        # 화면(UI) 및 프론트엔드 비즈니스 로직
        ├── 📄 login.html  # 로그인 UI
        ├── 📄 login.js    # 세션 방어 로직 및 화면 전환 라우팅
        ├── 📄 chat.html   # 채팅방 UI (Flexbox 기반 말풍선 레이아웃)
        └── 📄 chat.js     # STOMP 웹소켓 통신 및 DOM 동적 렌더링
\`\`\`

## 설치 및 실행 방법 (Getting Started)

본 프로젝트를 로컬 환경에서 실행하기 위한 단계적 가이드입니다.

**1. 의존성 패키지 설치**
터미널을 열고 `package.json`이 위치한 프로젝트 최상단 경로에서 아래 명령어를 실행합니다.
\`\`\`bash
npm install
\`\`\`

**2. 클라이언트 실행**
\`\`\`bash
# 기본 실행 방식
npm start

# 프로파일 환경변수를 주입하는 실행 방식 (Windows PowerShell 기준)
$env:PROFILE="A"; npm start
\`\`\`
> **주의 사항:** 채팅 클라이언트가 정상적으로 브로커와 연결되려면, `localhost:8080` 포트에서 STOMP를 지원하는 Spring Boot 서버가 구동 중이어야 합니다.

## 주요 기능 (Features)

* **세션 기반 간편 진입:** 복잡한 인증 절차 없이 아이디 입력만으로 로컬 세션 할당 및 고유 구독 채널 생성.
* **실시간 1:1 메시지 송수신:** 타겟 아이디를 지정하여 서버의 `/pub/chat.private` 채널을 통한 목적지 기반 메시지 전송.
* **사용자 경험(UX) 중심의 레이아웃:** * 상용 메신저(카카오톡/슬랙) 표준을 준수한 좌(상대방)/우(나) 분리형 말풍선 디자인 적용.
    * 시스템 메시지 중앙 정렬 및 시각적 피드백 제공.
    * 채팅 내용 증가 시 스크롤 자동 최하단 유지.
* **이모지 통합:** 경량화된 Web Component 기반 이모지 피커 토글 기능 제공.