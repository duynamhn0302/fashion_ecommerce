const db = require('../utils/db');
const { paginate } = require('./../config/default.json');

module.exports = {
    async allShop(){
        const sql = `select * from cuahang`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },
    async topNShop(n){
        const sql = `select cuahang.*, SUM(sp.tong) as soluong, SUM(sp.tonggiatien) as doanhso
        from (select chitietdonhang.sanpham , sum(chitietdonhang.soluong) as tong, donhang.tonggiatien
            from (donhang join chitietdonhang on donhang.maso = chitietdonhang.donhang)
            where donhang.tinhtrangdon = 3
            GROUP BY chitietdonhang.sanpham) sp join sanpham on sp.sanpham = sanpham.maso 
                join cuahang on sanpham.cuahang = cuahang.maso
        GROUP BY cuahang.maso
        LIMIT ${n}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },
    async getCatByShopID(shopID){
        const sql = `SELECT temp1.danhmuccap1,c.ten as Cat
        FROM(
            SELECT danhmuccap2,danhmuccap1,d.ten as subCat
            FROM sanpham s join danhmuccap2 d on s.danhmuccap2=d.maso
            WHERE s.cuahang=${shopID}
            GROUP BY danhmuccap2,danhmuccap1) as temp1 join danhmuccap1 c on temp1.danhmuccap1=c.maso`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows;
    },
    async getSubCatByShopID(shopID){
        const sql = `SELECT danhmuccap2,danhmuccap1,d.ten as subCat
        FROM sanpham s join danhmuccap2 d on s.danhmuccap2=d.maso
        WHERE s.cuahang=${shopID}
        GROUP BY danhmuccap2,danhmuccap1`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows;
    },
    async getProductByShopID(shopID){
        const sql = `SELECT s.*,h.link FROM sanpham s join hinhanhsanpham h on s.maso=h.sanpham
        WHERE s.cuahang=${shopID}
        GROUP BY maso`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows;
    },
    async shopOfId(userId){
        const sql = `SELECT * FROM cuahang WHERE taikhoan = ${userId}`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },
    async countProductOfShop(shopID)
    {
        const sql = `SELECT COUNT(*) as SL
        FROM sanpham s join cuahang c on s.cuahang=c.maso
        WHERE s.cuahang=${shopID}`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },

    async getShopID(userID)
    {
        const sql = `SELECT c.maso
        FROM cuahang c
        WHERE c.taikhoan=${userID}`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },

    async getDetailBillInfo(BillID)
    {
        const sql = `SELECT temp.*,l.ten
        FROM
        (SELECT d.*,t.hoten,t.email,t.avatar,t.sdt
        FROM donhang d join taikhoan t on d.taikhoan = t.maso) as temp join loaitinhtrangdon l on temp.tinhtrangdon=l.maso
        WHERE temp.maso=${BillID}`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },

    async countStatusProduct(shopID, status)
    {
        const sql = `SELECT COUNT(*) as SoLuongDangDuyet
        FROM sanpham s
        WHERE s.cuahang=${shopID} and s.status=${status}`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },

    //Đếm các bill theo tình trạng
    async countStatusBill(shopID, status)
    {
        const sql = `SELECT COUNT(*) as SoLuong
        FROM(
                SELECT d.donhang
                FROM(
                        SELECT s.maso
                        FROM sanpham s join cuahang c on s.cuahang=c.maso
                        WHERE s.cuahang=${shopID} and s.status=1) as temp1 join chitietdonhang d on temp1.maso=d.sanpham
                        GROUP BY d.donhang) as temp2 join donhang k on temp2.donhang=k.maso
        WHERE k.tinhtrangdon=${status}`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },

    
    async getMoneyToday(shopID,dateToday)
    {
        const sql = `SELECT SUM(tonggiatien) as tongtien
        FROM (
            SELECT k.*
            FROM(
                    SELECT d.donhang
                    FROM(
                            SELECT s.maso
                            FROM sanpham s join cuahang c on s.cuahang=c.maso
                            WHERE s.cuahang=${shopID} and s.status=1) as temp1 join chitietdonhang d on temp1.maso=d.sanpham
                            GROUP BY d.donhang) as temp2 join donhang k on temp2.donhang=k.maso
            WHERE k.tinhtrangdon=3) temp3 join lichsutinhtrangdon t on temp3.maso=t.donhang and t.tinhtrang=3
        WHERE DATEDIFF(t.ngaythang,"${dateToday}")=0`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },

    async countBillToday(shopID,dateToday)
    {
        const sql = `SELECT COUNT(*) as tongDon
        FROM(
            SELECT temp4.*
            FROM(
                    SELECT temp3.donhang
                    FROM(
                        SELECT temp2.donhang,k.tongsosanpham,k.tonggiatien,k.tinhtrangdon
                        FROM(
                                                        SELECT d.donhang
                                                        FROM(
                                                                        SELECT s.maso
                                                                        FROM sanpham s join cuahang c on s.cuahang=c.maso
                                                                        WHERE s.cuahang=${shopID} and s.status=1) as temp1 join chitietdonhang d on temp1.maso=d.sanpham
                                                                        GROUP BY d.donhang) as temp2 join donhang k on temp2.donhang=k.maso) as temp3 join lichsutinhtrangdon c on c.donhang=temp3.donhang
                    WHERE DATEDIFF(c.ngaythang,${dateToday})=0
                    GROUP BY temp3.donhang
            ) as temp4
            WHERE temp4.donhang NOT IN(
        SELECT temp3.donhang
        FROM(
            SELECT temp2.donhang,k.tongsosanpham,k.tonggiatien,k.tinhtrangdon
            FROM(
                                            SELECT d.donhang
                                            FROM(
                                                            SELECT s.maso
                                                            FROM sanpham s join cuahang c on s.cuahang=c.maso
                                                            WHERE s.cuahang=${shopID} and s.status=1) as temp1 join chitietdonhang d on temp1.maso=d.sanpham
                                                            GROUP BY d.donhang) as temp2 join donhang k on temp2.donhang=k.maso) as temp3 join lichsutinhtrangdon c on c.donhang=temp3.donhang
        WHERE DATEDIFF(c.ngaythang,${dateToday})=0 AND c.tinhtrang=4
        GROUP BY temp3.donhang)) as temp5 join donhang d on temp5.donhang=d.maso`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },

    async countAmountProductSellingToday(shopID,dateToday)
    {
        const sql = `SELECT SUM(tongsosanpham) as tongSanPhamHomNay
        FROM(
            SELECT temp4.*
            FROM(
                    SELECT temp3.donhang
                    FROM(
                        SELECT temp2.donhang,k.tongsosanpham,k.tonggiatien,k.tinhtrangdon
                        FROM(
                                                        SELECT d.donhang
                                                        FROM(
                                                                        SELECT s.maso
                                                                        FROM sanpham s join cuahang c on s.cuahang=c.maso
                                                                        WHERE s.cuahang=${shopID} and s.status=1) as temp1 join chitietdonhang d on temp1.maso=d.sanpham
                                                                        GROUP BY d.donhang) as temp2 join donhang k on temp2.donhang=k.maso) as temp3 join lichsutinhtrangdon c on c.donhang=temp3.donhang
                    WHERE DATEDIFF(c.ngaythang,${dateToday})=0
                    GROUP BY temp3.donhang
            ) as temp4
            WHERE temp4.donhang NOT IN(
        SELECT temp3.donhang
        FROM(
            SELECT temp2.donhang,k.tongsosanpham,k.tonggiatien,k.tinhtrangdon
            FROM(
                                            SELECT d.donhang
                                            FROM(
                                                            SELECT s.maso
                                                            FROM sanpham s join cuahang c on s.cuahang=c.maso
                                                            WHERE s.cuahang=${shopID} and s.status=1) as temp1 join chitietdonhang d on temp1.maso=d.sanpham
                                                            GROUP BY d.donhang) as temp2 join donhang k on temp2.donhang=k.maso) as temp3 join lichsutinhtrangdon c on c.donhang=temp3.donhang
        WHERE DATEDIFF(c.ngaythang,${dateToday})=0 AND c.tinhtrang=4
        GROUP BY temp3.donhang)) as temp5 join donhang d on temp5.donhang=d.maso`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },

    async getMoneyMonth(shopID,dateToday)
    {
        const sql = `SELECT SUM(tonggiatien) as tongTienThang
        FROM(
            SELECT temp4.*
            FROM(
                    SELECT temp3.donhang
                    FROM(
                        SELECT temp2.donhang,k.tongsosanpham,k.tonggiatien,k.tinhtrangdon
                        FROM(
                                                        SELECT d.donhang
                                                        FROM(
                                                                        SELECT s.maso
                                                                        FROM sanpham s join cuahang c on s.cuahang=c.maso
                                                                        WHERE s.cuahang=${shopID} and s.status=1) as temp1 join chitietdonhang d on temp1.maso=d.sanpham
                                                                        GROUP BY d.donhang) as temp2 join donhang k on temp2.donhang=k.maso) as temp3 join lichsutinhtrangdon c on c.donhang=temp3.donhang
                    WHERE DATEDIFF(c.ngaythang,${dateToday})<=30
                    GROUP BY temp3.donhang
            ) as temp4
            WHERE temp4.donhang NOT IN(
        SELECT temp3.donhang
        FROM(
            SELECT temp2.donhang,k.tongsosanpham,k.tonggiatien,k.tinhtrangdon
            FROM(
                                            SELECT d.donhang
                                            FROM(
                                                            SELECT s.maso
                                                            FROM sanpham s join cuahang c on s.cuahang=c.maso
                                                            WHERE s.cuahang=${shopID} and s.status=1) as temp1 join chitietdonhang d on temp1.maso=d.sanpham
                                                            GROUP BY d.donhang) as temp2 join donhang k on temp2.donhang=k.maso) as temp3 join lichsutinhtrangdon c on c.donhang=temp3.donhang
        WHERE DATEDIFF(c.ngaythang,${dateToday})<=30 AND c.tinhtrang=4
        GROUP BY temp3.donhang)) as temp5 join donhang d on temp5.donhang=d.maso`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },

    async getInfoBill(shopID)
    {
        const sql = `SELECT temp3.*,t.ten
        FROM(
            SELECT k.*
            FROM(
                SELECT d.donhang
                FROM(
                    SELECT s.maso
                    FROM sanpham s join cuahang c on s.cuahang=c.maso
                    WHERE s.cuahang=${shopID} and s.status=1) as temp1 join chitietdonhang d on temp1.maso=d.sanpham
                    GROUP BY d.donhang
            ) as temp2 join donhang k on temp2.donhang=k.maso) as temp3 join loaitinhtrangdon t on temp3.tinhtrangdon=t.maso`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows;
    },

    async getInfoBillByOffset(shopID,offset)
    {
        const sql = `SELECT temp3.*,t.ten
        FROM(
            SELECT k.*
            FROM(
                SELECT d.donhang
                FROM(
                    SELECT s.maso
                    FROM sanpham s join cuahang c on s.cuahang=c.maso
                    WHERE s.cuahang=${shopID} and s.status=1) as temp1 join chitietdonhang d on temp1.maso=d.sanpham
                    GROUP BY d.donhang
            ) as temp2 join donhang k on temp2.donhang=k.maso) as temp3 join loaitinhtrangdon t on temp3.tinhtrangdon=t.maso
            limit ${paginate.limit} offset ${offset}`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows;
    },

    async getInfoBillByStatus(shopID, status)
    {
        const sql = `SELECT temp3.*,t.ten
        FROM(
            SELECT k.*
            FROM(
                SELECT d.donhang
                FROM(
                    SELECT s.maso
                    FROM sanpham s join cuahang c on s.cuahang=c.maso
                    WHERE s.cuahang=${shopID} and s.status=1) as temp1 join chitietdonhang d on temp1.maso=d.sanpham
                    GROUP BY d.donhang
            ) as temp2 join donhang k on temp2.donhang=k.maso) as temp3 join loaitinhtrangdon t on temp3.tinhtrangdon=t.maso
        WHERE temp3.tinhtrangdon=${status}`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows;
    },

    async getInfoBillByStatusOffset(shopID, status,offset)
    {
        const sql = `SELECT temp3.*,t.ten
        FROM(
            SELECT k.*
            FROM(
                SELECT d.donhang
                FROM(
                    SELECT s.maso
                    FROM sanpham s join cuahang c on s.cuahang=c.maso
                    WHERE s.cuahang=${shopID} and s.status=1) as temp1 join chitietdonhang d on temp1.maso=d.sanpham
                    GROUP BY d.donhang
            ) as temp2 join donhang k on temp2.donhang=k.maso) as temp3 join loaitinhtrangdon t on temp3.tinhtrangdon=t.maso
        WHERE temp3.tinhtrangdon=${status}
        limit ${paginate.limit} offset ${offset}`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows;
    },

    addStatusFinished(rowDB)
    {
        if (rowDB==null)
        {
            return null;
        }
        for (item of rowDB)
        {
            if (item.tinhtrangdon==3)
            {
                item.TrangThai="Hoàn Thành";
            }
            else{
                item.TrangThai="Chưa Hoàn Thành";
            }
        }
        return rowDB;
    },

    async getDateModified(idDonHang)
    {
        const sql = `SELECT MAX(ngaythang) as ngayCapNhat
        FROM lichsutinhtrangdon
        WHERE donhang=${idDonHang}`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },

    async addDateModified(rowDB)
    {
        if (rowDB==null)
        {
            return null;
        }
        for (item of rowDB)
        {
            let maxdate=await this.getDateModified(item.maso);
            maxdate=maxdate.ngayCapNhat;
            var dd = maxdate.getDate();
            var mm = maxdate.getMonth()+1; 
            var yyyy = maxdate.getFullYear();
            if(dd<10) 
            {
                dd='0'+dd;
            } 
            
            if(mm<10) 
            {
                mm='0'+mm;
            }
            maxdate = dd+'-'+mm+'-'+yyyy;
            item.ngayCapNhat=maxdate;
        }
        return rowDB
    }

}