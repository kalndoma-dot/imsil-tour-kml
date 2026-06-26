`data.kml` 파일을 열고 해당 카테고리 폴더에 `<Placemark>` 추가:

```xml
<Folder>
  <name>축제</name>   <!-- 새 카테고리 자동 생성됨 -->

  <Placemark>
    <name>임실 치즈 축제장</name>
    <description>★ 10월 한정 ★ 임실 치즈 페스티벌</description>
    <Point>
      <coordinates>127.2891,35.6174,0</coordinates>  <!-- 경도,위도 순서! -->
    </Point>
  </Placemark>

</Folder>
```

> **좌표 확인 방법**: 구글 지도에서 장소를 우클릭 → "이곳이 궁금한가요?" 클릭 → 위/경도 표시

### 장소 삭제 (예: 축제 종료)

해당 `<Placemark>` 블록 전체를 삭제 후 저장.

### GitHub에 반영 (업데이트 적용)

```bash
# Git 사용 시
git add data.kml
git commit -m "치즈 축제 장소 추가"
git push

# 또는 GitHub 웹사이트에서 직접 편집 후 Commit
```

**사용자 반영 시점**: 앱을 열거나 새로고침할 때 즉시 반영됩니다.

---

## 카테고리 추가 방법

`data.kml`에 새 `<Folder>`를 추가하면 앱에 **자동으로 카테고리 탭이 생성**됩니다.

```xml
<!-- 새 카테고리 예시 -->
<Folder>
  <name>카페</name>
  <Placemark>...</Placemark>
</Folder>

<Folder>
  <name>맛집</name>
  <Placemark>...</Placemark>
</Folder>

<Folder>
  <name>축제</name>
  <Placemark>...</Placemark>
</Folder>
```

---

## 운영 시나리오 예시

| 상황 | 해야 할 일 | 앱 재출시 필요? |
|------|-----------|---------------|
| 축제 시작 | data.kml에 장소 추가 → GitHub push | ❌ 불필요 |
| 축제 종료 | data.kml에서 장소 삭제 → GitHub push | ❌ 불필요 |
| 새 카페 오픈 | data.kml에 장소 추가 → GitHub push | ❌ 불필요 |
| 맛집 정보 수정 | data.kml 해당 항목 수정 → GitHub push | ❌ 불필요 |
| UI 디자인 변경 | App.jsx 수정 → `npm run build` → 재출시 | ✅ 필요 |
| 새 기능 추가 | App.jsx 수정 → `npm run build` → 재출시 | ✅ 필요 |

---

## 주의사항

### CORS 문제
GitHub Raw URL(`raw.githubusercontent.com`)은 CORS가 허용되어 있어 별도 설정 없이 사용 가능합니다.

### 캐시 문제
현재 코드의 `?v=' + Date.now()` 쿼리 파라미터가 브라우저 캐시를 우회하므로 항상 최신 데이터를 불러옵니다.

### 오프라인 대비
네트워크 오류 시 "데이터 로딩 실패" 토스트가 표시됩니다. 이후 필요하면 캐시 fallback도 추가할 수 있습니다.

### 좌표 형식
KML 좌표 순서는 `경도,위도,고도(생략가능)` 입니다. 구글 지도는 `위도,경도` 순서이므로 **반드시 순서를 바꿔서** 입력하세요.

```
구글 지도에서 복사: 35.6174, 127.2891
KML에 입력:        127.2891, 35.6174  ← 순서 바꿔야 함!
```

---

## 체크리스트 (적용 시)

- [ ] GitHub에 `imsil-data` 저장소 생성 (Public)
- [ ] `data.kml` 파일을 저장소에 업로드
- [ ] [App.jsx](file:///d:/toss%20project/imsil-toss-app/src/App.jsx) 324번째 줄의 [fetch](file:///d:/toss%20project/imsil-toss-app/src/App.jsx#297-322) URL을 GitHub Raw URL로 변경
- [ ] `npm run build` 실행 → [.ait](file:///d:/toss%20project/imsil-toss-app/imsiltour.ait) 파일 생성
- [ ] 토스 플랫폼에 최종 버전 출시 (마지막 버전업)
- [ ] 이후 데이터 변경은 GitHub에서만 관리 ✅

---

## 🎨 축제 공식 포스터 수동 관리 가이드

외부 사이트의 빈번한 구조 변경이나 잘못된 이미지 업로드로 인한 앱의 신뢰도 하락을 막기 위해, 공식 포스터 및 현장 사진은 **관리자가 수동으로 검수하여 지정된 폴더에 덮어쓰기 하는 방식**으로 고정하여 운영합니다.

### 1. 이미지 교체 방법
`images/` 폴더 내에 저장된 아래 **표준 파일명**을 그대로 사용하여 새로운 사진 파일을 덮어쓰기(Overwrite) 합니다.
- `rose_festival.jpg` (임실N장미축제)
- `aqua_festival.jpg` (임실 아쿠아페스티벌)
- `cheese_festival.jpg` (임실N치즈축제)
- `santa_festival.jpg` (임실 산타축제)
- `pet_festival.jpg` (임실N펫스타 축제)

> **팁:** 이미지 확장자가 `.png`이더라도 파일명을 무조건 `.jpg`로 변경하여 덮어쓰거나, 파일 확장자가 바뀌는 경우 `data.kml` 내부의 파일명도 함께 변경해 주어야 합니다. 가급적 `.jpg` 포맷 유지를 권장합니다.

### 2. GitHub에 변경 사항 푸시
로컬 저장소의 `images/` 폴더에 사진을 덮어썼다면, 다음 명령어로 변경 사항을 Github에 반영합니다.

```bash
git add images/
git commit -m "Update: [축제이름] 공식 포스터 이미지 교체"
git push
```

### 3. 반영 결과 확인
`data.kml`은 항상 Github Raw 주소(`https://raw.githubusercontent.com/...`)를 통해 `images/` 폴더의 이미지를 직접 바라보고 있습니다. Github에 Push 된 직후 앱을 새로고침하면 교체한 사진이 즉시 반영되어 보입니다.
