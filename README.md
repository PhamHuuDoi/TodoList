                              Ứng dụng Quản Lý Công Việc (Todo List)
-----------------------------------------------------------------------------------------------------------------------------------
Giới thiệu dự án:
Dự án Todo List là ứng dụng web giúp người dùng quản lý công việc cá nhân một cách hiệu quả.
Hệ thống cho phép đăng ký, đăng nhập và thực hiện các chức năng thêm, sửa, xóa, theo dõi trạng thái công việc.
Ứng dụng được xây dựng theo mô hình Fullstack (MERN):
Frontend: ReactJS
Backend: NodeJS (ExpressJS)
Database: MongoDB
Xác thực: JWT
Hỗ trợ: Gửi email quên mật khẩu
---------------------------------------------------------------------------------------------------------------------------------
Hướng dẫn cài đặt
Bước 1: Clone dự án 
  git clone https://github.com/PhamHuuDoi/TodoList.git
  cd TodoList
Bước 2: Cài đặt backend
  cd backend
  npm install
  Tạo file .env với các biến môi trường
  
  PORT=5000 
  MONGO_URI= MONGO_URI của bạn 
  JWT_SECRET=supersecret123
  EMAIL_USER= yourname@gmail.com
  EMAIL_PASS= mật khẩu ứng dụng 
    ( Tạo mạt khẩu ứng dụng tại đây 
      https://myaccount.google.com/apppasswords 
      điều kiện bắt buộc là tài khoản google của bạn phải bật xác minh 2 bước )
  CLIENT_URL=http://localhost:5173
Bước 3: Cài đặt fronend
  cd ../frontend
  npm install
---------------------------------------------------------------------------------------------------------------------------------
Cách chạy dự án
  Mở terminal TodoList để chạy backend
    cd backend
    npm run dev
  Mở thêm 1 terminal để chạy fontend
    cd fontend
    npm run dev
---------------------------------------------------------------------------------------------------------------------------------
Truy cập hệ thống
  Frontend:
    http://localhost:5173
  Backend API:
    http://localhost:5000

