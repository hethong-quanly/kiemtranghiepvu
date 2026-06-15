// js/auth.js - Xử lý đăng nhập và phân quyền

let currentUser = null;

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const user = demoUsers.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('vks_current_user', JSON.stringify(user));
        
        document.getElementById('login-overlay').style.display = 'none';
        showUserInfo(user);
        showToast(`Xin chào ${user.name}!`);
        
        // Chuyển sang tab chính sau khi đăng nhập
        setTimeout(() => {
            switchTab(1);
        }, 600);
    } else {
        alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
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