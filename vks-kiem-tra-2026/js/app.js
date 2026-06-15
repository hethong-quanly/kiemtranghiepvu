// js/app.js - Main application logic

let currentYear = 2026;

function initializeTailwind() {
    // Tailwind already loaded via CDN
}

// Thêm bộ chọn năm vào header (gọi từ HTML hoặc JS)
function initYearSelector() {
    const headerRight = document.querySelector('header .flex.items-center.gap-x-3');
    if (!headerRight) return;

    const yearDiv = document.createElement('div');
    yearDiv.className = 'flex items-center gap-x-2 bg-white/10 px-3 py-1.5 rounded-3xl text-sm';
    yearDiv.innerHTML = `
        <span class="text-blue-200 text-xs">Năm:</span>
        <select id="year-selector" class="bg-white/90 text-[#1e40af] font-semibold px-3 py-0.5 rounded-2xl text-sm outline-none">
            <!-- Options sẽ được thêm bằng JS -->
        </select>
    `;
    headerRight.prepend(yearDiv);

    const selector = document.getElementById('year-selector');
    
    // Thêm các năm
    const years = getAvailableYears();
    years.forEach(y => {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        if (y === currentYear) opt.selected = true;
        selector.appendChild(opt);
    });

    // Thêm option tạo năm mới
    const newOpt = document.createElement('option');
    newOpt.value = 'new';
    newOpt.textContent = '+ Tạo năm mới...';
    selector.appendChild(newOpt);

    selector.onchange = () => {
        if (selector.value === 'new') {
            const newYear = prompt('Nhập năm mới (ví dụ: 2027):');
            if (newYear && !isNaN(newYear)) {
                currentYear = parseInt(newYear);
                // Tạo dữ liệu mặc định cho năm mới
                const newData = getYearData(currentYear);
                saveYearData(currentYear, newData);
                location.reload(); // Reload để cập nhật
            } else {
                selector.value = currentYear;
            }
        } else {
            currentYear = parseInt(selector.value);
            // Reload dữ liệu theo năm mới
            renderDanhMuc();
            renderKyNang();
            if (document.getElementById('section-4').classList.contains('active')) {
                renderHistory();
            }
        }
    };
}

function switchTab(tabIndex) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('[id^="tab-"]').forEach(t => t.classList.remove('active', 'bg-white', 'shadow-sm'));
    
    document.getElementById('section-' + tabIndex).classList.add('active');
    const activeTab = document.getElementById('tab-' + tabIndex);
    if (activeTab) activeTab.classList.add('active', 'bg-white', 'shadow-sm');
    
    // Load data when switching to certain tabs
    if (tabIndex === 1) renderDanhMuc();
    if (tabIndex === 2) renderKyNang();
    if (tabIndex === 4) renderHistory();
}

function renderDanhMuc() {
    const container = document.getElementById('danh-muc-container');
    if (!container) return;

    const yearData = getYearData(currentYear);
    const data = yearData.danhMuc || [];

    let html = `<div class="flex justify-between items-center mb-4">
        <div>
            <span class="font-semibold">Năm ${currentYear}</span>
            ${hasPermission('leader') ? 
                `<button onclick="showManageContentModal()" class="ml-3 text-xs px-3 py-1 bg-blue-600 text-white rounded-2xl">Quản lý nội dung</button>` : ''}
        </div>
    </div>`;

    if (data.length === 0) {
        html += `<p class="text-sm text-slate-500">Chưa có danh mục cho năm ${currentYear}. Hãy vào "Quản lý nội dung" để thêm.</p>`;
    } else {
        html += `<table class="w-full text-sm"><thead><tr class="bg-slate-100">
            <th class="p-3 text-left">Phòng</th>
            <th class="p-3 text-left">Loại hồ sơ</th>
            <th class="p-3 text-center">Nhóm</th>
        </tr></thead><tbody>`;

        data.forEach(item => {
            html += `<tr class="border-b">
                <td class="p-3">${item.phong}</td>
                <td class="p-3">${item.loai}</td>
                <td class="p-3 text-center"><span class="px-3 py-1 text-xs rounded-2xl bg-red-100 text-red-700">${item.nhom || 'Bắt buộc'}</span></td>
            </tr>`;
        });

        html += `</tbody></table>`;
    }
    container.innerHTML = html;
}

