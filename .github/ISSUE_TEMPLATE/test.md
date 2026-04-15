---
name: "🧪 Test: 테스트 코드 작성"
about: 단위 테스트, E2E 테스트 및 기능 검증 로직 추가
title: "[TEST] "
labels: "tests"
---

## 🔍 Test Details

> 어떤 기능이나 로직을 검증하려는지 설명해주세요. (예: 로그인 API 예외 처리 테스트)

- **Target**:
- **Tool**: Vitest / React Testing Library / Playwright (택 1)

## ✅ testing Rules

- [ ] **Naming**: 테스트 함수명이 `should...` 또는 `it should...` 형식을 따르는지
- [ ] **Independent**: 각 테스트 케이스가 다른 테스트에 의존하지 않고 독립적인지
- [ ] **Coverage**: 핵심 비즈니스 로직(Edge Case 포함)을 충분히 커버하는지
- [ ] **Clean**: 불필요한 `console.log`나 테스트용 더미 데이터가 정리되었는지

## 🧪 Scenarios

- [ ] **Success Case**: 정상적인 입력값일 때 기대하는 결과가 나오는지
- [ ] **Fail Case**: 잘못된 입력이나 네트워크 에러 상황에서 적절한 예외 처리가 되는지

## 🔗 Related Issue

- close: #
