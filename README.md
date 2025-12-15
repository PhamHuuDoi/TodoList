                                                    Ứng dụng Quản Lý Công Việc (Todo List)
 
Giới thiệu dự án              
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Dự án Todo List là ứng dụng web giúp người dùng quản lý công việc cá nhân một cách hiệu quả.
  Hệ thống cho phép người dùng đăng ký, đăng nhập và thực hiện các chức năng thêm, sửa, xóa và theo dõi trạng thái công việc.
  
  Ứng dụng được xây dựng theo mô hình Fullstack (MERN):
  
  Frontend: ReactJS
  
  Backend: NodeJS (ExpressJS)
  
  Database: MongoDB
  
  Xác thực: JWT
  
  Hỗ trợ: Gửi email quên mật khẩu

Hướng dẫn cài đặt
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


  Bước 1: Clone dự án
  
    git clone https://github.com/PhamHuuDoi/TodoList.git
    
    cd TodoList
  
  Bước 2: Cài đặt Backend
  
    cd backend
    
    npm install
  
  
    Tạo file .env trong thư mục backend với nội dung sau:
    
    PORT=5000
    
    MONGO_URI=your_mongo_uri
    
    JWT_SECRET=supersecret123
    
    EMAIL_USER=yourname@gmail.com
    
    EMAIL_PASS=your_app_password
    
    CLIENT_URL=http://localhost:5173
  
  
  Lưu ý:
  
    EMAIL_PASS là mật khẩu ứng dụng Gmail
    
    Tạo tại: https://myaccount.google.com/apppasswords
    
    Tài khoản Google phải bật xác minh 2 bước
  
  Bước 3: Cài đặt Frontend
   
    cd ../frontend
    
    npm install
  
 Cách chạy dự án
  
  Chạy Backend
  
    cd backend
    
    npm run dev
  
  Chạy Frontend
  
    cd frontend
    
    npm run dev
  
  
  Truy cập hệ thống
  
    Frontend: http://localhost:5173
    
    Backend API: http://localhost:5000

  Ghi chú
  
    Đảm bảo MongoDB đang chạy trước khi khởi động backend
    
    Không sử dụng mật khẩu Gmail thông thường cho EMAIL_PASS
    
    Dự án phù hợp cho mục đích học tập và làm đồ án môn học
