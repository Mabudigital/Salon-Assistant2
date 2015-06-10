document.addEventListener("deviceready",init, false);
var cust = {};
cust.db = null;
var image = "";
//customer database
cust.openDb = function(){
	if(window.sqlitePlugin !== undefined){
		cust.db = window.sqlitePlugin.openDatabase("customers_db", "1.0", "customersdb", 1000000);
	} else {
	// For debugging in simulator fallback to native SQL Lite	
		cust.db = window.openDatabase("customers_db", "1.0", "customersdb", 1000000);
	}
}
//create table
cust.createTable = function(){
	cust.db.transaction(function(tx){
		//tx.executeSql('DROP TABLE customers');
		tx.executeSql('CREATE TABLE IF NOT EXISTS customers(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL, phone VARCHAR(255) NULL,email VARCHAR(255) NULL,birthday VARCHAR(255) NOT NULL,sex VARCHAR(255) NOT NULL, alergies VARCHAR(255) NULL, lastvisit VARCHAR(255) NULL, treatments VARCHAR(255) NULL, cut VARCHAR(255) NULL, color VARCHAR(255) NULL, hairtype VARCHAR(255) NULL, scalptype VARCHAR(255) NULL, products VARCHAR(255) NULL, image VARCHAR(255) NULL)');
	});
}
function init(){
	cust.openDb();
	cust.createTable();
	pic.openDb();
	pic.createTable();
	getAllTheData();
}
//insert record
cust.insertRecord = function(n,p,e,bd,s,al,lv,tr,ct,cl,ht,st,pr){
	cust.db.transaction(function(tx){
		tx.executeSql('INSERT INTO customers(name,phone,email,birthday,sex,alergies,lastvisit,treatments,cut,color,hairtype,scalptype,products) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
			[n,p,e,bd,s,al,lv,tr,ct,cl,ht,st,pr],
			cust.onSuccess,
			cust.OnError);
	});
} 
//function will be called when process succeed
cust.onSuccess = function (tx, r){
	/*navigator.notification.alert(
        'Done!',  // message
        null,         // callback
        'Salon Assistant',            // title
        'Ok'                  // buttonName
    );*/
	$('#user-info').trigger("reset");
	$('#no-customer').remove();
	$('#customerlist').html("");
	getAllTheData();
	window.location.replace('#customerprofile');
}
cust.onUpdateSuccess = function (tx, r){
	getAllTheData();
	window.location.replace('#customerprofile');
	$('#submiteditcustomer').hide();
	$('#customeredit input,#customeredit select').prop("disabled",true);
}
//function will be called when process succeed
cust.onError = function (tx, e){
	console.log("SQLite error: "+e.message);
}
//update table
cust.updateRecord = function(n,p,e,bd,s,al,lv,tr,ct,cl,ht,st,pr,id) {
	cust.db.transaction(function(tx) {
		tx.executeSql("UPDATE customers SET name=?,phone=?,email=?,birthday=?,sex=?,alergies=?,lastvisit=?,treatments=?,cut=?,color=?,hairtype=?,scalptype=?,products=? WHERE id = ?",
                 [n,p,e,bd,s,al,lv,tr,ct,cl,ht,st,pr,id],
                 cust.onUpdateSuccess,
                 cust.onError);
	});
}
//delete record
cust.deleteRecord = function(id) {
	navigator.notification.confirm(
		"Are you sure?", 
		function(deleteButtonIndex){
			ConfirmDelete(id,deleteButtonIndex);
		}, 
		"Delete Customer", 
		"Yes,No"
	); 
//return false;
};
function ConfirmDelete(id,dstat){
	if(dstat == "1"){
		cust.db.transaction(function(tx){tx.executeSql("DELETE FROM customers WHERE id = ?",[id],cust.onSuccess,cust.onError);});
		$("#cust"+id).hide("slow").remove();
		pic.deleteRecord(id);
	}else{
		return false;
	};
};
//select all from customer_db
cust.selectAllRecords = function(fn) {
	cust.db.transaction(function(tx){tx.executeSql("SELECT * FROM customers", [],fn,cust.onError);});
}
function getAllTheData() {
	var render = function (tx, rs) {
	// rs contains our SQLite recordset, at this point you can do anything with it
	// in this case we'll just loop through it and output the results to the console
		if(rs.rows.length ==0){$('#customerlist').html("<div id='no-customer' style='text-align:center'>No customers already</div>");
		}else{
			for (var i = 0; i < rs.rows.length; i++) {
				var rows = rs.rows.item(i);
				image = rows['image'];
				if((image == null || image == "") && rows['sex'] == 'Male'){image = "images/noimagemale.jpg";}else if((image == null || image == "") && rows['sex'] == 'Female'){image = "images/noimagefemale.jpg";}
				$('#customerlist').append("<li id='cust'"+rows['id']+"><a href='#customerdetails' data-role='none' onclick='getCustomerData(\""+rows['id']+"\"),getCustomerPictureData(\""+rows['id']+"\")'><img id='pic"+rows['id']+"' src='"+image+"'/><div class='custlistinfo'><div class='custlistname'>"+rows['name']+"</div><div class='custlistlastvisit'>Last visit: "+rows['lastvisit']+"</div></div></a></li>");
				$("#apnmtcustlist").append("<option value='"+rows['name']+"'>"+rows['name']+"</option>");
			}
		}
	}
	cust.selectAllRecords(render);
}
//select customer record
cust.selectCustRecords = function(id,fd) {
	cust.db.transaction(function(td) {
		td.executeSql("SELECT * FROM customers WHERE id=?", [id],
				  fd,
				  cust.onError);
	});
}
function getCustomerData(id) {
	var image = "";
	var renderDet = function (td, rs) {
		// rs contains our SQLite recordset, at this point you can do anything with it
		// in this case we'll just loop through it and output the results to the console
		for (var i = 0; i < rs.rows.length; i++) {
			//console.log(rs.rows.item(i));
			var rows = rs.rows.item(0);
			image = rows['image'];
			if((image == null || image == "") && rows['sex'] == 'Male'){image = "images/noimagemale.jpg";}else if((image == null || image == "") && rows['sex'] == 'Female'){image = "images/noimagefemale.jpg";}
			$('#custdetl #name').html("<img class='custprofimg' src='"+image+"'/> "+rows['name']);
			$('#customerdetails #customer-info #detailname').val(rows['name']);
			$('#customerdetails #customer-info #detailphone').val(rows['phone']);
			$('#customerdetails #customer-info .call_btn').attr("href","tel:"+rows['phone']);
			$('#customerdetails #customer-info #detailemail').val(rows['email']);
			$('#customerdetails #customer-info #detailbirthday').val(rows['birthday']);
			$('#customerdetails #customer-info #detailsex').val(rows['sex']);
			$('#customerdetails #customer-info #detailalergies').val(rows['alergies']);
			$('#customerdetails #customer-info #detaillastvisit').val(rows['lastvisit']);
			$('#customerdetails #customer-info #detailtreatments').val(rows['treatments']);
			$('#customerdetails #customer-info #detailcut').val(rows['cut']);
			$('#customerdetails #customer-info #detailcolor').val(rows['color']);
			$('#customerdetails #customer-info #detailhairtype').val(rows['hairtype']);
			$('#customerdetails #customer-info #detailscalptype').val(rows['scalptype']);
			$('#customerdetails #customer-info #detailproducts').val(rows['products']);
			$("#piccustomerid").val(rows['id']);
			$('#customerdetails #delete').attr("onclick","cust.deleteRecord(\""+rows['id']+"\")");
		}
	}
	cust.selectCustRecords(id,renderDet);
}
//Pictures db
var pic ={};
pic.db = null;
pic.openDb = function(){
	if(window.sqlitePlugin !== undefined){
	pic.db = window.sqlitePlugin.openDatabase("pictures_db", "1.0", "picturesdb", 1000000);
	} else {
		// For debugging in simulator fallback to native SQL Lite	
		pic.db = window.openDatabase("pictures_db", "1.0", "picturesdb", 1000000);
		}
	}
