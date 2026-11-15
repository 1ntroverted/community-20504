# COMMUNITY 20504 - 학교 실습실 MySQL 포터블용

## 환경 및 주소
- MySQL 8.4.11 ZIP: `D:\mysql-portable` / 포트 **3306**
- MySQL Workbench: `D:\Workbench` (DB 관리용, 웹 서버가 아님)
- Express API: `http://localhost:5000/api`
- React Vite: **`http://localhost:5173`**
- DB: **`community_20504`** (학번 20504)
- Node.js 및 npm 설치 필요. MySQL 설치만으로 React/Express가 실행되지는 않습니다.

## 학교 PC 최초 실행 순서
1. 학교 안내에 따라 MySQL ZIP을 `D:\mysql-portable`에 풀고 `my.ini`를 준비합니다.
2. **처음 설치할 때만** `mysqld --defaults-file=D:\mysql-portable\my.ini --initialize-insecure` 실행. 기존 `data` 폴더가 있으면 다시 초기화하지 마세요.
3. 학교의 `D:\mysql-portable\start.bat`을 실행해 MySQL 서버를 켜 둡니다. `mysqld --console` 창은 닫지 마세요.
4. 프로젝트를 GitHub에서 내려받아 압축 해제하거나 `git clone`합니다.
5. 프로젝트 루트의 **`setup-school.bat`** 실행: `.env` 파일 자동 생성, server/client npm 설치. 인터넷 연결이 필요합니다.
6. **`init-db-school.bat`** 실행: root 계정에 비밀번호가 없는 학교 초기 설정을 전제로 DB와 테이블 생성. MySQL 서버가 먼저 켜져 있어야 합니다.
7. **`start-project-school.bat`** 실행: API(5000)와 Vite(5173)를 각각 별도 창으로 실행.
8. 브라우저에서 `http://localhost:5173` 접속 후 회원가입부터 시연합니다.

## 이미 MySQL에 비밀번호가 설정된 경우
- `server/.env`의 `DB_PASSWORD`를 해당 비밀번호로 변경합니다.
- `init-db-school.bat`의 mysql 명령에서 `-u root` 뒤에 `-p`를 추가하고 실행 시 암호를 입력합니다.
- DB 이름은 `community_20504`로 유지합니다.

## 기존 DB를 사용했다면
- `schema.sql`은 `CREATE TABLE IF NOT EXISTS`이므로 기존 테이블의 구조를 자동으로 변경하지 않습니다.
- 기존 `users` 테이블에 `password` 열이 없으면 Workbench에서 `ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT '';`를 1회 실행합니다.
- 기존 비밀번호 없는 회원은 로그인할 수 없으니 **새 회원가입**으로 테스트합니다.

## 수행평가 시연
1. 회원가입 (bcryptjs 해시 저장) → 로그인 → 마이페이지 조회/수정
2. 게시글 등록 → 전체 목록 조회 → 본인 글 수정/삭제
3. 다른 계정으로 로그인해 타인의 게시글 수정/삭제가 거부되는지 확인
4. JOIN 조회 탭의 `users + posts` / `posts + comments` 결과 확인
5. 회원 탈퇴 및 재로그인 실패 확인

## 주의
- Workbench는 선택적 관리 프로그램이고, 실제 DB 서버는 `mysqld`입니다.
- `.env`는 GitHub에 올리지 않습니다. `.env.example`만 제출합니다.
- `5173`이 이미 사용 중이면 Vite는 자동으로 다른 포트로 이동하지 않고 오류를 내도록 설정했습니다. 다른 프로그램을 종료하세요.
- 학교에서 **Node.js가 설치되어 있는지**, `npm install` 인터넷이 가능한지 반드시 확인하세요.
- `init-db-school.bat`은 초기 root 비밀번호가 없는 경우에만 바로 동작합니다.
