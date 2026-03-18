document.getElementById('loginBtn').addEventListener('click', () => {
    const idInputDom = document.getElementById('myIdInput');
    const errorMsg = document.getElementById('errorMsg');
    if (!idInputDom) {
        console.error('[오류] login.html에서 id="myIdInput"인 요소를 찾을 수 없습니다.');
        return; 
    }

    const myId = idInputDom.value.trim();

    if (!myId) {
        if (errorMsg) errorMsg.textContent = '아이디를 입력해주세요.';
        idInputDom.style.border = '1px solid red'; // UX 시각적 피드백
        return;
    }
    sessionStorage.setItem('userId', myId);
    window.location.href = './chat.html';
});

// 엔터키 지원 (UX 향상) - 여기에도 방어 로직 적용
const idInputDomForEnter = document.getElementById('myIdInput');
if (idInputDomForEnter) {
    idInputDomForEnter.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) loginBtn.click();
        }
    });
}