// dao.js

const sqlite3 = require('sqlite3')
const Promise = require('bluebird')

class AppDAO {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, (err) => {  //cần truyền vào một đường dẫn đến file csdl sqlite để khởi tạo một kết nối đến file để bắt đầu đọc ghi
            if (err) {
                console.log('Could not connect to database', err)   //Kết nối chưa thành công, có lỗi
            } else {
                console.log('Connected to database')   //Đã kết nối thành công và sẵn sàng để đọc ghi DB
            }
        })
    }

    runquery(sql, params = []) {  //Hàm do ta tự đặt tên gồm 2 tham số truyền vào.
        return new Promise((resolve, reject) => {   //Tạo mới một Promise thực thi câu lệnh sql
            this.db.run(sql, params, function (err) {   //this.db sẽ là biến đã kết nối csdl, ta gọi hàm run của this.db chính là gọi hàm run của sqlite3 trong NodeJS hỗ trợ (1 trong 3 hàm như đã nói ở trên)
                if (err) {   //Trường hợp lỗi
                    console.log('Error running sql ' + sql)
                    console.log(err)
                    reject(err)
                } else {   //Trường hợp chạy query thành công
                    resolve({ id: this.lastID })   //Trả về kết quả là một object có id lấy từ DB.
                }
            })
        })
    }
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.get(sql, params, (err, result) => {
            if (err) {
              console.log('Error running sql: ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve(result)
            }
          })
        })
      }
}

module.exports = AppDAO    //Cần phải exports (mở) cái class  này để một class bất kỳ có thể khởi tạo AppDAO và bắt đầu dùng kết nối đã được mở bên trên (biến this.db)