// js/auth.js - Xử lý đăng nhập và phân quyền

let currentUser = null;

let pendingUser = null; // Lưu user tạm thời sau khi nhập đúng mật khẩu

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const user = demoUsers.find(u => u.username === username && u.password === password);

    if (user) {
        pendingUser = user;

        // Nếu user có TOTP secret → dùng TOTP thật
        if (user.totpSecret) {
            showRealTOTPModal(user);
        } else {
            // Fallback sang mã ngẫu nhiên (demo)
            showTwoFactorModal(user);
        }
    } else {
        alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
}

// Hiển thị modal xác thực hai yếu tố
function showTwoFactorModal(user) {
    // Tạo mã 6 số ngẫu nhiên (demo)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Tạo modal
    const modalHTML = `
        <div id="twofa-modal" class="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div class="bg-[#1e40af] text-white p-5 text-center">
                    <i class="fa-solid fa-shield-alt text-3xl mb-2"></i>
                    <h3 class="text-xl font-bold">Xác thực hai yếu tố</h3>
                    <p class="text-blue-200 text-sm mt-1">Nhập mã xác thực để hoàn tất đăng nhập</p>
                </div>
                
                <div class="p-6">
                    <div class="mb-4 text-center">
                        <p class="text-sm text-slate-600">Mã xác thực (demo):</p>
                        <div class="mt-2 text-3xl font-mono font-bold tracking-[6px] text-[#1e40af] bg-slate-100 py-2 rounded-2xl select-all">
                            ${code}
                        </div>
                        <p class="text-xs text-slate-500 mt-1">Mã có hiệu lực trong 5 phút (demo)</p>
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-slate-600 mb-1.5">Nhập mã xác thực 6 chữ số</label>
                        <input type="text" id="twofa-code" maxlength="6" 
                               class="w-full text-center text-2xl tracking-[8px] font-mono px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:border-[#1e40af]"
                               placeholder="000000">
                    </div>
                    
                    <div class="flex gap-3">
                        <button onclick="cancelTwoFactor()" 
                                class="flex-1 py-3 border border-slate-300 rounded-2xl text-sm font-medium hover:bg-slate-50">
                            Hủy
                        </button>
                        <button onclick="verifyTwoFactor('${code}', '${user.username}')" 
                                class="flex-1 py-3 bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-2xl text-sm font-semibold">
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Focus vào ô nhập mã
    setTimeout(() => {
        const input = document.getElementById('twofa-code');
        if (input) input.focus();
    }, 100);
}

// Xác minh mã 2FA
function verifyTwoFactor(correctCode, username) {
    const inputCode = document.getElementById('twofa-code').value.trim();
    
    if (inputCode === correctCode) {
        // Thành công → hoàn tất đăng nhập
        const user = demoUsers.find(u => u.username === username);
        if (user) {
            currentUser = user;
            localStorage.setItem('vks_current_user', JSON.stringify(user));
            
            // Đóng modal
            document.getElementById('twofa-modal').remove();
            
            // Ẩn overlay đăng nhập
            document.getElementById('login-overlay').style.display = 'none';
            
            showUserInfo(user);
            showToast(`Đăng nhập thành công! Xin chào ${user.name}`);
            
            setTimeout(() => {
                switchTab(1);
            }, 500);
        }
    } else {
        alert("Mã xác thực không đúng!");
        // Có thể cho phép thử lại
    }
}

function cancelTwoFactor() {
    const modal = document.getElementById('twofa-modal');
    if (modal) modal.remove();
    pendingUser = null;
}

// ==================== REAL TOTP (using OTPAuth library) ====================

function showRealTOTPModal(user) {
    const modalHTML = `
        <div id="totp-modal" class="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div class="bg-[#1e40af] text-white p-5 text-center">
                    <i class="fa-solid fa-key text-3xl mb-2"></i>
                    <h3 class="text-xl font-bold">Xác thực hai yếu tố (TOTP)</h3>
                    <p class="text-blue-200 text-sm mt-1">Nhập mã từ ứng dụng xác thực (Google Authenticator, Microsoft Authenticator...)</p>
                </div>
                
                <div class="p-6">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-slate-600 mb-1.5">Mã xác thực 6 chữ số</label>
                        <input type="text" id="totp-code" maxlength="6" 
                               class="w-full text-center text-3xl tracking-[10px] font-mono px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:border-[#1e40af]"
                               placeholder="000000">
                    </div>
                    
                    <div class="flex gap-3">
                        <button onclick="cancelTOTP()" 
                                class="flex-1 py-3 border border-slate-300 rounded-2xl text-sm font-medium hover:bg-slate-50">
                            Hủy
                        </button>
                        <button onclick="verifyRealTOTP('${user.username}')" 
                                class="flex-1 py-3 bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-2xl text-sm font-semibold">
                            Xác nhận
                        </button>
                    </div>
                    
                    <div class="mt-4 text-center text-xs text-slate-500">
                        Mã thay đổi mỗi 30 giây
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    setTimeout(() => {
        const input = document.getElementById('totp-code');
        if (input) input.focus();
    }, 100);
}

function verifyRealTOTP(username) {
    const inputCode = document.getElementById('totp-code').value.trim();
    const user = demoUsers.find(u => u.username === username);
    
    if (!user || !user.totpSecret) {
        alert("Tài khoản này chưa bật TOTP.");
        cancelTOTP();
        return;
    }
    
    try {
        // Sử dụng thư viện OTPAuth để xác minh
        const totp = new OTPAuth.TOTP({
            issuer: "VKSND Can Tho",
            label: user.username,
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: user.totpSecret
        });
        
        const isValid = totp.validate({ token: inputCode, window: 1 }) !== null;
        
        if (isValid) {
            // Thành công
            currentUser = user;
            localStorage.setItem('vks_current_user', JSON.stringify(user));
            
            document.getElementById('totp-modal').remove();
            document.getElementById('login-overlay').style.display = 'none';
            
            showUserInfo(user);
            showToast(`Đăng nhập thành công với TOTP! Xin chào ${user.name}`);
            
            setTimeout(() => switchTab(1), 500);
        } else {
            alert("Mã TOTP không đúng hoặc đã hết hạn. Vui lòng thử lại.");
        }
    } catch (error) {
        console.error(error);
        alert("Lỗi xác thực TOTP. Vui lòng kiểm tra lại.");
    }
}

function cancelTOTP() {
    const modal = document.getElementById('totp-modal');
    if (modal) modal.remove();
    pendingUser = null;
}

function showUserInfo(user) {
    const userInfoDiv = document.getElementById('user-info');
    const nameSpan = document.getElementById('user-name');
    const roleSpan = document.getElementById('user-role');

    if (userInfoDiv && nameSpan && roleSpan) {
        nameSpan.textContent = user.name.split(' ').slice(-2).join(' '); // Tên ngắn
        roleSpan.textContent = `${user.displayRole} • ${user.phong}`;
        userInfoDiv.classList.remove('hidden');
        userInfoDiv.classList.add('flex');
    }
}

function logout() {
    if (!confirm('Bạn có chắc muốn đăng xuất?')) return;

    currentUser = null;
    localStorage.removeItem('vks_current_user');
    
    const overlay = document.getElementById('login-overlay');
    overlay.style.display = 'flex';
    
    const userInfoDiv = document.getElementById('user-info');
    if (userInfoDiv) {
        userInfoDiv.classList.remove('flex');
        userInfoDiv.classList.add('hidden');
    }
    
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    showToast('Đã đăng xuất.');
}

// Phân quyền đơn giản
function hasPermission(requiredRole) {
    if (!currentUser) return false;
    
    const roleHierarchy = {
        'member': 1,
        'leader': 2,
        'admin': 3
    };
    
    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
}

function checkLoginStatus() {
    const savedUser = localStorage.getItem('vks_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('login-overlay').style.display = 'none';
        showUserInfo(currentUser);
    }
}