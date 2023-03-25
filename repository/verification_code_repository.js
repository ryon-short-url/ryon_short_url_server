// project_repository.js

class VerificationCodeRepository {
    constructor(dao) {      //Đểkhởi tạo một đối tượng từ class ProjectRepository chúng ta cần truyền một đối tượng AppDAO cho nó
        this.dao = dao
    }

    createTable() {   //Hàm tạo bảng này sẽ dùng để tạo ra cấu trúc bảng projects nếu trong file csdl sqlite3 chưa có bảng này.
        const sql = `
      CREATE TABLE IF NOT EXISTS verification_code (
        CODE CHAR(6) PRIMARY KEY NOT NULL,
        TIMESTAMP DATETIME DEFAULT CURRENT_TIMESTAMP)`
        return this.dao.runquery(sql)
    }

    create(code) {
        return this.dao.runquery(
            'INSERT INTO verification_code (CODE) VALUES (?)',
            [code])
    }
    delete(id) {
        return this.dao.runquery(
            `DELETE FROM projects WHERE id = ?`,
            [id]
        )
    }
    getById(code) {
        return this.dao.get(
            `SELECT count(*) as count FROM verification_code WHERE CODE = ?`,
            [code])
    }
}

module.exports = VerificationCodeRepository;