// js/storage.js - Lưu trữ lịch sử kiểm tra theo từng thành viên

const STORAGE_KEY = 'vks_inspections';

// Lưu phiếu kiểm tra (gắn với user hiện tại)
function saveInspection(inspectionData) {
    if (!currentUser) {
        alert("Vui lòng đăng nhập trước khi lưu phiếu!");
        return false;
    }

    let allInspections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const newRecord = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        userId: currentUser.username,
        userName: currentUser.name,
        userRole: currentUser.role,
        phong: currentUser.phong,
        ...inspectionData
    };
    
    allInspections.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allInspections));
    
    showToast("Đã lưu phiếu kiểm tra thành công!");
    return true;
}

// Lấy lịch sử theo user hiện tại
function getMyInspections() {
    if (!currentUser) return [];
    
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return all.filter(item => item.userId === currentUser.username);
}

// Lấy tất cả lịch sử (chỉ Trưởng đoàn / Admin)
function getAllInspections() {
    if (!currentUser || !hasPermission('leader')) {
        return [];
    }
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

// Xóa một phiếu (chỉ xóa của chính mình hoặc Admin)
function deleteInspection(id) {
    let all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const record = all.find(r => r.id === id);
    if (!record) return false;

    const canDelete = currentUser.username === record.userId || currentUser.role === 'admin';
    
    if (!canDelete) {
        alert("Bạn không có quyền xóa phiếu này!");
        return false;
    }

    all = all.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return true;
}