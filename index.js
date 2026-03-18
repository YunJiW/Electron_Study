const {app, BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');


let tempUserDataPath = null;

//개발 환경 판별
const isDev = !app.isPackaged; 
const originalUserDataPath = app.getPath('userData');

if (isDev) {
    // 1. [청소 로직] 앱이 켜질 때, 이전에 만들어진 dev-profile 폴더들을 싹 지웁니다.
    try {
        const parentDir = path.dirname(originalUserDataPath); // 보통 Roaming 폴더
        const files = fs.readdirSync(parentDir);
        files.forEach(file => {
            if (file.startsWith('dev-profile-')) {
                const dirPath = path.join(parentDir, file);
                // 강제 삭제 (Node v14+ 표준)
                fs.rmSync(dirPath, { recursive: true, force: true }); 
            }
        });
        console.log('이전 캐시 폴더 정리 완료');
    } catch (err) {
        console.warn('캐시 폴더 정리 중 일부 실패 (무시 가능):', err.message);
    }

    // 2. 새로운 프로필 폴더 할당
    app.setPath('userData', path.join(originalUserDataPath, `dev-profile-${Date.now()}`));
}


function createWindow(){

    //브라우저 창 생성 및 기본 해상도 설정
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            //렌더러 프로세스에서 Node.js API 직접 접근 차단.
            nodeIntegration: false,
            contextIsolation: true
        }
    });


    //UI 화면 로드
    // const htmlPath = path.join(__dirname, '/src/renderer/index.html');
    const htmlPath = path.join(__dirname, '/src/renderer/login.html');
    win.loadFile(htmlPath);

    win.webContents.openDevTools();
}

app.whenReady().then(() =>{
    createWindow();

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0){
            createWindow();
            
        }
    });
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
});