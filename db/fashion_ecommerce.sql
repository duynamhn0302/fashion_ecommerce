/*
 Navicat Premium Data Transfer

 Source Server         : Local
 Source Server Type    : MySQL
 Source Server Version : 80022
 Source Host           : localhost:3306
 Source Schema         : fashion_ecommerce

 Target Server Type    : MySQL
 Target Server Version : 80022
 File Encoding         : 65001

 Date: 10/05/2021 09:03:57
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cauhinh
-- ----------------------------
DROP TABLE IF EXISTS `cauhinh`;
CREATE TABLE `cauhinh`  (
  `tencauhinh` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `giatri` int(0) NOT NULL,
  PRIMARY KEY (`tencauhinh`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cauhinh
-- ----------------------------
INSERT INTO `cauhinh` VALUES ('tinhtrangchoxacnhan', 0);
INSERT INTO `cauhinh` VALUES ('tinhtrangdagiao', 2);
INSERT INTO `cauhinh` VALUES ('tinhtrangdahuy', 3);
INSERT INTO `cauhinh` VALUES ('tinhtrangdanggiaohang', 1);

-- ----------------------------
-- Table structure for chitietdonhang
-- ----------------------------
DROP TABLE IF EXISTS `chitietdonhang`;
CREATE TABLE `chitietdonhang`  (
  `donhang` int(0) NOT NULL,
  `sanpham` int(0) NOT NULL,
  `dongia` int(0) NOT NULL,
  `soluong` int(0) NOT NULL,
  PRIMARY KEY (`donhang`, `sanpham`) USING BTREE,
  INDEX `ChiTietDonHang_fk1`(`sanpham`) USING BTREE,
  CONSTRAINT `ChiTietDonHang_fk0` FOREIGN KEY (`donhang`) REFERENCES `donhang` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `ChiTietDonHang_fk1` FOREIGN KEY (`sanpham`) REFERENCES `sanpham` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chitietdonhang
-- ----------------------------
INSERT INTO `chitietdonhang` VALUES (1, 1, 150000, 1);
INSERT INTO `chitietdonhang` VALUES (2, 1, 100000, 1);
INSERT INTO `chitietdonhang` VALUES (2, 4, 200000, 1);
INSERT INTO `chitietdonhang` VALUES (3, 7, 150000, 1);

-- ----------------------------
-- Table structure for chitietgiohang
-- ----------------------------
DROP TABLE IF EXISTS `chitietgiohang`;
CREATE TABLE `chitietgiohang`  (
  `sanpham` int(0) NOT NULL,
  `giohang` int(0) NOT NULL,
  `soluong` int(0) NOT NULL,
  PRIMARY KEY (`sanpham`, `giohang`) USING BTREE,
  INDEX `ChiTietGioHang_fk1`(`giohang`) USING BTREE,
  CONSTRAINT `ChiTietGioHang_fk0` FOREIGN KEY (`sanpham`) REFERENCES `sanpham` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `ChiTietGioHang_fk1` FOREIGN KEY (`giohang`) REFERENCES `giohang` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chitietgiohang
-- ----------------------------
INSERT INTO `chitietgiohang` VALUES (1, 1, 2);
INSERT INTO `chitietgiohang` VALUES (2, 5, 1);
INSERT INTO `chitietgiohang` VALUES (5, 1, 1);
INSERT INTO `chitietgiohang` VALUES (5, 3, 2);
INSERT INTO `chitietgiohang` VALUES (9, 4, 1);

-- ----------------------------
-- Table structure for cuahang
-- ----------------------------
DROP TABLE IF EXISTS `cuahang`;
CREATE TABLE `cuahang`  (
  `maso` int(0) NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sdt` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `taikhoan` int(0) NOT NULL,
  `status` binary(1) NOT NULL,
  `ngaymo` date NULL DEFAULT NULL,
  PRIMARY KEY (`maso`) USING BTREE,
  INDEX `Cuahang_fk0`(`taikhoan`) USING BTREE,
  CONSTRAINT `Cuahang_fk0` FOREIGN KEY (`taikhoan`) REFERENCES `taikhoan` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cuahang
-- ----------------------------
INSERT INTO `cuahang` VALUES (1, 'Cửa hàng 1', '123456789', 'shop1@gmail.com', 2, 0x31, '2021-04-05');

-- ----------------------------
-- Table structure for danhgia
-- ----------------------------
DROP TABLE IF EXISTS `danhgia`;
CREATE TABLE `danhgia`  (
  `taikhoan` int(0) NOT NULL,
  `sanpham` int(0) NOT NULL,
  `ngaythang` date NOT NULL,
  `noidung` varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sosao` float NOT NULL,
  PRIMARY KEY (`taikhoan`, `sanpham`) USING BTREE,
  INDEX `DanhGia_fk1`(`sanpham`) USING BTREE,
  CONSTRAINT `DanhGia_fk0` FOREIGN KEY (`taikhoan`) REFERENCES `taikhoan` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `DanhGia_fk1` FOREIGN KEY (`sanpham`) REFERENCES `sanpham` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of danhgia
-- ----------------------------
INSERT INTO `danhgia` VALUES (1, 1, '2021-04-09', 'san phẩm rất tốt', 5);

-- ----------------------------
-- Table structure for danhmuccap1
-- ----------------------------
DROP TABLE IF EXISTS `danhmuccap1`;
CREATE TABLE `danhmuccap1`  (
  `maso` int(0) NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`maso`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of danhmuccap1
-- ----------------------------
INSERT INTO `danhmuccap1` VALUES (1, 'Áo');
INSERT INTO `danhmuccap1` VALUES (2, 'Quần');
INSERT INTO `danhmuccap1` VALUES (3, 'Mũ/nón');
INSERT INTO `danhmuccap1` VALUES (4, 'Balo/Túi xách');

-- ----------------------------
-- Table structure for danhmuccap2
-- ----------------------------
DROP TABLE IF EXISTS `danhmuccap2`;
CREATE TABLE `danhmuccap2`  (
  `maso` int(0) NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `danhmuccap1` int(0) NOT NULL,
  PRIMARY KEY (`maso`) USING BTREE,
  INDEX `DanhMucCap2_fk0`(`danhmuccap1`) USING BTREE,
  CONSTRAINT `DanhMucCap2_fk0` FOREIGN KEY (`danhmuccap1`) REFERENCES `danhmuccap1` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of danhmuccap2
-- ----------------------------
INSERT INTO `danhmuccap2` VALUES (1, 'Áo sơ mi', 1);
INSERT INTO `danhmuccap2` VALUES (2, 'Áo thun', 1);
INSERT INTO `danhmuccap2` VALUES (3, 'Áo khoác', 1);
INSERT INTO `danhmuccap2` VALUES (4, 'Áo len', 1);
INSERT INTO `danhmuccap2` VALUES (5, 'Quần Jeans', 2);
INSERT INTO `danhmuccap2` VALUES (6, 'Quần tây', 2);
INSERT INTO `danhmuccap2` VALUES (7, 'Quần kaki', 2);
INSERT INTO `danhmuccap2` VALUES (8, 'Quần short', 2);
INSERT INTO `danhmuccap2` VALUES (9, 'Quần Jogger', 2);
INSERT INTO `danhmuccap2` VALUES (10, 'Váy', 2);
INSERT INTO `danhmuccap2` VALUES (11, 'Mũ thời trang', 3);
INSERT INTO `danhmuccap2` VALUES (12, 'Mũ bảo hiểm', 3);
INSERT INTO `danhmuccap2` VALUES (13, 'Balo', 4);
INSERT INTO `danhmuccap2` VALUES (14, 'Túi xách', 4);

-- ----------------------------
-- Table structure for donhang
-- ----------------------------
DROP TABLE IF EXISTS `donhang`;
CREATE TABLE `donhang`  (
  `maso` int(0) NOT NULL AUTO_INCREMENT,
  `taikhoan` int(0) NOT NULL,
  `tongsosanpham` int(0) NOT NULL,
  `tonggiatien` int(0) NOT NULL,
  `tinhtrangdon` int(0) NOT NULL,
  PRIMARY KEY (`maso`) USING BTREE,
  INDEX `DonHang_fk0`(`taikhoan`) USING BTREE,
  INDEX `DonHang_fk1`(`tinhtrangdon`) USING BTREE,
  CONSTRAINT `DonHang_fk0` FOREIGN KEY (`taikhoan`) REFERENCES `taikhoan` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `DonHang_fk1` FOREIGN KEY (`tinhtrangdon`) REFERENCES `loaitinhtrangdon` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of donhang
-- ----------------------------
INSERT INTO `donhang` VALUES (1, 1, 1, 150000, 2);
INSERT INTO `donhang` VALUES (2, 1, 2, 300000, 3);
INSERT INTO `donhang` VALUES (3, 3, 1, 150000, 3);

-- ----------------------------
-- Table structure for giohang
-- ----------------------------
DROP TABLE IF EXISTS `giohang`;
CREATE TABLE `giohang`  (
  `maso` int(0) NOT NULL AUTO_INCREMENT,
  `taikhoan` int(0) NOT NULL,
  `tongsosanpham` int(0) NOT NULL,
  `tonggiatien` float NOT NULL,
  PRIMARY KEY (`maso`) USING BTREE,
  UNIQUE INDEX `taikhoan`(`taikhoan`) USING BTREE,
  CONSTRAINT `GioHang_fk0` FOREIGN KEY (`taikhoan`) REFERENCES `taikhoan` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of giohang
-- ----------------------------
INSERT INTO `giohang` VALUES (1, 1, 3, 350000);
INSERT INTO `giohang` VALUES (2, 2, 0, 0);
INSERT INTO `giohang` VALUES (3, 3, 2, 300000);
INSERT INTO `giohang` VALUES (4, 4, 1, 150000);
INSERT INTO `giohang` VALUES (5, 5, 1, 200000);

-- ----------------------------
-- Table structure for hinhanhsanpham
-- ----------------------------
DROP TABLE IF EXISTS `hinhanhsanpham`;
CREATE TABLE `hinhanhsanpham`  (
  `maso` int(0) NOT NULL AUTO_INCREMENT,
  `sanpham` int(0) NOT NULL,
  `link` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`maso`) USING BTREE,
  INDEX `HinhAnhSanPham_fk0`(`sanpham`) USING BTREE,
  CONSTRAINT `HinhAnhSanPham_fk0` FOREIGN KEY (`sanpham`) REFERENCES `sanpham` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of hinhanhsanpham
-- ----------------------------
INSERT INTO `hinhanhsanpham` VALUES (1, 1, '/resources/images/white t-shirt.jpg');
INSERT INTO `hinhanhsanpham` VALUES (2, 1, '/resources/images/white t-shirt.jpg');
INSERT INTO `hinhanhsanpham` VALUES (3, 2, '/resources/images/white t-shirt.jpg');
INSERT INTO `hinhanhsanpham` VALUES (4, 2, '/resources/images/quan.png');
INSERT INTO `hinhanhsanpham` VALUES (5, 2, '/resources/images/quan.png');
INSERT INTO `hinhanhsanpham` VALUES (6, 3, '/resources/images/quan.png');
INSERT INTO `hinhanhsanpham` VALUES (7, 4, '/resources/images/quan.png');
INSERT INTO `hinhanhsanpham` VALUES (8, 5, '/resources/images/quan.png');
INSERT INTO `hinhanhsanpham` VALUES (9, 6, '/resources/images/quan.png');
INSERT INTO `hinhanhsanpham` VALUES (10, 7, '/resources/images/quan.png');
INSERT INTO `hinhanhsanpham` VALUES (11, 8, '/resources/images/quan.png');
INSERT INTO `hinhanhsanpham` VALUES (12, 9, '/resources/images/quan.png');
INSERT INTO `hinhanhsanpham` VALUES (13, 10, '/resources/images/quan.png');

-- ----------------------------
-- Table structure for lichsutinhtrangdon
-- ----------------------------
DROP TABLE IF EXISTS `lichsutinhtrangdon`;
CREATE TABLE `lichsutinhtrangdon`  (
  `donhang` int(0) NOT NULL,
  `tinhtrang` int(0) NOT NULL,
  `ngaythang` date NOT NULL,
  PRIMARY KEY (`donhang`, `tinhtrang`) USING BTREE,
  INDEX `LichSuTinhTrangDon_fk1`(`tinhtrang`) USING BTREE,
  CONSTRAINT `LichSuTinhTrangDon_fk0` FOREIGN KEY (`donhang`) REFERENCES `donhang` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `LichSuTinhTrangDon_fk1` FOREIGN KEY (`tinhtrang`) REFERENCES `loaitinhtrangdon` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of lichsutinhtrangdon
-- ----------------------------
INSERT INTO `lichsutinhtrangdon` VALUES (1, 1, '2021-04-08');
INSERT INTO `lichsutinhtrangdon` VALUES (1, 2, '2021-04-09');
INSERT INTO `lichsutinhtrangdon` VALUES (1, 3, '2021-04-10');
INSERT INTO `lichsutinhtrangdon` VALUES (2, 1, '2021-04-08');
INSERT INTO `lichsutinhtrangdon` VALUES (2, 2, '2021-04-09');
INSERT INTO `lichsutinhtrangdon` VALUES (3, 1, '2021-04-08');
INSERT INTO `lichsutinhtrangdon` VALUES (3, 4, '2021-04-09');

-- ----------------------------
-- Table structure for loaitinhtrangdon
-- ----------------------------
DROP TABLE IF EXISTS `loaitinhtrangdon`;
CREATE TABLE `loaitinhtrangdon`  (
  `maso` int(0) NOT NULL AUTO_INCREMENT,
  `ten` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`maso`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of loaitinhtrangdon
-- ----------------------------
INSERT INTO `loaitinhtrangdon` VALUES (1, 'Đang xác nhận');
INSERT INTO `loaitinhtrangdon` VALUES (2, 'Đang giao');
INSERT INTO `loaitinhtrangdon` VALUES (3, 'Đã giao');
INSERT INTO `loaitinhtrangdon` VALUES (4, 'Đã hủy');

-- ----------------------------
-- Table structure for sanpham
-- ----------------------------
DROP TABLE IF EXISTS `sanpham`;
CREATE TABLE `sanpham`  (
  `maso` int(0) NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `noisx` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mota` varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `kichthuoc` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `gioitinhsudung` binary(1) NOT NULL,
  `giaban` int(0) NOT NULL,
  `soluong` int(0) NOT NULL,
  `diemdanhgia` float NOT NULL,
  `luotdanhgia` int(0) NOT NULL,
  `danhmuccap2` int(0) NOT NULL,
  `cuahang` int(0) NOT NULL,
  `status` binary(1) NOT NULL,
  `ngaymo` date NULL DEFAULT NULL,
  PRIMARY KEY (`maso`) USING BTREE,
  INDEX `SanPham_fk0`(`danhmuccap2`) USING BTREE,
  INDEX `SanPham_fk1`(`cuahang`) USING BTREE,
  CONSTRAINT `SanPham_fk0` FOREIGN KEY (`danhmuccap2`) REFERENCES `danhmuccap2` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `SanPham_fk1` FOREIGN KEY (`cuahang`) REFERENCES `cuahang` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sanpham
-- ----------------------------
INSERT INTO `sanpham` VALUES (1, 'Áo thun trắng', 'Việt Nam', 'Áo màu trắng rất xinh', 'L', 0x30, 100000, 5, 5, 1, 2, 1, 0x31, '2021-04-05');
INSERT INTO `sanpham` VALUES (2, 'Quần tây đen', 'Việt Nam', 'Chiếc quần màu đen rất xinh', 'L', 0x30, 200000, 5, 0, 0, 6, 1, 0x31, '2021-04-05');
INSERT INTO `sanpham` VALUES (3, 'Quần tây đen 2', 'Việt Nam', 'Chiếc quần màu đen rất xinh', 'L', 0x30, 150000, 5, 0, 0, 6, 1, 0x31, '2021-04-05');
INSERT INTO `sanpham` VALUES (4, 'Quần tây đen 3', 'Việt Nam', 'Chiếc quần màu đen rất xinh', 'L', 0x30, 1500000, 0, 0, 0, 6, 1, 0x31, '2021-04-05');
INSERT INTO `sanpham` VALUES (5, 'Quần tây đen 4', 'Việt Nam', 'Chiếc quần màu đen rất xinh', 'L', 0x30, 150000, 5, 0, 0, 6, 1, 0x31, '2021-04-05');
INSERT INTO `sanpham` VALUES (6, 'Quần tây đen 5', 'Việt Nam', 'Chiếc quần màu đen rất xinh', 'L', 0x30, 150000, 1, 0, 0, 6, 1, 0x31, '2021-04-05');
INSERT INTO `sanpham` VALUES (7, 'Quần tây đen 6', 'Việt Nam', 'Chiếc quần màu đen rất xinh', 'L', 0x30, 150000, 5, 0, 0, 6, 1, 0x31, '2021-04-05');
INSERT INTO `sanpham` VALUES (8, 'Quần tây đen 7', 'Việt Nam', 'Chiếc quần màu đen rất xinh', 'L', 0x30, 150000, 10, 0, 0, 6, 1, 0x31, '2021-04-05');
INSERT INTO `sanpham` VALUES (9, 'Quần tây đen 8', 'Việt Nam', 'Chiếc quần màu đen rất xinh', 'L', 0x30, 150000, 5, 0, 0, 6, 1, 0x31, '2021-04-05');
INSERT INTO `sanpham` VALUES (10, 'Quần tây đen 9', 'Việt Nam', 'Chiếc quần màu đen rất xinh', 'L', 0x30, 150000, 0, 0, 0, 6, 1, 0x31, '2021-04-05');

-- ----------------------------
-- Table structure for taikhoan
-- ----------------------------
DROP TABLE IF EXISTS `taikhoan`;
CREATE TABLE `taikhoan`  (
  `maso` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `hoten` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ngaysinh` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sdt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `vaitro` int(0) NOT NULL,
  `status` binary(1) NOT NULL,
  `ngaymo` date NULL DEFAULT NULL,
  PRIMARY KEY (`maso`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of taikhoan
-- ----------------------------
INSERT INTO `taikhoan` VALUES (1, 'lyduynam', '123456', 'Lý Duy Nam', '15/03/2000', '0123456789', 'lyduynam@gmail.com', '/resources/images/default_avatar.png', 0, 0x31, '2021-04-05');
INSERT INTO `taikhoan` VALUES (2, 'lehoangphuc', '123456', 'Lê Hoàng Phúc', '01/01/2000', '0123456789', 'lehoangphuc@gmail.com', '/resources/images/default_avatar.png', 1, 0x31, '2021-04-05');
INSERT INTO `taikhoan` VALUES (3, 'luuthiennhan', '123456', 'Lưu Thiện Nhân', '01/01/2000', '0123456789', 'luuthiennhan@gmail.com', '/resources/images/default_avatar.png', 0, 0x31, '2021-04-05');
INSERT INTO `taikhoan` VALUES (4, 'nguyenanhduy', '123456', 'Nguyễn Anh Duy', '01/01/2000', '0123456789', 'nguyenanhduy@gmail.com', '/resources/images/default_avatar.png', 0, 0x31, '2021-03-05');
INSERT INTO `taikhoan` VALUES (5, 'admin', '123456', 'Admin', '15/03/2000', '0123456789', 'adminFashionEcommerce@gmail.com', '/resources/images/default_avatar.png', 2, 0x31, '2021-04-05');
INSERT INTO `taikhoan` VALUES (6, '18127159', '12345678', 'Duy-Nam Ly', NULL, NULL, 'duynamvt79@gmail.com', 'images/default_avatar.png', 0, 0x31, NULL);

SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE `SanPham` ADD FULLTEXT (ten);
ALTER TABLE `DanhMucCap1` ADD FULLTEXT (ten);
ALTER TABLE `DanhMucCap2` ADD FULLTEXT (ten);
ALTER TABLE `CuaHang` ADD FULLTEXT (ten);
