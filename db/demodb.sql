-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: fashion_ecommerce
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cauhinh`
--

DROP TABLE IF EXISTS `cauhinh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cauhinh` (
  `tencauhinh` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `giatri` int NOT NULL,
  PRIMARY KEY (`tencauhinh`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cauhinh`
--

LOCK TABLES `cauhinh` WRITE;
/*!40000 ALTER TABLE `cauhinh` DISABLE KEYS */;
INSERT INTO `cauhinh` VALUES ('Nam',0),('Nữ',1),('Unisex',2);
/*!40000 ALTER TABLE `cauhinh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chitietdonhang`
--

DROP TABLE IF EXISTS `chitietdonhang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chitietdonhang` (
  `donhang` int NOT NULL,
  `sanpham` int NOT NULL,
  `dongia` int NOT NULL,
  `soluong` int NOT NULL,
  PRIMARY KEY (`donhang`,`sanpham`) USING BTREE,
  KEY `ChiTietDonHang_fk1` (`sanpham`) USING BTREE,
  CONSTRAINT `ChiTietDonHang_fk0` FOREIGN KEY (`donhang`) REFERENCES `donhang` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `ChiTietDonHang_fk1` FOREIGN KEY (`sanpham`) REFERENCES `sanpham` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chitietdonhang`
--

LOCK TABLES `chitietdonhang` WRITE;
/*!40000 ALTER TABLE `chitietdonhang` DISABLE KEYS */;
INSERT INTO `chitietdonhang` VALUES (1,1,150000,1),(2,1,100000,1),(2,4,200000,1),(3,7,150000,1),(4,1,100000,2),(4,5,150000,3);
/*!40000 ALTER TABLE `chitietdonhang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chitietgiohang`
--

DROP TABLE IF EXISTS `chitietgiohang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chitietgiohang` (
  `sanpham` int NOT NULL,
  `giohang` int NOT NULL,
  `soluong` int NOT NULL,
  PRIMARY KEY (`sanpham`,`giohang`) USING BTREE,
  KEY `ChiTietGioHang_fk1` (`giohang`) USING BTREE,
  CONSTRAINT `ChiTietGioHang_fk0` FOREIGN KEY (`sanpham`) REFERENCES `sanpham` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `ChiTietGioHang_fk1` FOREIGN KEY (`giohang`) REFERENCES `giohang` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chitietgiohang`
--

LOCK TABLES `chitietgiohang` WRITE;
/*!40000 ALTER TABLE `chitietgiohang` DISABLE KEYS */;
INSERT INTO `chitietgiohang` VALUES (2,5,1),(2,7,1),(4,7,1),(5,3,2),(5,7,3),(9,4,1),(9,5,1);
/*!40000 ALTER TABLE `chitietgiohang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuahang`
--

DROP TABLE IF EXISTS `cuahang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuahang` (
  `maso` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sdt` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `taikhoan` int NOT NULL,
  `status` int NOT NULL,
  `ngaymo` date DEFAULT NULL,
  `diachi` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`maso`) USING BTREE,
  KEY `Cuahang_fk0` (`taikhoan`) USING BTREE,
  FULLTEXT KEY `ten` (`ten`),
  CONSTRAINT `Cuahang_fk0` FOREIGN KEY (`taikhoan`) REFERENCES `taikhoan` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuahang`
--

LOCK TABLES `cuahang` WRITE;
/*!40000 ALTER TABLE `cuahang` DISABLE KEYS */;
INSERT INTO `cuahang` VALUES (1,'Cửa hàng 1','123456789','shop1@gmail.com',2,1,'2021-04-05','TPHCM'),(2,'Shop của những người giàu','1231231231','nminh7953@gmail.com',8,1,'2021-05-17','1231231231'),(3,'Áo quần Tuấn Anh','0790123456','nhanluu838@gmail.com',9,1,'2021-05-17','TPHCM'),(4,'Eve Clothing','0912412740','nhanluu838@gmail.com',10,1,'2021-05-17','Hà Nội'),(5,'LMT Shopping','1245151755','nminh7953@gmail.com',11,1,'2021-05-17','Đà Nẵng');
/*!40000 ALTER TABLE `cuahang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danhgia`
--

DROP TABLE IF EXISTS `danhgia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danhgia` (
  `taikhoan` int NOT NULL,
  `sanpham` int NOT NULL,
  `ngaythang` date NOT NULL,
  `noidung` varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sosao` float NOT NULL,
  PRIMARY KEY (`taikhoan`,`sanpham`) USING BTREE,
  KEY `DanhGia_fk1` (`sanpham`) USING BTREE,
  CONSTRAINT `DanhGia_fk0` FOREIGN KEY (`taikhoan`) REFERENCES `taikhoan` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `DanhGia_fk1` FOREIGN KEY (`sanpham`) REFERENCES `sanpham` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danhgia`
--

LOCK TABLES `danhgia` WRITE;
/*!40000 ALTER TABLE `danhgia` DISABLE KEYS */;
INSERT INTO `danhgia` VALUES (1,1,'2021-04-09','san phẩm rất tốt',5);
/*!40000 ALTER TABLE `danhgia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danhmuccap1`
--

DROP TABLE IF EXISTS `danhmuccap1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danhmuccap1` (
  `maso` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`maso`) USING BTREE,
  FULLTEXT KEY `ten` (`ten`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danhmuccap1`
--

LOCK TABLES `danhmuccap1` WRITE;
/*!40000 ALTER TABLE `danhmuccap1` DISABLE KEYS */;
INSERT INTO `danhmuccap1` VALUES (1,'Áo'),(2,'Quần'),(3,'Mũ/nón'),(4,'Balo/Túi xách');
/*!40000 ALTER TABLE `danhmuccap1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danhmuccap2`
--

DROP TABLE IF EXISTS `danhmuccap2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danhmuccap2` (
  `maso` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `danhmuccap1` int NOT NULL,
  PRIMARY KEY (`maso`) USING BTREE,
  KEY `DanhMucCap2_fk0` (`danhmuccap1`) USING BTREE,
  FULLTEXT KEY `ten` (`ten`),
  CONSTRAINT `DanhMucCap2_fk0` FOREIGN KEY (`danhmuccap1`) REFERENCES `danhmuccap1` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danhmuccap2`
--

LOCK TABLES `danhmuccap2` WRITE;
/*!40000 ALTER TABLE `danhmuccap2` DISABLE KEYS */;
INSERT INTO `danhmuccap2` VALUES (1,'Áo sơ mi',1),(2,'Áo thun',1),(3,'Áo khoác',1),(4,'Áo len',1),(5,'Quần Jeans',2),(6,'Quần tây',2),(7,'Quần kaki',2),(8,'Quần short',2),(9,'Quần Jogger',2),(10,'Váy',2),(11,'Mũ thời trang',3),(12,'Mũ bảo hiểm',3),(13,'Balo',4),(14,'Túi xách',4);
/*!40000 ALTER TABLE `danhmuccap2` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donhang`
--

DROP TABLE IF EXISTS `donhang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donhang` (
  `maso` int NOT NULL AUTO_INCREMENT,
  `taikhoan` int NOT NULL,
  `tongsosanpham` int NOT NULL,
  `tonggiatien` int NOT NULL,
  `tinhtrangdon` int NOT NULL,
  `diachinguoinhan` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sdtnguoinhan` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`maso`) USING BTREE,
  KEY `DonHang_fk0` (`taikhoan`) USING BTREE,
  KEY `DonHang_fk1` (`tinhtrangdon`) USING BTREE,
  CONSTRAINT `DonHang_fk0` FOREIGN KEY (`taikhoan`) REFERENCES `taikhoan` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `DonHang_fk1` FOREIGN KEY (`tinhtrangdon`) REFERENCES `loaitinhtrangdon` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donhang`
--

LOCK TABLES `donhang` WRITE;
/*!40000 ALTER TABLE `donhang` DISABLE KEYS */;
INSERT INTO `donhang` VALUES (1,1,1,150000,4,'TPHCM','0123456789'),(2,1,2,300000,3,'TPHCM','0123456789'),(3,3,1,150000,3,'TPHCM','0123456789'),(4,1,5,650000,3,'TPHCM','0123456789');
/*!40000 ALTER TABLE `donhang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `giohang`
--

DROP TABLE IF EXISTS `giohang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `giohang` (
  `maso` int NOT NULL AUTO_INCREMENT,
  `taikhoan` int NOT NULL,
  `tongsosanpham` int NOT NULL,
  `tonggiatien` float NOT NULL,
  PRIMARY KEY (`maso`) USING BTREE,
  UNIQUE KEY `taikhoan` (`taikhoan`) USING BTREE,
  CONSTRAINT `GioHang_fk0` FOREIGN KEY (`taikhoan`) REFERENCES `taikhoan` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `giohang`
--

LOCK TABLES `giohang` WRITE;
/*!40000 ALTER TABLE `giohang` DISABLE KEYS */;
INSERT INTO `giohang` VALUES (2,2,0,0),(3,3,2,300000),(4,4,1,150000),(5,5,2,350000),(7,8,4,650000),(8,9,0,0),(9,10,0,0),(10,11,0,0);
/*!40000 ALTER TABLE `giohang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hinhanhsanpham`
--

DROP TABLE IF EXISTS `hinhanhsanpham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hinhanhsanpham` (
  `maso` int NOT NULL AUTO_INCREMENT,
  `sanpham` int NOT NULL,
  `link` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`maso`) USING BTREE,
  KEY `HinhAnhSanPham_fk0` (`sanpham`) USING BTREE,
  CONSTRAINT `HinhAnhSanPham_fk0` FOREIGN KEY (`sanpham`) REFERENCES `sanpham` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hinhanhsanpham`
--

LOCK TABLES `hinhanhsanpham` WRITE;
/*!40000 ALTER TABLE `hinhanhsanpham` DISABLE KEYS */;
INSERT INTO `hinhanhsanpham` VALUES (1,1,'/resources/images/white t-shirt.jpg'),(2,1,'/resources/images/white t-shirt.jpg'),(3,2,'/resources/images/white t-shirt.jpg'),(4,2,'/resources/images/quan.png'),(5,2,'/resources/images/quan.png'),(6,3,'/resources/images/quan.png'),(7,4,'/resources/images/quan.png'),(8,5,'/resources/images/quan.png'),(9,6,'/resources/images/quan.png'),(10,7,'/resources/images/quan.png'),(11,8,'/resources/images/quan.png'),(12,9,'/resources/images/quan.png'),(13,10,'/resources/images/quan.png'),(17,37,'/resources/images/download.jpg'),(18,37,'/resources/images/23ddb42a39d593e83d52c643853d172c.jpg'),(19,40,'/resources/images/10072-021_1.jpg'),(20,40,'/resources/images/5903-beach-shorts-orange-thumb.webp'),(21,41,'/resources/images/qưdqwdwqd.jpg'),(22,42,'/resources/images/b50ec8acfae277da3d80c7b2642f2b27.jpg'),(23,43,'/resources/images/dam-hoa-phu-nu-30-16.jpg'),(24,44,'/resources/images/quan-jean-nu-cap-cao-hot.jpg'),(25,45,'/resources/images/fdhfgjgdj-1198-1611896098.jpg'),(26,46,'/resources/images/tui-xach-nu-cao-cap-da-that-ELLY-ET100-3-1.jpg'),(27,47,'/resources/images/161077-mu-vanh-cong-thoi-trang-that-no-dieu-161075-vn.jpg'),(28,48,'/resources/images/2011100_WHITE_1.jpg'),(29,52,'/resources/images/7319bcc616b126262b8d4b0b258e0254_tn.jpg'),(30,53,'/resources/images/736853cba44dc7d26afd0e46078b9451.jpg'),(31,54,'/resources/images/8deffb894c1fc43fe467e31b485b87ee.jpg'),(32,55,'/resources/images/762fd8ca1f40126c0f45aad2bdfd77bd.jpg'),(37,65,'/resources/images/download _1_.jpg'),(38,66,'/resources/images/4e897c8bf2af55d2d3fca92f586d3c43.jpg'),(39,67,'/resources/images/adasd.jpg'),(40,68,'/resources/images/15fd8dea933fa39b52818465b5f8f62f.jpg'),(41,69,'/resources/images/feba136f26470cb5f598620eb0844011.jpg'),(42,70,'/resources/images/ao-len-nu _4_.jpg'),(43,71,'/resources/images/ao-khoac-gio-nam-xanh-lich-lam.jpg'),(44,72,'/resources/images/mcpRx_ao-bomber-nam-hoa-tiet-don-gian-nhung-rat-an-tuong.jpg'),(45,73,'/resources/images/non-1-2-dau-kinh-am-poc-den-nham.jpg');
/*!40000 ALTER TABLE `hinhanhsanpham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lichsutinhtrangdon`
--

DROP TABLE IF EXISTS `lichsutinhtrangdon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lichsutinhtrangdon` (
  `donhang` int NOT NULL,
  `tinhtrang` int NOT NULL,
  `ngaythang` date NOT NULL,
  PRIMARY KEY (`donhang`,`tinhtrang`) USING BTREE,
  KEY `LichSuTinhTrangDon_fk1` (`tinhtrang`) USING BTREE,
  CONSTRAINT `LichSuTinhTrangDon_fk0` FOREIGN KEY (`donhang`) REFERENCES `donhang` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `LichSuTinhTrangDon_fk1` FOREIGN KEY (`tinhtrang`) REFERENCES `loaitinhtrangdon` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichsutinhtrangdon`
--

LOCK TABLES `lichsutinhtrangdon` WRITE;
/*!40000 ALTER TABLE `lichsutinhtrangdon` DISABLE KEYS */;
INSERT INTO `lichsutinhtrangdon` VALUES (1,1,'2021-04-08'),(1,2,'2021-04-09'),(1,3,'2021-04-10'),(1,4,'2021-05-17'),(2,1,'2021-04-08'),(2,2,'2021-04-09'),(3,1,'2021-04-08'),(3,4,'2021-04-09'),(4,1,'2021-05-17'),(4,2,'2021-05-17'),(4,3,'2021-05-17');
/*!40000 ALTER TABLE `lichsutinhtrangdon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loaitinhtrangdon`
--

DROP TABLE IF EXISTS `loaitinhtrangdon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loaitinhtrangdon` (
  `maso` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`maso`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loaitinhtrangdon`
--

LOCK TABLES `loaitinhtrangdon` WRITE;
/*!40000 ALTER TABLE `loaitinhtrangdon` DISABLE KEYS */;
INSERT INTO `loaitinhtrangdon` VALUES (1,'Đang xác nhận'),(2,'Đang giao'),(3,'Đã giao'),(4,'Đã hủy');
/*!40000 ALTER TABLE `loaitinhtrangdon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sanpham`
--

DROP TABLE IF EXISTS `sanpham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sanpham` (
  `maso` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `noisx` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mota` varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `kichthuoc` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `gioitinhsudung` int NOT NULL,
  `giaban` int NOT NULL,
  `soluong` int NOT NULL,
  `diemdanhgia` float NOT NULL,
  `luotdanhgia` int NOT NULL,
  `danhmuccap2` int NOT NULL,
  `cuahang` int NOT NULL,
  `status` binary(1) NOT NULL,
  `ngaymo` date DEFAULT NULL,
  PRIMARY KEY (`maso`) USING BTREE,
  KEY `SanPham_fk0` (`danhmuccap2`) USING BTREE,
  KEY `SanPham_fk1` (`cuahang`) USING BTREE,
  FULLTEXT KEY `ten` (`ten`),
  CONSTRAINT `SanPham_fk0` FOREIGN KEY (`danhmuccap2`) REFERENCES `danhmuccap2` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `SanPham_fk1` FOREIGN KEY (`cuahang`) REFERENCES `cuahang` (`maso`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sanpham`
--

LOCK TABLES `sanpham` WRITE;
/*!40000 ALTER TABLE `sanpham` DISABLE KEYS */;
INSERT INTO `sanpham` VALUES (1,'Áo thun trắng','Việt Cộng','<p>Áo màu trắng rất xinh</p>','L',2,100000,3,5,1,2,1,_binary '1','2021-04-05'),(2,'Quần tây đen','Việt Nam','Chiếc quần màu đen rất xinh','L',0,200000,5,0,0,6,1,_binary '1','2021-04-05'),(3,'Quần tây đen 2','Việt Nam','Chiếc quần màu đen rất xinh','L',0,150000,5,0,0,6,1,_binary '1','2021-04-05'),(4,'Quần tây đen 3','Việt Nam','Chiếc quần màu đen rất xinh','L',0,1500000,0,0,0,6,1,_binary '1','2021-04-05'),(5,'Quần tây đen 4','Việt Nam','Chiếc quần màu đen rất xinh','L',0,150000,2,0,0,6,1,_binary '1','2021-04-05'),(6,'Quần tây đen 5','Việt Nam','Chiếc quần màu đen rất xinh','L',0,150000,1,0,0,6,1,_binary '1','2021-04-05'),(7,'Quần tây đen 6','Việt Nam','Chiếc quần màu đen rất xinh','L',0,150000,5,0,0,6,1,_binary '1','2021-04-05'),(8,'Quần tây đen 7','Việt Nam','Chiếc quần màu đen rất xinh','L',0,150000,10,0,0,6,1,_binary '1','2021-04-05'),(9,'Quần tây đen 8','Việt Nam','Chiếc quần màu đen rất xinh','L',0,150000,5,0,0,6,1,_binary '1','2021-04-05'),(10,'Quần tây đen 9','Việt Nam','Chiếc quần màu đen rất xinh','L',0,150000,0,0,0,6,1,_binary '1','2021-04-05'),(37,'Combo 3 áo thun Everest ','Việt Nam','<p>Combo 3 áo thun trơn nam thời trang Everest màu trắng đen xám Mô Tả: • Chất liệu thun mềm mại co giãn tốt , thoáng mát • Thiết kế thời trang phù hợp xu hướng hiện nay • Kiểu dáng đa phong cách • Đường may tinh tế sắc sảo • Áo thun được thiết kế vể đẹp trẻ trung năng động nhưng không kém phần mạnh mẽ. • Áo được thiết kế đẹp, chuẩn form, đường may sắc xảo, vải dày, mịn, thấm hút mồ hôi tạo sự thoải mái khi mặc! • Dễ dàng phối trang phục , thích hợp đi chơi đi làm đi dạo phố • Thích hợp cho sự kết hợp vứi quần jean, sọt,kaki! • Kích thước: Size XS, S, M , L , XL , XXL,XXXL Xuất xứ: Việt Nam Lưu ý : -1 combo là 3 áo, 3 màu như hình - Nếu quý khách muốn mặc rộng thoải mái thì nên tăng 1 size - Cam kết hàng giống hình 100%, hỗ trợ đổi trả hàng. #combo3aothun #aothun #aophong #aoformrong #aodentron #aotron #aounisex #aothununisex #aothuntron #aothuncatinh #Everest #aothuneverest</p>','L',0,99000,12,0,0,2,3,_binary '1','2021-05-17'),(40,'Quần short thể thao Everest','Việt Nam','<p>Quần short nam thể thao thời trang Everest - Quần short nam có kiểu dáng đơn giản mang phong cách thể thao Size M: Phù hợp người từ 45-50kg cao 1m65-1m75 Size L : Phù hợp người từ 50-60kg cao 1m65-1m75 Size XL: Phù hợp người từ 60-70kg cao 1m65-1m75 Size 2XL:Phù hợp người từ 70-80kg cao 1m65-1m75 - Thiết kế tôn được nét sang trọng, lịch lãm - Phối túi xéo ở trước và túi sau tiện dụng, giúp đựng những vật nhỏ cần thiết như: ví, chìa khóa... - Màu không bị lỗi mốt,dễ phối trang phục - Chất liệu vải cao cấp Hàn Quốc bền đẹp, co dãn tạo form dáng cho chiếc quần, tạo cảm giác thoải mái, tự tin cho người mặc. Thích hợp mặc nhà, dạo phố, tập gym... - Quần short màu đen - Vì hình shop tự chụp nên cam kết sản phẩm giống hình 100% LƯU Ý: - Không nên chà xát mạnh bằng bàn chải, tránh phơi dưới ánh nắng gắt trực tiếp. - Khuyến cáo nên giặt bằng tay sẽ sử dụng lâu hơn - Trong quá trình vận chuyển hàng khó tránh khỏi sản phẩm có thể bị nhàu hoặc mất nếp gấp, khuyến cáo khách trước khi sử dụng hàng nên giặt ủi! -Người có bụng nên tăng 1 size Xuất xứ: Việt Nam. #quanshort #quanthunnam #quanshortnam #quanthethao #quanmacnhanam #quanshortthunnam #quannam&nbsp;</p>','M',0,50000,10,0,0,8,3,_binary '1','2021-05-17'),(41,'Áo sơ mi nữ tay bồng Rosara SP84','Đài Loan','<p>- Chất liệu vải: Lụa cát - Hàng đủ size: S, M, L - Màu sắc: Trắng - Xuất xứ: Thời trang Rosara - Hướng dẫn giặt ủi: nên giặt tay, không giặt cùng sản phẩm màu</p><p>- Sản phẩm 100% giống mô tả - Tư vấn nhiệt tình, chu đáo luôn lắng nghe khách hàng để phục vụ tốt. - Giao hàng nhanh đúng tiến độ không phải để quý khách chờ đợi lâu để nhận hàng.&nbsp;</p>','S',1,90000,15,0,0,1,3,_binary '1','2021-05-17'),(42,'Đầm body đuôi cá phối cổ BEMINE ','Việt Nam','<p>- Chất liệu:BỐ XƯỚC - Thông số Size: S: 85-68-86 M: 90-73-92&nbsp; L: 94-76-95 XL: 100-84-100 - Chiều dài đầm: 100cm&nbsp; - Số đo ra vai đầm:30cm (size M + 1,5cm . size L + 3cm so với size S) - Số đo cửa tay đầm: 26cm (size M + 1,5cm . size L + 3cm so với size S)&nbsp; - Số đo chiều dài tay đầm: 31cm (size M + 1,5cm . size L + 3cm so với size S)&nbsp; - Chi tiết sản phẩm:&nbsp; + Đầm 1 lớp&nbsp; + Đầm không có túi + Đầm không dây cột eo ? Đừng ngần ngại ib cho #bemine để được tư vấn nhé!!! ? CHẤT LƯỢNG TẠO NÊN THƯƠNG HIỆU! ? ? ĐẾN VỚI #BEMINE ĐỂ XUA TAN NỖI LO MUA HÀNG ONLINE #thoitrangnu #damcongso #dambemine #damom #dambody #damsuong #damxoe #damthietke #bemine</p>','XL',1,238000,3,0,0,10,3,_binary '1','2021-05-17'),(43,'Đầm tay phồng phối trắng BEMINE ','Nhật','<p>- Chất liệu: COTTON CHÉO - Thông số Size: S: 85 - 69 - free M: 89 - 72 - free&nbsp; L: &nbsp;94-77 - free XL: 97 - 82 - free&nbsp; - Chiều dài đầm: 96cm&nbsp; - Số đo ra vai đầm:33 cm (size M + 1,5cm . size L + 3cm so với size S) - Số đo cửa tay đầm: 24cm (size M + 1,5cm . size L + 3cm so với size S)&nbsp; - Số đo chiều dài tay đầm: 32cm (size M + 1,5cm . size L + 3cm so với size S)&nbsp; - Chi tiết sản phẩm:&nbsp; + Đầm 1 lớp&nbsp; + Đầm không có túi + Đầm không dây cột eo ? Đừng ngần ngại ib cho #bemine để được tư vấn nhé!!!</p>','XXL',1,217000,5,0,0,10,3,_binary '1','2021-05-17'),(44,'Jean nữ','Việt Nam','<p>Thông tin chung sản phẩm • Tên sản phẩm: Quần Jean Nữ Màu Xanh Nhạt Ankle Skinny Lưng Cao Aaa Jeans – UCSD RAYON • Dáng quần: skinny • Kiểu lưng: Cao • Màu sắc: Xanh • Size: 26, 27, 28, 29, 30, 31, 32 • Thành phần vải: Cotton, Rayon, Spandex • Xuất xứ: Việt Nam • Mạc da thương hiệu phía sau lưng Thông số sản phẩm Các bạn vui lòng xem kỹ thông tin sản phẩm để chọn size cho phù hợp. Nếu số đo của bạn nằm giữa 2 size và bạn không biết chọn size nào thì bạn nên chọn size nhỏ hơn do quần thun giãn nhiều. Hướng dẫn giặt sản phẩm • Không giặt chung với quần áo trắng • Lộn trái sản phẩm trước khi giặt • Không dùng thuốc tẩy • Giặt với nước ấm khi cần thiết • Không giặt khô • Tránh phơi trực tiếp sản phẩm dưới ánh nắng mặt trời Chính sách bảo hành • Khách hàng ở TP HCM có thể mang hóa đơn đến trực tiếp cửa hàng của AAA JEANS để đổi sản phẩm khi không vừa size hay không ưng ý. • Các khách hàng không ở TP HCM, vui lòng thực hiện đổi trả sản phẩm theo chính sách của sàn. Cam kết của chúng tôi • Xác nhận đơn hàng và giao hàng cho các bên vận chuyển trong vòng 3 giờ sau khi phát sinh đơn hàng. • Các sản phẩm đều đúng như mô tả • Tất cả những hình ảnh sản phẩm của AAA JEANS đều là hình ảnh thực tế của sản phẩm chụp với mẫu thật.</p>','S,M,L,XL',1,589000,2,0,0,5,3,_binary '1','2021-05-17'),(45,'Faya - Túi xách da trơn ','Pháp','<p>Độc đáo , trẻ trung với điểm nhấn ổ khóa vuông cách điệu cùng thiết kế đơn giản , thời thượng chính là mẫu túi cần có trong tủ đồ bất kì cô gái nào . Nổi bật với các phối màu đơn giản trung tính tạo nổi bật được trang phục Mã sản phẩm : T842 Kích thước : 20 * 13.5 * 8 cm Chất liệu : da PU Màu : đen , trắng Cam kết chất lượng : - Hàng 100% như hình thật - Bảo hành trong vòng 3 tháng - Đổi hàng miễn phí trong vòng 7 ngày - Vệ sinh túi trọn đời</p>','M',1,2899000,1,0,0,14,3,_binary '1','2021-05-17'),(46,'Túi kẹp nách TAKASTORE','Pháp','<p>Túi xách nữ, túi kẹp nách thời trang HÀN QUỐC TAKASTORE ?ĐƯỢC XEM HÀNG TRƯỚC KHI NHẬN, KHÔNG GIỐNG HÌNH HOÀN TIỀN 100%. ?Nhấn Follow ( theo dõi) shop để mua hàng giá sỉ. Giá sản phẩm đang giảm là giá sỉ nhé khách. ===================== ❤Thông tin mô tả sản phẩm: - Kích thước: ngang 24 cm, cao 32 cm - Chất liệu: Chất da mềm và dày dặn.Túi cực kì chắc chắn, không sợ dứt quai khi mang nặng nha.. Nhanh tay hốt ngay 1 em về cho kịp trend nha các nàng. - Hàng thật y hình 100% nhé khách. Túi xách nữ vừa a4 viền đinh, túi tote da giá rẻ, túi xách nữ công sở, túi xách nữ vừa giáo án đi dạy ========================= ?HƯỚNG DẪN BẢO QUẢN TÚI ĐEO CHÉO-TÚI XÁCH NỮ Dùn khăn ẩm lau sạch khi bụi bẩn Nên để nơi khô ráo, thoáng mát</p>','S',1,5900000,1,0,0,14,3,_binary '1','2021-05-17'),(47,'Mũ vành đi biển','Việt Nam','<p>Khoản mục: mũ rơm nhỏ hạt tiêu Danh mục sản phẩm: mũ vành lớn Giới tính áp dụng: nữ Chất liệu: Rơm Phương pháp đan: móc tay Các yếu tố phổ biến: cung Mô hình: một màu Mùa thích hợp: xuân, thu, hạ</p>','L',1,100000,7,0,0,11,3,_binary '1','2021-05-17'),(48,'Áo Sơ Mi Nam Tay Ngắn','Đài Loan','<p>THÔNG TIN SẢN PHẨM - Chất vải sờ mịn không bai, không nhăn, không xù. - Mếch cổ và tay làm bằng chất liệu cao cấp, không sợ bong tróc. - Fom Body cực chuẩn, ôm trọn bờ vai mặc cực trẻ trung và phong cách, phù hợp đi chơi và đi làm. - Xuất xứ: Việt Nam SHOP CAM KẾT - Giá cạnh tranh nhất do chính nhà máy sản xuất với số lượng lớn. - Uy tín bán hàng được đặt lên hàng đầu, không kinh doanh chộp giật. - Shop hỗ trợ đổi size, đổi trả nếu có lỗi từ nhà sản xuất. - Rất mong nhận được ý kiến đóng góp của Quý khách hàng để chúng tôi cải thiện chất lượng dịch vụ tốt hơn.</p>','XL',0,355000,17,0,0,1,3,_binary '1','2021-05-17'),(52,'Quần Tây Nam Biluxury ','Việt Nam','<p>THÔNG TIN CHI TIẾT SẢN PHẨM * Quần âu nam Biluxury được may từ chất liệu vải tuyết mưa mềm mát, thoáng khí, thấm hút mồ hôi tốt. - Thành phần vải: 70% poly, 28% rayon, 2% spandex. - Mặt vải dày dặn, ít nhăn nhàu, tạo dáng ống đứng, ôm vừa phải gọn gàng và lịch lãm. - Sản phẩm có đường chỉ may tỉ mỉ, tinh tế. - Thiết kế cổ điển với khóa kéo, cài khuy, đỉa quần nhỏ, túi trước, sau. - Quần âu màu sắc đơn giản, dễ mặc, dễ kết hợp với nhiều kiểu trang phục khác nhau cho nhiều dịp và nhiều hoàn cảnh sẽ giúp bạn nam thể hiện phong cách lịch lãm, trẻ trung của mình mỗi khi ra ngoài. ---------------------------------------------- * Bảng size Biluxury: - Size 29 : Cao 1,55 đến 1,62; nặng 52-60kg - Size 30 : Cao 1,63 - 1,70; nặng 61-68 kg - Size 31 : Cao 1,71 - 1,76; nặng 69-72kg - Size 32 : Cao 1,77 - 1,82; nặng 73-78kg * Hướng dẫn bảo quản - Giặt máy với chu kỳ trung bình và vòng quay ngắn - Giặt với nhiệt độ tối đa 30 độ C - Sấy ở nhiệt độ thường - Là ủi ở nhiệt độ thấp</p>','M',0,240000,18,0,0,6,4,_binary '1','2021-05-17'),(53,'Quần Short Nam Kaki VICE','Trung Quốc','<p>Quần Đùi Nam Chất Kaki Mềm Mịn VICERO ? CHÍNH SÁCH Là khách hàng của SHOP, bạn sẽ được: ? Cam kết chất lượng và mẫu mã sản phẩm giống với hình ảnh. ? Hoàn tiền nếu sản phẩm không giống với mô tả. ? Cam kết được đổi trả hàng trong vòng 2 ngày. ------------------------------------ ? HƯỚNG DẪN CÁCH ĐẶT HÀNG ⏩ Cách chọn size: Shop có bảng size mẫu. Bạn NÊN INBOX, cung cấp chiều cao, cân nặng để SHOP TƯ VẤN SIZE ⏩ Mã sản phẩm đã có trong ảnh ⏩ Cách đặt hàng: Nếu bạn muốn mua 2 sản phẩm khác nhau hoặc 2 size khác nhau, để được freeship - Bạn chọn từng sản phẩm rồi thêm vào giỏ hàng - Khi giỏ hàng đã có đầy đủ các sản phẩm cần mua, bạn mới tiến hành ấn nút “ Thanh toán” ⏩ Shop luôn sẵn sàng trả lời inbox để tư vấn ------------------------------------ ? THÔNG TIN CHI TIẾT ? Chất liệu: vải kaki ?Màu sắc: Đen - Xanh than - Ghi xám - Be vàng - Ghi Rêu - Xanh Dương ? Xuất xứ: Việt Nam ------------------------------------ ? THÔNG TIN SẢN PHẨM Mỗi khi mùa hè ghé qua, items quần short nam kaki hàn quốc luôn được các chàng trai ưu ái trong tủ đồ của mình. Nếu như những chiếc quần dài làm bạn cảm thấy bí bức, khó chịu thì những chiếc quần short kaki(6 màu hàn quốc) chắc chắn sẽ mang đến sự thoải mái, dễ chịu. Chất liệu vải kaki đẹp, mềm, mịn, khả năng thấm hút mồ hôi tốt luôn tạo cảm giác mát mẻ, thoải mái khi mặc.. Chất vải kaki tuy mộc mạc, tự nhiên nhưng không đơn điệu mang đến cho nam giới phong cách thời trang lịch lãm không quá cầu kì. Từng đường may tinh tế, chỉn chu, màu sắc đa dạng, tươi mát chắc chắn sẽ làm vừa lòng những chàng trai khó tính nhất. Bạn có thể diện quần short kaki nam đi chơi, đi dạo, đi biển,...đều NỔI BẬT VÀ PHONG CÁCH. Hãy SỞ HỮU NGAY MỘT CHIẾC QUẦN SHORT KAKI NAM PHONG CÁCH HÀN QUỐC về tủ đồ của bạn nhé! BẢNG SiZE: Size M-29:cao 1m6-1m65,nặng 50-55kg Size L-30:Cao 1m66-1m70,nặng 56-60kg Size XL-31:Cao 1m70-1m74,nặng 61-65kg Size XXL-32:Cao 1m73-1m77,nặng 66-70kg Size 3XL-33:Cao 1m75-1m78,nặng 71-75kg</p>','XS',0,130000,12,0,0,8,4,_binary '1','2021-05-17'),(54,'Áo Polo Nam Vải Cá Sấu','Đài Loan','<p>- Sản phẩm giống như mô tả. - Bảo hành 12 Tháng với tất cả đơn hàng lỗi nhà sản xuất. - Hỗ trợ một đổi một trong 07 ngày (nếu có lỗi từ nhà sản xuất) - Hàng hóa được kiểm tra và đóng gói cẩn thận trước khi giao. * Thông tin sản phẩm: - Áo phông nam cổ bẻ Việt Nam. - Áo cotton cổ bẻ, ngắn tay. - Made in Vietnam. - Form dáng body vừa người , phù hợp du lịch, du xuân, dạo phố, picnic, cafe.... - Áo thun nam cổ bẻ họa tiết trẻ trung. - Áo thun nam VNXK là trang phục giúp các chàng trai làm mới phong cách của chính mình. - Thiết kế cổ bẻ xẻ trụ đơn giản, cực kỳ năng động, khỏe khoắn, nhưng vẫn không kém phần sành điệu, hợp mốt. - Chất liệu thun cao cấp mềm mại, thông thoáng và co giãn tối ưu, luôn tạo cảm giác thoải mái khi mặc. - Màu sắc trẻ trung, dễ dàng phối cùng nhiều kiểu jeans bụi phủi, kaki lịch lãm. - Phù hợp đi làm, đi chơi. - Hàng có sẵn đủ size: M, L, XL, XXL, XXXL.</p>','L',0,145000,15,0,0,2,4,_binary '1','2021-05-17'),(55,'Áo Sơ Mi Nam','Nhật','<p>THÔNG TIN SẢN PHẨM - Sơ mi lụa không nhăn, không nhàu, không ra màu - Mặt mát, thoải mái, bao rẻ bao đẹp HƯỚNG DẪN CHỌN CHỌN SIZE PHÙ HỢP Size M:cân nặng từ 50 - 60 kg, chiều cao từ 1m55 đến 1m65 Size L: cân nặng từ 61 kg - 65 kg, chiều cao từ 1m66 đến 1m70 Size XL: cân nặng từ 65 kg -70 kg , chiều cao từ 1m70 đến 1m75 Size XXL. cân nặng từ 71kg - 75kg, chiều cao từ 1m72 đến 1m76 Size XXXL cân nặng từ 76kg - 80kg, chiều cao từ 1m74 đến 1m80</p>','M',0,340000,9,0,0,1,4,_binary '1','2021-05-17'),(65,'Quần âu nam Ikemen','Việt Nam','<p>1. GIỚI THIỆU SẢN PHẨM Quần Âu Nam ống côn , chất vải tuyết mưa cao cấp chính là gợi ý tuyệt vời cho nam giới mỗi khi lựa chọn trang phục mỗi ngày. Với những mẫu quần âu nam thiết kế đơn giản và toát lên vẻ lịch lãm tinh tế, mang đến phong cách thời trang trẻ trung, năng động chắc chắn sẽ là lựa chọn hoàn hảo cho chàng trai hiện đại, nam tính. Những chiếc quần âu nam ống côn , dáng ôm body dù kết hợp với áo sơ mi, áo phông đều NỔI BẬT, THOẢI MÁI và PHONG CÁCH. Với form dáng vừa vặn các chàng có thể tự tin khoe dáng cực chuẩn của mình. Hãy bổ sung ngay vào tủ đồ item này để diện thật chất nhé! 2. THÔNG TIN CHI TIẾT ?Màu sắc : ĐEN , XANH THAN , XÁM ĐẬM , GHI SÁNG , XANH HÒA BÌNH , KEM SỮA ? Chất liệu : Tuyết mưa cao cấp , thấm hút mồ hôi ? Chất vải sờ mịn không bai, không nhăn, không xù ? Quy cách, tiêu chuẩn đường may tinh tế, tỉ mỉ trong từng chi tiết ? Kiểu dáng: Thiết kế đơn giản, dễ mặc, dễ phối đồ ? Form body Hàn Quốc mang lại phong cách trẻ trung, lịch lãm ? Chất lượng sản phẩm tốt, giá cả hợp lý</p>','L',0,150000,11,0,0,7,4,_binary '1','2021-05-17'),(66,'Quần Jogger Suông Unisex ','Việt Nam','<p>Hướng dẫn sử dụng sản phẩm :&nbsp;</p><p>- Giặt ở nhiệt độ bình thường, với đồ có màu tương tự.&nbsp;</p><p>- Không được dùng hóa chất tẩy.&nbsp;</p><p>- Hạn chế sử dụng máy sấy và ủi (nếu có) thì ở nhiệt độ thích hợp.</p>','M',2,200000,10,0,0,9,4,_binary '1','2021-05-17'),(67,'Áo Sơ Mi Lụa Chéo','Nhật','<p>Áo sơ mi ngắn tay hoạ tiết gương mặt cổ Vest vải lụa mềm mại * Thông tin sản phẩm : Kiểu dáng : Thời trang unisex dành cho Nam và Nữ,( lớn hơn form thường ). Chất liệu : Lụa Màu sắc : Đen hoạ tiết Size: M L XL (Form rộng - Phù hợp với Nam và Nữ)</p>','M',2,350000,6,0,0,1,4,_binary '1','2021-05-17'),(68,'Áo thun cộc tay','Trung Quốc','<p>✪ Áo Thun Tay Lỡ ✪ Chất liệu: 100% cotton ✪ Size S (dưới 55kg) và Freesize (dưới 80kg) ✪ Áo thun mã HT sản xuất tại Việt Nam và thiết kế trực tiếp bởi MINA ✪ Áo thun mã T nhập khẩu trực tiếp từ Trung Quốc ✪ Số đo tùy form dáng sản phẩm - Vui lòng CHAT để được tư vấn kỹ hơn - Dài áo 70-75 cm - Ngang áo 47-52cm - Vai 50- 53cm Nhiều màu sắc cho khách dễ dàng lựa chọn</p>','L',2,236000,15,0,0,2,5,_binary '1','2021-05-17'),(69,'Áo thun WAKE Unisex','Ý','<p>Áo thun _ Items không thể thiếu trong tủ đồ của mỗi người Đặc biệt, với chiếc ✨Áo_thun_form_rộng_giấu_quần ✨bên Shop sẽ làm cho bạn trở nên thật sự cuốn hút trong ánh nhìn của mọi người. ?Chất liệu : thun cotton dày dặn, hình in nhiệt 3 lớp sắc nét ?Form : 3 Size ✔️M : &lt; 45kg , Cao &lt; 1.6m ✔️L : 46kg _ 65kg , Cao 1.6m _ 1.7m ✔️XL : 66kg _ 75kg , Cao 1.7m _ 1.75m ?Lưu ý : Áo dạng Unisex mặc form rộng rộng mới đẹp, khách nên chọn size rộng hơn số cân nặng mình xíu nhé ❤️</p>','L',2,250000,5,0,0,2,5,_binary '1','2021-05-17'),(70,'Áo dệt kim dài tay','Hàn Quốc','<p>Lưu ý: Sản phẩm này có dáng rộng và có thể được mua với cân nặng đề xuất.&nbsp;</p><p>Nguồn hàng:&nbsp;</p><p>Hàng có sẵn Kiểu dáng áo:&nbsp;</p><p>Dáng rộng Phong cách: Đơn giản/Phong cách Hàn Quốc Chiều dài áo/Chiều dài tay áo: Kiểu thông thường/ tay lỡ/ tay dài vừa Vải/Chất liệu: Khác/Sợi visco Thành phần vải: 31% (bao gồm) -50% (bao gồm) Loại cổ áo: Cổ chữ V Màu sắc: Xanh dương, hồng, đen, trắng, xanh lá nhạt</p>','M',1,234000,14,0,0,4,5,_binary '1','2021-05-17'),(71,'Áo khoác kaki unisex','Việt Nam','<p>Thông tin chi tiết của sản phẩm Áo khoác kaki unisex nam nữ TH Store - Xuất xứ: Việt Nam - Áo được sản xuất từ vải kaki loại 1, không xù, không phai màu, không gây rát da - Chuẩn form, thoải mái, màu sắc trung, tôn dáng, phù hợp với mọi lứa tuổi - Sản phẩm thiết kế đa dạng, nhiều màu sắc, tạo sự khoẻ khoắn, cá tính cho người mặc - Áo gồm 5 size: M, L, XL, XXL, 3XL Hướng dẫn sử dụng, bảo quản đối với sản phẩm Áo khoác kaki unisex nam nữ TH Store - Lựa chọn áo khoác kết hợp với quần kaki là bạn có một bộ cánh hoàn hảo, thích hợp sử dụng cho các dịp đi chơi, gặp gỡ bạn bè - Không nên giặt chung với những loại áo khác, nên lột trái áo khoác khi giặt - Nên giặt áo khoác bằng tay, giặt bằng máy sẽ dễ làm hỏng vải áo. - Không ngâm đồ trong xà phòng quá lâu, không nên sử dụng các chất tẩy rửa - Không nên để áo ở những nơi ẩm ướt, với tính chất hút ẩm, hút nước tốt, áo thun dễ bị ẩm mốc, thậm chí để lại những vết ố trên vải áo</p>','L',2,350000,7,0,0,3,5,_binary '1','2021-05-17'),(72,'Áo khoác nam thể thao','Mỹ','<p>Thông tin chi tiết của sản phẩm Áo khoác kaki unisex nam nữ TH Store - Xuất xứ: Việt Nam - Áo được sản xuất từ vải kaki loại 1, không xù, không phai màu, không gây rát da - Chuẩn form, thoải mái, màu sắc trung, tôn dáng, phù hợp với mọi lứa tuổi - Sản phẩm thiết kế đa dạng, nhiều màu sắc, tạo sự khoẻ khoắn, cá tính cho người mặc - Áo gồm 5 size: M, L, XL, XXL, 3XL Hướng dẫn sử dụng, bảo quản đối với sản phẩm Áo khoác kaki unisex nam nữ TH Store - Lựa chọn áo khoác kết hợp với quần kaki là bạn có một bộ cánh hoàn hảo, thích hợp sử dụng cho các dịp đi chơi, gặp gỡ bạn bè - Không nên giặt chung với những loại áo khác, nên lột trái áo khoác khi giặt - Nên giặt áo khoác bằng tay, giặt bằng máy sẽ dễ làm hỏng vải áo. - Không ngâm đồ trong xà phòng quá lâu, không nên sử dụng các chất tẩy rửa - Không nên để áo ở những nơi ẩm ướt, với tính chất hút ẩm, hút nước tốt, áo thun dễ bị ẩm mốc, thậm chí để lại những vết ố trên vải áo</p>','XL',0,500000,4,0,0,3,5,_binary '1','2021-05-17'),(73,' Mũ Bảo Hiểm 1/2','Việt Nam','<p>✔Cấu tạo của mũ bảo hiểm 1. Vỏ mũ: Được sản xuất bằng nhựa ABS nguyên sinh có độ cứng cao, lớp nhựa dày, khi cầm rất chắc tay, bề mặt láng mịn. 2. Lõi xốp: Lõi xốp làm bằng nhựa EPS là bộ phận quan trọng để bảo vệ bộ não và hấp thụ xung động khi xảy ra va đập, được thiết kế với độ dày đạt chuẩn 3. Vải lót sản xuất từ chất liệu Polyester, đệm bảo vệ tạo cảm giác êm ái và thoải mái. khi sử dụng 4. Quai đeo được sản xuất từ sợi tổng hợp và nhựa Acetic chất lượng cao, chịu lực tốt và độ dài linh hoạt. 5. Đạt chuẩn Quatest về chất lượng mũ bảo hiểm. 6. Trọng lượng: 0.5 gram 7. Size: M ( vòng đầu dưới 55cm) Size L ( vòng đầu từ 55-60cm) Hướng dẫn cách đo : đo vòng đầu trên tai khoảng 2-3cm. 8. Màu sắc: Vàng, Hồng Trắng 9. Made in: Việt Nam 10. Tình trạng: Mới 100% 11. Bảo hành chính hãng 12 tháng.&nbsp;</p>','L',2,161000,20,0,0,12,5,_binary '1','2021-05-17');
/*!40000 ALTER TABLE `sanpham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('IsIjVsSWVLDLYKrUNthseOCSDJHs2lQm',1621348994,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"auth\":true,\"authUser\":{\"maso\":1,\"username\":\"lyduynam\",\"password\":\"$2a$10$/opwS1Nykr279ai6NkIa/.Ns.fIahUGQx2iubm5sGTWN47ZVC8Imy\",\"hoten\":\"Lý Duy Nam\",\"ngaysinh\":\"15/03/2000\",\"sdt\":\"0123456789\",\"email\":\"lyduynam@gmail.com\",\"avatar\":\"/resources/images/default_avatar.png\",\"vaitro\":0,\"status\":{\"type\":\"Buffer\",\"data\":[49]},\"ngaymo\":\"2021-04-04T17:00:00.000Z\",\"diachi\":\"TPHCM\"},\"tempcart\":{\"sl\":0,\"sanpham\":null},\"shop\":null,\"cart\":{\"taikhoan\":1,\"tongsosanpham\":0,\"tonggiatien\":0},\"fakeProduct\":{\"ten\":\"\",\"noisx\":\"\",\"mota\":\"\",\"kichthuoc\":\"\",\"gioitinhsudung\":true,\"giaban\":0,\"soluong\":0,\"diemdanhgia\":0,\"luotdanhgia\":0,\"danhmuccap2\":1,\"cuahang\":1,\"status\":1,\"ngaymo\":null,\"maso\":73},\"retUrl\":\"/\",\"logout\":0}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taikhoan`
--

DROP TABLE IF EXISTS `taikhoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taikhoan` (
  `maso` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `hoten` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ngaysinh` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sdt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `vaitro` int NOT NULL,
  `status` binary(1) NOT NULL,
  `ngaymo` date DEFAULT NULL,
  `diachi` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`maso`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taikhoan`
--

LOCK TABLES `taikhoan` WRITE;
/*!40000 ALTER TABLE `taikhoan` DISABLE KEYS */;
INSERT INTO `taikhoan` VALUES (1,'lyduynam','$2a$10$/opwS1Nykr279ai6NkIa/.Ns.fIahUGQx2iubm5sGTWN47ZVC8Imy','Lý Duy Nam','15/03/2000','0123456789','lyduynam@gmail.com','/resources/images/default_avatar.png',0,_binary '1','2021-04-05','TPHCM'),(2,'lehoangphuc','$2a$10$/opwS1Nykr279ai6NkIa/.Ns.fIahUGQx2iubm5sGTWN47ZVC8Imy','Lê Hoàng Phúc','01/01/2000','0123456789','lehoangphuc@gmail.com','/resources/images/default_avatar.png',1,_binary '1','2021-04-05','TPHCM'),(3,'luuthiennhan','$2a$10$/opwS1Nykr279ai6NkIa/.Ns.fIahUGQx2iubm5sGTWN47ZVC8Imy','Lưu Thiện Nhân','01/01/2000','0123456789','nhanluu838@gmail.com','/resources/images/default_avatar.png',0,_binary '1','2021-04-05','TPHCM'),(4,'nguyenanhduy','$2a$10$/opwS1Nykr279ai6NkIa/.Ns.fIahUGQx2iubm5sGTWN47ZVC8Imy','Nguyễn Anh Duy','01/01/2000','0123456789','nguyenanhduy@gmail.com','/resources/images/default_avatar.png',0,_binary '1','2021-03-05','TPHCM'),(5,'admin','$2a$10$/opwS1Nykr279ai6NkIa/.Ns.fIahUGQx2iubm5sGTWN47ZVC8Imy','Admin','15/03/2000','0123456789','adminFashionEcommerce@gmail.com','/resources/images/default_avatar.png',0,_binary '1','2021-04-05','TPHCM'),(6,'18127159','$2a$10$/opwS1Nykr279ai6NkIa/.Ns.fIahUGQx2iubm5sGTWN47ZVC8Imy','Duy-Nam Ly',NULL,NULL,'duynamvt79@gmail.com','images/default_avatar.png',0,_binary '0',NULL,'TPHCM'),(8,'minhquan','$2a$10$/opwS1Nykr279ai6NkIa/.Ns.fIahUGQx2iubm5sGTWN47ZVC8Imy','Nguyễn Minh Quân',NULL,NULL,'nhanluu838@gmail.com','/resources/images/default_avatar.png',1,_binary '1','2021-05-17',NULL),(9,'lecaotuananh','$2a$10$3zAphu9X/T0E167vgcb8aOOh0nv1Uclh2vXhq30PYO.JzBPIUGQn2','Lê Cao Tuấn Anh',NULL,NULL,'nhanluu838@gmail.com','/resources/images/default_avatar.png',1,_binary '1','2021-05-17',NULL),(10,'chanthienmy','$2a$10$nm.ula2oIK06FRPEhSYZA.AZTOVhEIUvwHpNzqqfPKw3Y0C9N4IXS','chanthienmy',NULL,NULL,'nhanluu838@gmail.com','/resources/images/default_avatar.png',1,_binary '1','2021-05-17',NULL),(11,'lmthanh','$2a$10$J9pzR8PqKDWBCuN8wiaI6OFYqcoJ1JZOmJyj.7oqnFxppQZiGk57q','Lê Ninh Thành',NULL,NULL,'nminh7953@gmail.com','/resources/images/default_avatar.png',1,_binary '1','2021-05-17',NULL);
/*!40000 ALTER TABLE `taikhoan` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-17 21:45:30