//create table
pic.createTable = function(){
	pic.db.transaction(function(tx){
		//tx.executeSql('DROP TABLE pictures');
		tx.executeSql('CREATE TABLE IF NOT EXISTS pictures(id INTEGER PRIMARY KEY AUTOINCREMENT, customerId INTEGER(255) NOT NULL, url VARCHAR(255) NULL)');
	});
}
//insert record
pic.insertRecord = function(cid,purl){
	//var cid = $("#piccustomerid").val();
	//var purl = "images/evo.jpg";
	//document.getElementById('image').src = purl;
	$("#customerimages ul li.img").css("display","inline-block");
	pic.db.transaction(function(tx){
		tx.executeSql('INSERT INTO pictures(customerId,url) VALUES (?,?)',
			[cid,purl],
			pic.onSuccess,
			pic.OnError);
	});
	cust.updateRecord(purl,cid);
	
} 
//function will be called when process succeed
 pic.onSuccess = function (tx, r){
	/*navigator.notification.alert(
        'Done!',  // message
        null,         // callback
        'Salon Assistant',            // title
        'Ok'                  // buttonName
    );*/
	var id = $("#piccustomerid").val();
	getCustomerData(id);
	window.location.replace('#customersdetails');
}
//function will be called when process succeed
pic.onError = function (tx, e){
    console.log("SQLite error: "+e.message);
}
//update table
cust.updateRecord = function(isrc,id) {
	cust.db.transaction(function(tx) {
		tx.executeSql("UPDATE customers SET image = ? WHERE id = ?",
                  [isrc,id],
                  pic.onSuccess,
                  pic.onError);
	});
}
//delete record
pic.deleteRecord = function(id,purl) {
	navigator.notification.confirm(
		"Are you sure you want to delete this image?", 
		function(deletePicButtonIndex){
			ConfirmPicDelete(id,purl,deletePicButtonIndex);
		}, 
		"Delete Picture", 
		"Yes,No"
	); 
};
function ConfirmPicDelete(id,purl,pstat){
	if(pstat == "1"){
		$("#pic"+id).hide("slow").remove();
		pic.db.transaction(function(tx) {tx.executeSql("DELETE FROM pictures WHERE id = ?",[id],pic.onSuccess,pic.onError);});
		var relativeFilePath = purl;
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
			fileSystem.root.getFile(relativeFilePath, {create:false}, function(fileEntry){
				fileEntry.remove(function(file){
					//alert(file+"-File removed!");
				},function(){
					//alert("error deleting the file " + error.code);
					});
				},function(){
					//alert("file does not exist");
				});
			},function(evt){
				//alert(evt.target.error.code);
		});
	
	}else{
		return false;
	};
};
//select all from pictures_db
pic.selectAllRecords = function(fn) {
	pic.db.transaction(function(tx) {tx.executeSql("SELECT * FROM pictures", [],fn,pic.onError);});
}
/*function getAllPicturesData() {
	var render = function (tx, rs) {
		//rs contains our SQLite recordset, at this point you can do anything with it
		//in this case we'll just loop through it and output the results to the console
		for (var i = 0; i < rs.rows.length; i++) {
			var picrows = rs.rows.item(i);
				if(picrows['url']!=""){$(".custprofimg").attr("src",picrows['url']);}else if($('#detailsex').val()=='Male'){$(".custprofimg").attr("src","images/noimagemale.jpg");}else{$(".custprofimg").attr("src","images/noimagefemale.jpg");}
				$('#customerimages ul').append("<li><a data-role='none' class='pic' href='"+picrows['url']+"'><img class='picbutton' src='"+picrows['url']+"' alt='pic'/></br><a id='share'data-role='none' class='share' href='#' onclick=''><img src='images/ic_action_share.png'/></a></a></li>");
				$(".share").attr("onclick","window.plugins.socialsharing.share('This is one of my latest work.',null,'"+picrows['url']+"')");
		}
	}
	pic.selectAllRecords(render);
}*/
//select customer pictures
pic.selectCustRecords = function(id,fd) {
	pic.db.transaction(function(td) {td.executeSql("SELECT * FROM pictures WHERE customerId = ?", [id],fd,pic.onError);});
}
function getCustomerPictureData(id) {
	var renderPic = function (td, rs) {
	// rs contains our SQLite recordset, at this point you can do anything with it
	// in this case we'll just loop through it and output the results to the console
		for (var i = 0; i < rs.rows.length;i++) {
			var rows = rs.rows.item(i);
			$('#customerdetails #customer-info #customerimages ul').append("<li class='piclist' id='pic"+rows['id']+"'><a data-role='none' class='pic' href='"+rows['url']+"'><img class='picbutton' src='"+rows['url']+"' alt='"+rows['url']+"'/></br><a id='share' data-role='none' class='share' href='#' onclick=''><img src='images/ic_action_share.png'/></a><a id='picdelete' data-role='none' class='picdelete' href='#' onclick=''><img src='images/picdelete.png'/></a></a></li>");
			$(".share").attr("onclick","window.plugins.socialsharing.share('This is one of my latest works.',null,'"+rows['url']+"')");
			$(".picdelete").attr("onclick","pic.deleteRecord(\""+rows['id']+"\",\""+rows['url']+"\")");
		}
	}
	pic.selectCustRecords(id,renderPic);
}