function renderKyNang() {
    const container = document.getElementById('ky-nang-container');
    if (!container) return;

    let html = `<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="bg-slate-100">
        <th class="p-3">Phòng</th>
        <th class="p-3">Nội dung kiểm tra</th>
        <th class="p-3 text-center">Mức độ</th>
    </tr></thead><tbody>`;

    kyNangData.forEach(item => {
        const color = item.mucdo === 'Nghiêm trọng' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';
        html += `<tr class="border-b">
            <td class="p-3 font-medium">${item.phong}</td>
            <td class="p-3">${item.noidung}</td>
            <td class="p-3 text-center"><span class="px-3 py-1 text-xs rounded-2xl ${color}">${item.mucdo}</span></td>
        </tr>`;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

// Demo save function for testing
function quickSaveDemoInspection() {
    if (!currentUser) {
        alert("Vui lòng đăng nhập trước!");
        return;
    }

    const demoData = {
        fileInfo: "Vụ án demo 45/HSST-2026",
        phong: currentUser.phong,
        items: [
            { content: "Kiểm tra hồ sơ trả ĐTB", result: "Đạt", note: "" },
            { content: "Kiểm tra chất lượng Cáo trạng", result: "Đạt một phần", note: "Cần bổ sung thêm chứng cứ" }
        ],
        summary: "2 nội dung • 0 vi phạm nghiêm trọng"
    };

    const success = saveInspection(demoData);
    if (success) {
        // Auto switch to history tab
        setTimeout(() => {
            switchTab(4);
        }, 800);
    }
}

// Render Lịch sử kiểm tra (theo phân quyền)
function renderHistory() {
    const container = document.getElementById('history-container');
    const badge = document.getElementById('history-role-badge');
    if (!container || !currentUser) return;

    let inspections = [];
    let title = '';

    if (hasPermission('leader')) {
        inspections = getAllInspections();
        title = 'Toàn bộ lịch sử đoàn kiểm tra';
        badge.textContent = 'Toàn quyền xem';
        badge.className = 'ml-2 text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-2xl';
    } else {
        inspections = getMyInspections();
        title = 'Lịch sử kiểm tra của tôi';
        badge.textContent = 'Chỉ xem của mình';
        badge.className = 'ml-2 text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-2xl';
    }

    if (inspections.length === 0) {
        container.innerHTML = `<div class="text-center py-8 text-slate-500">Chưa có phiếu kiểm tra nào được lưu.</div>`;
        return;
    }

    let html = `<div class="text-sm mb-3 font-medium">${title} (${inspections.length} phiếu)</div>`;
    html += `<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="bg-slate-100">
        <th class="p-3 text-left">Thời gian</th>
        <th class="p-3 text-left">Hồ sơ</th>
        <th class="p-3">Người thực hiện</th>
        <th class="p-3 text-center">Kết quả</th>
        <th class="p-3 w-16"></th>
    </tr></thead><tbody>`;

    inspections.forEach(item => {
        const date = new Date(item.timestamp).toLocaleDateString('vi-VN');
        html += `<tr class="border-b hover:bg-slate-50">
            <td class="p-3 text-xs">${date}</td>
            <td class="p-3 font-medium">${item.fileInfo || 'Không rõ'}</td>
            <td class="p-3 text-xs">${item.userName}</td>
            <td class="p-3 text-center"><span class="px-2 py-0.5 text-xs rounded bg-emerald-100 text-emerald-700">${item.summary || ''}</span></td>
            <td class="p-3 text-center">
                <button onclick="deleteInspectionAndRefresh(${item.id})" class="text-red-500 hover:text-red-700 text-xs">Xóa</button>
            </td>
        </tr>`;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

function deleteInspectionAndRefresh(id) {
    if (deleteInspection(id)) {
        showToast("Đã xóa phiếu.");
        renderHistory();
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-5 right-5 bg-emerald-600 text-white px-6 py-3 rounded-3xl shadow-xl flex items-center gap-x-3 text-sm z-[300]`;
    toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = 'all .3s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function showHelp() {
    alert("Phần mềm hỗ trợ kiểm tra VKSND Khu vực 2026.\n\nSử dụng tài khoản demo để đăng nhập và trải nghiệm đầy đủ tính năng.");
}

// Modal Quản lý nội dung (chỉ leader/admin)
function showManageContentModal() {
    if (!hasPermission('leader')) {
        alert("Chỉ Trưởng đoàn và Admin mới được quản lý nội dung!");
        return;
    }

    const yearData = getYearData(currentYear);
    
    const modalHTML = `
        <div class="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4" onclick="this.remove()">
            <div onclick="event.stopImmediatePropagation()" class="bg-white w-full max-w-2xl rounded-3xl shadow-xl p-6 max-h-[85vh] overflow-auto">
                <h3 class="text-xl font-bold mb-4">Quản lý nội dung kiểm tra năm ${currentYear}</h3>
                
                <div class="mb-6">
                    <h4 class="font-semibold mb-2">Danh mục hồ sơ</h4>
                    <div id="manage-danhmuc-list" class="space-y-2 text-sm"></div>
                    <button onclick="addNewDanhMucItem()" class="mt-2 text-xs px-3 py-1 bg-blue-600 text-white rounded-2xl">+ Thêm danh mục mới</button>
                </div>

                <div>
                    <h4 class="font-semibold mb-2">Kỹ năng kiểm tra</h4>
                    <div id="manage-kynang-list" class="space-y-2 text-sm"></div>
                    <button onclick="addNewKyNangItem()" class="mt-2 text-xs px-3 py-1 bg-blue-600 text-white rounded-2xl">+ Thêm kỹ năng mới</button>
                </div>

                <div class="mt-6 flex justify-end gap-x-3">
                    <button onclick="this.closest('.fixed').remove()" class="px-6 py-2 border rounded-2xl">Đóng</button>
                    <button onclick="saveManagedContent(this)" class="px-6 py-2 bg-emerald-600 text-white rounded-2xl">Lưu thay đổi</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Render current data into modal (simplified)
    setTimeout(() => {
        renderManageLists(yearData);
    }, 100);
}

function renderManageLists(yearData) {
    // Simplified rendering for demo
    const dmContainer = document.getElementById('manage-danhmuc-list');
    const knContainer = document.getElementById('manage-kynang-list');
    
    if (dmContainer) {
        dmContainer.innerHTML = yearData.danhMuc.map((item, idx) => 
            `<div class="flex justify-between border p-2 rounded">${item.loai} <button onclick="removeItem('danhMuc', ${idx}, this)" class="text-red-500">×</button></div>`
        ).join('');
    }
    
    if (knContainer) {
        knContainer.innerHTML = yearData.kyNang.map((item, idx) => 
            `<div class="flex justify-between border p-2 rounded">${item.noidung} <button onclick="removeItem('kyNang', ${idx}, this)" class="text-red-500">×</button></div>`
        ).join('');
    }
}

function addNewDanhMucItem() {
    const loai = prompt("Nhập loại hồ sơ mới:");
    if (!loai) return;
    
    const yearData = getYearData(currentYear);
    yearData.danhMuc.push({
        id: Date.now(),
        phong: "Phòng mới",
        loai: loai,
        nhom: "Bắt buộc 100%"
    });
    saveYearData(currentYear, yearData);
    // Re-render modal
    document.querySelector('.fixed').remove();
    showManageContentModal();
}

function addNewKyNangItem() {
    const noidung = prompt("Nhập nội dung kỹ năng kiểm tra mới:");
    if (!noidung) return;
    
    const yearData = getYearData(currentYear);
    yearData.kyNang.push({
        id: Date.now(),
        phong: "Phòng mới",
        khau: "Khâu mới",
        noidung: noidung,
        mucdo: "Trung bình"
    });
    saveYearData(currentYear, yearData);
    document.querySelector('.fixed').remove();
    showManageContentModal();
}

function removeItem(type, index, btn) {
    if (!confirm("Xóa mục này?")) return;
    
    const yearData = getYearData(currentYear);
    if (type === 'danhMuc') yearData.danhMuc.splice(index, 1);
    if (type === 'kyNang') yearData.kyNang.splice(index, 1);
    
    saveYearData(currentYear, yearData);
    btn.closest('div').remove();
}

function saveManagedContent(btn) {
    // Dữ liệu đã được lưu real-time khi thêm/xóa
    btn.closest('.fixed').remove();
    showToast("Đã lưu thay đổi nội dung năm " + currentYear);
    // Refresh current tab
    const activeSection = document.querySelector('.section.active');
    if (activeSection && activeSection.id === 'section-1') renderDanhMuc();
    if (activeSection && activeSection.id === 'section-2') renderKyNang();
}

// Khởi động
function bootstrapMultiFileApp() {
    initializeTailwind();
    
    // Check login
    if (typeof checkLoginStatus === 'function') {
        checkLoginStatus();
    }
    
    // Khởi tạo bộ chọn năm
    if (typeof initYearSelector === 'function') {
        initYearSelector();
    }
    
    // Mặc định tab Hướng dẫn
    const firstTab = document.getElementById('tab-0');
    if (firstTab) firstTab.classList.add('active', 'bg-white', 'shadow-sm');
    
    console.log('%c[Multi-file] Phần mềm VKS Kiểm tra đa năm đã sẵn sàng.', 'color:#166534');
}

window.onload = bootstrapMultiFileApp;