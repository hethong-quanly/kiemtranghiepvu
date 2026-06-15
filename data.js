// js/data.js - Dữ liệu hỗ trợ đa năm (2026, 2027, ...)

let CURRENT_YEAR = new Date().getFullYear(); // Tự động lấy năm hiện tại, có thể override

// Lấy năm từ localStorage nếu có (để test chuyển năm)
const savedYear = localStorage.getItem('vks_current_year');
if (savedYear) CURRENT_YEAR = parseInt(savedYear);

// Demo users ban đầu (sẽ được merge với localStorage)
const baseDemoUsers = [
    { 
        username: "ksv1", 
        password: "123456", 
        name: "Kiểm sát viên Nguyễn Văn A", 
        role: "member", 
        phong: "Phòng 1",
        displayRole: "Thành viên đoàn"
    },
    { 
        username: "ksv2", 
        password: "123456", 
        name: "Kiểm sát viên Trần Thị B", 
        role: "member", 
        phong: "Phòng 7",
        displayRole: "Thành viên đoàn"
    },
    { 
        username: "truongdoan", 
        password: "admin2026", 
        name: "Trưởng đoàn kiểm tra Lê Văn C", 
        role: "leader", 
        phong: "Ban lãnh đạo",
        displayRole: "Trưởng đoàn"
    },
    { 
        username: "admin", 
        password: "vks2026", 
        name: "Quản trị viên Hệ thống", 
        role: "admin", 
        phong: "Văn phòng",
        displayRole: "Admin"
    }
];

// Danh mục hồ sơ bắt buộc (rút gọn)
const danhMucData = [
    {id:1, phong:"Phòng 1", loai:"Hồ sơ vụ án bị trả hồ sơ điều tra bổ sung", nhom:"Bắt buộc 100%"},
    {id:2, phong:"Phòng 1", loai:"Hồ sơ vụ án đình chỉ (không phạm tội / miễn TNHS sai)", nhom:"Bắt buộc 100%"},
    {id:3, phong:"Phòng 7", loai:"Hồ sơ xét xử áp dụng án treo, hạ khung, phạt tiền", nhom:"Bắt buộc 100%"},
    {id:4, phong:"Phòng 9", loai:"Hồ sơ án dân sự VKS tham gia phiên tòa sơ thẩm", nhom:"Bắt buộc 100%"},
    {id:5, phong:"Phòng 11", loai:"Hồ sơ kiểm sát THADS/THAHC (cưỡng chế, khiếu nại)", nhom:"Bắt buộc 100%"},
    // ... thêm nếu cần
];

// Kỹ năng kiểm tra mẫu (rút gọn)
const kyNangData = [
    {
        id: 1, 
        phong: "Phòng 1", 
        khau: "Tiếp nhận nguồn tin",
        noidung: "Kiểm tra tính kịp thời tiếp nhận và vào sổ thụ lý trên phần mềm QL án",
        mucdo: "Nghiêm trọng"
    },
    {
        id: 2, 
        phong: "Phòng 1", 
        khau: "Kiểm sát điều tra",
        noidung: "Kiểm tra việc phê chuẩn QĐ tố tụng và xác định lỗi KSV trong án trả ĐTB",
        mucdo: "Nghiêm trọng"
    },
    {
        id: 3, 
        phong: "Phòng 7", 
        khau: "Kiểm sát xét xử",
        noidung: "Kiểm tra căn cứ áp dụng án treo, hạ khung và quan điểm VKS tại phiên tòa",
        mucdo: "Nghiêm trọng"
    },
    {
        id: 4, 
        phong: "Phòng 11", 
        khau: "Kiểm sát thi hành án",
        noidung: "Kiểm tra QĐ thi hành án có đúng nội dung bản án của Tòa không",
        mucdo: "Nghiêm trọng"
    }
];

// ==================== HỖ TRỢ ĐA NĂM ====================

/**
 * Lấy dữ liệu cho một năm cụ thể từ localStorage
 * Nếu chưa có thì trả về dữ liệu mặc định của năm đó
 */
function getYearData(year) {
    const key = `vks_data_${year}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
        return JSON.parse(saved);
    }
    
    // Dữ liệu mặc định cho năm mới
    return {
        year: year,
        danhMuc: JSON.parse(JSON.stringify(danhMucData)), // clone
        kyNang: JSON.parse(JSON.stringify(kyNangData)),
        lastUpdated: new Date().toISOString()
    };
}

/**
 * Lưu dữ liệu cho một năm
 */
function saveYearData(year, data) {
    const key = `vks_data_${year}`;
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Lấy danh sách các năm đã có dữ liệu
 */
function getAvailableYears() {
    const years = [];
    for (let i = 2025; i <= 2035; i++) {
        if (localStorage.getItem(`vks_data_${i}`)) {
            years.push(i);
        }
    }
    if (!years.includes(2026)) years.unshift(2026); // Đảm bảo có 2026
    return years.sort((a, b) => b - a);
}