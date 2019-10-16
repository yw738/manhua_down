var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mhapp'
});

var loginModel = {
    //新增列表
    add(req, fn) {
        let { href, titImg, tit, new_zj } = req;
        let sql = `INSERT INTO mh_all(id,img,title,new_zj,href) VALUES(null,"${titImg}","${tit}","${new_zj}","${href}");`;
        db.query(sql, function (err, data) {
            fn(err, data)
        })
    },
    //新增章节
    addList(req) {
        let { parentId, parentTit, list_id, title } = req;
        let sql = `INSERT INTO mh_list VALUES(null,"${parentId}","${parentTit}","${list_id}","${title}");`;
        db.query(sql);
    },
    //新增详情图片
    addDetailDb(req){
        let { parentId, imgUrl,page } = req;
        let sql = `INSERT INTO mh_details VALUES(null,"${imgUrl}","${parentId}","${page}");`;
        db.query(sql);
    },
    updated(req) {
        
    },
};

module.exports = loginModel;
