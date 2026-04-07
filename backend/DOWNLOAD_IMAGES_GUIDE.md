# Hướng dẫn Tải ảnh Xe Tự Động

Script này sẽ tự động tìm ảnh ngoại thất, nội thất, và các góc khác của các xe trên Pexels/Unsplash, rồi thêm vào database.

## Chuẩn bị

### 1. Lấy API Key từ Pexels (Miễn phí)

1. Truy cập: https://www.pexels.com/api/
2. Đăng ký/Đăng nhập
3. Tạo Application
4. Copy **API Key**

### 2. (Tùy chọn) Lấy API Key từ Unsplash

1. Truy cập: https://unsplash.com/oauth/applications
2. Đăng ký/Đăng nhập
3. Tạo Application
4. Copy **Access Key**

### 3. Cấu hình .env

1. Copy `.env.example` thành `.env`:
```bash
cp .env.example .env
```

2. Thêm API Key vào file `.env`:
```env
PEXELS_API_KEY=YOUR_PEXELS_KEY_HERE
UNSPLASH_API_KEY=YOUR_UNSPLASH_KEY_HERE  # Tùy chọn
```

## Chạy Script

### Option 1: Tải ảnh cho các xe còn trong dữ liệu
```bash
cd backend
npm run download-images
```

### Option 2: Chạy từ terminal (với ts-node)
```bash
cd backend
npx ts-node src/seed/download-car-images.ts
```

## Kết quả

Script sẽ:
- ✅ Kết nối tới MongoDB
- ✅ Lấy danh sách xe từ database
- ✅ Tìm ảnh từ Pexels/Unsplash cho mỗi xe
- ✅ Cập nhật các trường: `images`, `interiorImages`, `angleImages`
- ✅ Loại bỏ ảnh trùng lặp
- ✅ In ra báo cáo tổng kết

### Ví dụ Output:
```
✅ Connected to MongoDB

📍 Found 10 cars in database

🚗 Processing: Lamborghini Aventador SVJ
  🔍 Searching exterior images...
  ✅ Added 2 exterior images
  🔍 Searching interior images...
  ✅ Added 3 interior images
  ...
```

## Tùy chỉnh

Để thêm/sửa các xe hoặc từ khóa tìm kiếm, chỉnh sửa object `carsToUpdate` trong file:
- `backend/src/seed/download-car-images.ts`

```typescript
const carsToUpdate: CarsToUpdate = {
  'Lamborghini Aventador SVJ': {
    exterior: ['Lamborghini Aventador SVJ yellow sports car'],
    interior: ['luxury car interior leather seats'],
    angles: ['car side view', 'car rear view'],
  },
  // Thêm xe mới ở đây...
};
```

## Troubleshooting

### "No results found"
- Kiểm tra kết nối internet
- Kiểm tra API Key có hợp lệ không
- Thử từ khóa khác

### "Rate limit exceeded"
- Script tự động chờ 500ms giữa các request
- Nếu vẫn bị, hãy chờ vài phút và chạy lại

### "Connection refused"
- Kiểm tra MongoDB đang chạy không
- Kiểm tra MONGODB_URI trong .env
