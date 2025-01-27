const db = require('../utils/db');
const { paginate } = require('./../config/default.json');
const { paginate_if } = require('./../config/default.json');
const { single } = require('./products.model');
const productsModel = require('./products.model');

module.exports = {
    async allShop(){
        const sql = `select * 
        from cuahang join taikhoan on cuahang.taikhoan = taikhoan.maso`;
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
            WHERE s.cuahang=${shopID} and s.status = 1
            GROUP BY danhmuccap2,danhmuccap1) as temp1 join danhmuccap1 c on temp1.danhmuccap1=c.maso
            GROUP BY (danhmuccap1)`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows;
    },
    async getSubCatByShopID(shopID){
        const sql = `SELECT danhmuccap2,danhmuccap1,d.ten as subCat
        FROM sanpham s join danhmuccap2 d on s.danhmuccap2=d.maso
        WHERE s.cuahang=${shopID} and s.status = 1
        GROUP BY danhmuccap2,danhmuccap1`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows;
    },
    async getProductByShopID(shopID){
        const sql = `SELECT s.*
         FROM sanpham s 
        WHERE s.cuahang=${shopID} and s.status = 1
        GROUP BY maso`;
        var [rows,fields] = await db.load(sql);
        console.log(rows)
        rows =  await productsModel.informationForListProduct(rows)
        return rows;
    },

    async getProductByShopIDByOffset(shopID,offset){
        const sql = `SELECT s.*
        FROM sanpham s 
        WHERE s.cuahang=${shopID} and s.status = 1
        GROUP BY maso
        limit ${paginate_if.limit} offset ${offset}`;
        var [rows,fields] = await db.load(sql);
        console.log(rows)
        rows =  await productsModel.informationForListProduct(rows)
        return rows;
    },

    async getProductByShopIDByOffsetByLow(shopID,offset){
        const sql = `SELECT s.*
        FROM sanpham s 
        WHERE s.cuahang=${shopID} and s.status = 1
        GROUP BY maso
        ORDER BY giaban ASC
        limit ${paginate_if.limit} offset ${offset}`;
        var [rows,fields] = await db.load(sql);
        console.log(rows)
        rows =  await productsModel.informationForListProduct(rows)
        return rows;
    },

    async getProductByShopIDByOffsetByHigh(shopID,offset){
        const sql = `SELECT s.*
        FROM sanpham s 
        WHERE s.cuahang=${shopID} and s.status = 1
        GROUP BY maso
        ORDER BY giaban DESC
        limit ${paginate_if.limit} offset ${offset}`;
        var [rows,fields] = await db.load(sql);
        console.log(rows)
        rows =  await productsModel.informationForListProduct(rows)
        return rows;
    },

    async getProductByShopIDByLow(shopID){
        const sql = `SELECT s.*
         FROM sanpham s 
        WHERE s.cuahang=${shopID} and s.status = 1
        GROUP BY maso
        ORDER BY giaban ASC`;
        var [rows,fields] = await db.load(sql);
        console.log(rows)
        rows =  await productsModel.informationForListProduct(rows)
        return rows;
    },
    async getProductByShopIDByHigh(shopID){
        const sql = `SELECT s.*
         FROM sanpham s 
        WHERE s.cuahang=${shopID} and s.status = 1
        GROUP BY maso
        ORDER BY giaban DESC`;
        var [rows,fields] = await db.load(sql);
        console.log(rows)
        rows =  await productsModel.informationForListProduct(rows)
        return rows;
    },

    async getProductByShopIDcat(shopID,catID){
        const sql = `SELECT temp1.*, d.danhmuccap1
        FROM(SELECT s.*,h.link FROM sanpham s join hinhanhsanpham h on s.maso=h.sanpham
        WHERE s.cuahang=${shopID} and s.status = 1
        GROUP BY maso) as temp1 join danhmuccap2 d on temp1.danhmuccap2=d.maso
        WHERE danhmuccap1=${catID}`;
        var [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        rows =  await productsModel.informationForListProduct(rows)
        return rows;
    },

    async getProductByShopIDcatOffset(shopID,catID,offset){
        const sql = `SELECT temp1.*, d.danhmuccap1
        FROM(SELECT s.*,h.link FROM sanpham s join hinhanhsanpham h on s.maso=h.sanpham
        WHERE s.cuahang=${shopID} and s.status = 1
        GROUP BY maso) as temp1 join danhmuccap2 d on temp1.danhmuccap2=d.maso
        WHERE danhmuccap1=${catID}
        limit ${paginate_if.limit} offset ${offset}`;
        var [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        rows =  await productsModel.informationForListProduct(rows)
        return rows;
    },

    async getShopIf(billID){
        const sql = `SELECT temp1.*,c.maso as macuahang,c.ten
        FROM
        (
            SELECT temp.*,s.cuahang FROM
            (
            SELECT d.maso,c.sanpham
            FROM donhang d join chitietdonhang c on d.maso=c.donhang
            WHERE d.maso=${billID}) as temp join sanpham s on temp.sanpham=s.maso
        ) AS temp1 join cuahang c on temp1.cuahang=c.maso
        GROUP BY temp1.maso`;
        var [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },
    async getShopIfByID(shopID){
        const sql = `SELECT c.*,t.avatar
        FROM cuahang c join taikhoan t on t.maso=c.taikhoan
        WHERE c.maso=${shopID}`;
        var [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },
    async getStarShop(shopID){
        const sql = `SELECT AVG(temp.sosao) as soSaoTB
        FROM
        (
        SELECT d.sosao,s.maso
        FROM danhgia d join sanpham s on d.sanpham=s.maso
        WHERE s.cuahang=${shopID}) as temp`;
        var [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },
    async getSLBill(shopID){
        const sql = `SELECT COUNT(*) as tongDon 
        FROM
        (
            SELECT c.donhang
            FROM chitietdonhang c join sanpham s on c.sanpham=s.maso
            WHERE s.cuahang=${shopID}
            GROUP BY c.donhang) as temp join donhang d on temp.donhang=d.maso`;
        var [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },
    async getSLBillByStatus(shopID,status){
        const sql = `SELECT COUNT(*) as tongDon 
        FROM
        (
            SELECT c.donhang
            FROM chitietdonhang c join sanpham s on c.sanpham=s.maso
            WHERE s.cuahang=${shopID}
            GROUP BY c.donhang) as temp join donhang d on temp.donhang=d.maso
            WHERE d.tinhtrangdon=${status}`;
        var [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },
    async incomePreDate(idShop, date){
        const sql = `SELECT *, sum(tonggiatien) as tong
                    FROM (
                                SELECT donhang.*, sanpham.cuahang, lichsutinhtrangdon.*
                                from ((donhang join chitietdonhang on donhang.maso = chitietdonhang.donhang) join sanpham on sanpham.maso = chitietdonhang.sanpham)
                                join lichsutinhtrangdon on donhang.maso = lichsutinhtrangdon.donhang
                                WHERE lichsutinhtrangdon.tinhtrang = 3  and lichsutinhtrangdon.ngaythang <= '${date}'
                                GROUP BY donhang.maso) spDaBan 
                    where spDaBan.cuahang = ${idShop}
                    GROUP BY spDaBan.cuahang`;
        const [rows,fields] = await db.load(sql);
        if (rows.length === 0)
            return 0
        return rows[0].tong;
    },
    async getProductByShopIDcatSub(shopID,catSubID){
        const sql = `SELECT s.*,h.link FROM sanpham s join hinhanhsanpham h on s.maso=h.sanpham
        WHERE s.cuahang=${shopID} and s.danhmuccap2=${catSubID}
        GROUP BY maso`;
        var [rows,fields] = await db.load(sql);
        rows =  await productsModel.informationForListProduct(rows)
        return rows;
    },
    async getProductByShopIDcatSubOffset(shopID,catSubID,offset){
        const sql = `SELECT s.*,h.link FROM sanpham s join hinhanhsanpham h on s.maso=h.sanpham
        WHERE s.cuahang=${shopID} and s.danhmuccap2=${catSubID}
        GROUP BY maso
        limit ${paginate_if.limit} offset ${offset}`;
        var [rows,fields] = await db.load(sql);
        rows =  await productsModel.informationForListProduct(rows)
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
                    WHERE DATEDIFF(c.ngaythang,"${dateToday}")=0
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
        WHERE DATEDIFF(c.ngaythang,"${dateToday}")=0 AND c.tinhtrang=4
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
                    WHERE DATEDIFF(c.ngaythang,"${dateToday}")=0
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
        WHERE DATEDIFF(c.ngaythang,"${dateToday}")=0 AND c.tinhtrang=4
        GROUP BY temp3.donhang)) as temp5 join donhang d on temp5.donhang=d.maso`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },

    async getMoneyMonth(shopID,dateToday)
    {
        const sql = `SELECT SUM(temp2.tonggiatien) as tongTienThang
        FROM(
            SELECT temp1.*,s.cuahang
            FROM(
                SELECT temp.*,c.sanpham
                FROM(
                    SELECT d.maso,d.tonggiatien,l.ngaythang
                    FROM donhang d join lichsutinhtrangdon l on d.maso=l.donhang
                    WHERE l.tinhtrang=3) as temp join chitietdonhang c on temp.maso=c.donhang) as temp1 join sanpham s on temp1.sanpham=s.maso
            WHERE s.cuahang=${shopID} AND DATEDIFF(temp1.ngaythang,"${dateToday}")<=30
            GROUP BY temp1.maso) as temp2`;
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

    async getNameCustomer(idUser)
    {
        const sql = `SELECT hoten FROM taikhoan WHERE maso=${idUser}`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },

    async getNameProList(idBill)
    {
        const sql = `SELECT s.ten as tensanpham
        FROM chitietdonhang c join sanpham s on c.sanpham=s.maso
        WHERE c.donhang=${idBill}`;
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

    async getListProductByBill(idBill)
    {
        const sql = `SELECT temp.*,h.link
        FROM(
        SELECT s.*,c.donhang,c.soluong as soluongmua,c.dongia
                FROM chitietdonhang c join sanpham s on c.sanpham=s.maso
                WHERE c.donhang=${idBill}) temp join hinhanhsanpham h on temp.maso=h.sanpham
        GROUP BY maso`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows;
    },

    async getNameStatusBill(statusID)
    {
        const sql = `SELECT * FROM loaitinhtrangdon WHERE maso=${statusID}`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0) return null;
        return rows[0];
    },

    async updateStatusBill(idBill,status)
    {
        var condition={maso: idBill};
        var newdata={tinhtrangdon: status};
        const [result, fields] = await db.patch(newdata, condition,'donhang');
        return result;
    },

    async updateShopInfo(idShop, tenShop, sodt,Email,Diachi)
    {
        var condition={maso: idShop};
        console.log(condition);
        var newdata={ten: tenShop, sdt: sodt, email: Email, diachi: Diachi};
        const [result, fields] = await db.patch(newdata, condition,'cuahang');
        return result;
    },

    async updateTonKho(idsp,sl)
    {
        var condition={maso: idsp};
        var newdata={soluong: sl};
        const [result, fields] = await db.patch(newdata, condition,'sanpham');
        return result;
    },

    async insertStatusBill(idBill,status)
    {
        var today=new Date();
        var new_data={donhang: idBill, tinhtrang: status, ngaythang: today};
        const [rows,fields] = await db.add(new_data,'lichsutinhtrangdon');
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

    checkTonKho(listsp)
    {
        let flag=true;
        for (item of listsp)
        {
            if (item.soluong===0)
            {
                flag=false;
                break;
            }
        }
        return flag;
    },

    tangTonKho(listsp)
    {
        for (item of listsp)
        {
            item.soluong=item.soluong+item.soluongmua;
        }
    },

    giamTonKho(listsp)
    {
        for (item of listsp)
        {
            item.soluong=item.soluong-item.soluongmua;
        }
    },

    async capNhatSL(listsp)
    {
        for (item of listsp)
        {
            await this.updateTonKho(item.maso,item.soluong);
        }
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
    },

    async rowProperties(listType)
    {
        if (listType==null)
        {
            return;
        }
        for (item of listType)
        {
          let ten=await this.getNameCustomer(item.taikhoan);
          item.tenNguoiNhan=ten.hoten;
        }
        for (item of listType)
        {
          let tensanpham="";
          let listTenSP=await this.getNameProList(item.maso);
          let lengthList=listTenSP.length;
          let extention="";
          if (lengthList>2)
          {
              extention=" và 1 số sản phẩm khác"
          }
          let count=1;
          for (tensp of listTenSP)
          {
            if (count===lengthList)
            {
              tensanpham=tensanpham+tensp.tensanpham+extention;
            }
            else{
              tensanpham=tensanpham+tensp.tensanpham+", "
            }
            count++;
          }
          item.listNameProduct=tensanpham;
        }
    },

    async single(shopId) {
        const [rows, fields] = await db.load(`select * from cuahang where maso = ${shopId}`);
        return rows[0];
    }

}