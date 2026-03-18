//UMD 스크립트 로드 -> 전역객체 stompjs를 바로 사용할 수 있음.
let stompClient = null;

// const connectBtn = document.getElementById('connectBtn');
// const sendBtn = document.getElementById('sendBtn');
const chatBox = document.getElementById('chatBox');
const errorMsg = document.getElementById('errorMsg');

const targetInputDom = document.getElementById('targetInput');
const messageInputDom = document.getElementById('messageInput');
const emojiSidebar = document.getElementById('emojiSidebar');

//화면 메시지를 그리는 유틸리티 함수
function appendMessage(sender, message){
    const div = document.createElement('div');
    div.textContent = `[${sender}] : ${message}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

//페이지 로드시 자동 연결 (로그인 정보 확인)
document.addEventListener('DOMContentLoaded', () => {

    //세션에 있는 아이디값 추출
    const myId = sessionStorage.getItem('userId');

    // 비정상적인 접근 시 로그인 화면으로 반환
    if(!myId){
        alert('로그인이 필요합니다.');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('currentUserDisplay').textContent = myId;

    stompClient = new StompJs.Client({
        brokerURL: 'ws://localhost:8080/ws/chat?userId=' + myId,
        onConnect: () => {
            appendMessage('시스템', `${myId}님이 입장했습니다.`);
            //connectBtn.disabled = true;
            errorMsg.textContent = '';

            stompClient.subscribe('/user/queue/messages', (message) => {
                const data = JSON.parse(message.body);
                appendMessage(data.senderId,data.content);
            });
        },
        onStompError: (error) => {
            appendMessage('에러','브로커 연결 실패');
            console.error(error);
        }
    });
    stompClient.activate();
});

//메시지 전송 및 나가기 로직
document.getElementById('sendBtn').addEventListener('click', () => {
    if(!stompClient || !stompClient.connected) return;

    const targetId = targetInputDom.value.trim();
    const message = messageInputDom.value.trim();

    if(!targetId || !message){
        errorMsg.textContent = '상대방 아이디와 메시지를 입력하세요.';
        return;
    }

    errorMsg.textContent = '';

    stompClient.publish({
        destination: '/pub/chat.private',
        body: JSON.stringify({
            targetUserId: targetId,
            content: message
        })
    });

    appendMessage('나', message);
    messageInputDom.value = '';
    messageInputDom.focus();
});

//이모지 사이드 바 제어
document.getElementById('emojiBtn').addEventListener('click', () => {
    const isHidden = emojiSidebar.style.display === 'none';
    emojiSidebar.style.display = isHidden ? 'block' : 'none';
});

const emojiPickerElement = document.querySelector('emoji-picker');
if(emojiPickerElement){
    emojiPickerElement.addEventListener('emoji-click', evenet => {
        messageInputDom.value += event.detail.unicode;
        emojiSidebar.style.display = 'none';
        messageInputDom.focus();
    })
}


//서버 연결 로직
/* connectBtn.addEventListener('click', () => {
    const myId = document.getElementById('myId').value.trim();
    if(!myId) {
        errorMsg.textContent = '내 아이디를 입력해주세요.';
        return;
    }
    stompClient = new StompJs.Client({
        brokerURL: 'ws://localhost:8080/ws/chat?userId=' + myId,
        onConnect: () => {
            appendMessage('시스템', `${myId}님이 입장했습니다.`);
            connectBtn.disabled = true;
            errorMsg.textContent = '';

            stompClient.subscribe('/user/queue/messages', (message) => {
                const data = JSON.parse(message.body);
                appendMessage(data.senderId,data.content);
            });
        },
        onStompError: (error) => {
            appendMessage('에러','브로커 연결 실패');
            console.error(error);
        }
    });
    stompClient.activate();
}); */

// [수정된 메시지 전송 로직]
/* sendBtn.addEventListener('click', () => {
    if(!stompClient || !stompClient.connected){
        errorMsg.textContent = '서버 연결이 필요합니다.';
        return; 
    }

    // 1. 버튼을 누른 순간에 HTML 요소를 화면에서 다시 찾습니다.
    const targetInputDom = document.getElementById('targetId');
    const messageInputDom = document.getElementById('messageInput');

    // 2. 방어 로직: 만약 HTML에 해당 id가 없다면, 앱을 죽이지 않고 콘솔에 에러만 띄운 뒤 멈춥니다.
    if (!targetInputDom || !messageInputDom) {
        console.error('[오류] index.html에서 targetId 또는 messageInput 요소를 찾을 수 없습니다. id 스펠링을 확인하세요.');
        return; 
    }

    // 3. 요소가 확실히 존재할 때만 .value를 읽어옵니다. (에러 발생 원천 차단)
    const targetId = targetInputDom.value.trim();
    const message = messageInputDom.value.trim();

    // 빈 값 검증 로직
    if(!targetId || !message) {
        errorMsg.textContent = '상대방 아이디와 메시지를 모두 입력하세요.';
        targetInputDom.style.border = !targetId ? '1px solid red' : '';
        messageInputDom.style.border = !message ? '1px solid red' : '';
        return;
    }

    // 검증 통과 시 UI 초기화
    errorMsg.textContent = '';
    targetInputDom.style.border = '';
    messageInputDom.style.border = '';

    // 서버로 데이터 전송
    stompClient.publish({
        destination: '/pub/chat.private',
        body: JSON.stringify({
            targetUserId: targetId,
            content: message
        })
    });

    appendMessage('나', message);
    messageInputDom.value = ''; 
    messageInputDom.focus();
});




document.addEventListener('DOMContentLoaded', () => {
    // 3. 이모지 피커 토글 및 제어 로직
    const emojiBtn = document.getElementById('emojiBtn');
    const emojiPickerContainer = document.getElementById('emojiPickerContainer');
    const emojiPickerElement = document.querySelector('emoji-picker'); // 요소 찾기

    // [디버깅 방어 로직] HTML에 이모지 관련 태그가 정상적으로 존재하는지 먼저 검증합니다.
    if (emojiBtn && emojiPickerContainer && emojiPickerElement) {
        
        // 버튼 클릭 시 토글
        emojiBtn.addEventListener('click', () => {
            const isHidden = emojiPickerContainer.style.display === 'none';
            emojiPickerContainer.style.display = isHidden ? 'block' : 'none';
        });

        // 이모지 선택 시 텍스트 박스에 추가
        emojiPickerElement.addEventListener('emoji-click', event => {
            const messageInputDom = document.getElementById('messageInput');
            if(messageInputDom) {
                messageInputDom.value += event.detail.unicode;
                emojiPickerContainer.style.display = 'none'; // 선택 후 닫기
                messageInputDom.focus(); // 연속 입력 편의성
            }
        });

    } else {
        console.warn('이모지 관련 HTML 요소를 찾을 수 없어 피커를 초기화하지 않았습니다.');
    }
});
 */