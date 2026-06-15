# Phần mềm Kiểm tra VKSND TP.CT 2026

Hệ thống hỗ trợ công tác kiểm tra toàn diện của Viện Kiểm sát Nhân dân Khu vực - Thành phố Cần Thơ.

## Tính năng chính

- **Đăng nhập thành viên** với phân quyền:
  - `member` (Thành viên đoàn): Chỉ xem/sửa lịch sử của chính mình
  - `leader` (Trưởng đoàn): Xem toàn bộ lịch sử đoàn
  - `admin`: Toàn quyền quản lý

- **Lưu lịch sử kiểm tra theo từng thành viên**
- **Bảng kỹ năng kiểm tra** chi tiết theo khâu nghiệp vụ
- **Phiếu kiểm tra động** có thể lưu tại chỗ
- **Giao diện hiện đại**, dễ sử dụng trên máy tính và tablet

## Cài đặt & Triển khai

### Cách 1: Mở trực tiếp
Mở file `index.html` bằng trình duyệt.

### Cách 2: Triển khai GitHub Pages
1. Tải toàn bộ thư mục `vks-kiem-tra-2026`
2. Đẩy lên GitHub repository
3. Bật GitHub Pages (Settings → Pages → Source: root)

### Cách 3: Nhúng vào website VKS
Copy toàn bộ thư mục vào một thư mục con trên website chính thức.

## Tài khoản demo

| Username     | Password   | Vai trò       |
|--------------|------------|---------------|
| ksv1         | 123456     | Thành viên    |
| truongdoan   | admin2026  | Trưởng đoàn   |
| admin        | vks2026    | Admin         |

## Cấu trúc thư mục

```
vks-kiem-tra-2026/
├── index.html
├── css/main.css
├── js/
│   ├── data.js
│   ├── auth.js
│   ├── storage.js
│   └── app.js
└── README.md
```

## Lưu ý

- Dữ liệu được lưu trong trình duyệt (localStorage)
- Phù hợp sử dụng nội bộ, không thay thế hệ thống chính thức
- Có thể mở rộng kết nối API backend sau này

---
© 2026 - Viện Kiểm sát Nhân dân Thành phố Cần Thơ
