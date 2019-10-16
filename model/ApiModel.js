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
        let sql2 = `SELECT * FROM mh_all WHERE href="${href}" AND title="${title}";`;
        let sql = `INSERT INTO mh_all(id,img,title,new_zj,href) VALUES(null,"${titImg}","${tit}","${new_zj}","${href}");`;
        db.query(sql2, (err, data) => {
            if (!err && data.length === 0) {
                db.query(sql);
                fn(err, data)
            }
        })
    },
    //新增章节
    addList(req) {
        let { parentId, parentTit, list_id, title } = req;
        let sql2 = `SELECT * FROM mh_list WHERE list_id="${list_id}" AND parentId="${parentId}";`;
        let sql = `INSERT INTO mh_list VALUES(null,"${parentId}","${parentTit}","${list_id}","${title}");`;
        db.query(sql2, (err, data) => {
            if (!err && data.length === 0) {
                db.query(sql);
            }
        })
    },
    //新增详情图片
    addDetailDb(req) {
        let { parentId, imgUrl, page } = req;
        let sql2 = `SELECT * FROM mh_details WHERE parentId="${parentId}" AND img_url="${imgUrl}";`;
        let sql = `INSERT INTO mh_details VALUES(null,"${imgUrl}","${parentId}","${page}");`;
        db.query(sql2, (err, data) => {
            if (!err && data.length === 0) {
                db.query(sql);
            }
        })
    },
    updated(req) {
        let { img, title, c_type, author, isEnd, listType, gx_time, tips, mh_id } = req;
        let sql = `UPDATE mh_all SET 
        img="${img}",
        title="${title}",
        c_type="${c_type}",
        author="${author}",
        isEnd="${isEnd}",
        listType="${listType}",
        gx_time="${gx_time}",
        tips="${tips}" 
        WHERE mh_id = "${mh_id}";`;
        db.query(sql);
    },
};

module.exports = loginModel;
