var merchant = [];
$(document).ready(function() {
		var androidApplicationLicenseKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtApRCMqaUdn+pZQ55EDeUzZnLgyvpp0OwLPmjKXHnlE4YQkSlfpQDA6+xAog4850JbkoasCuz8zw0QtCelQong8MU7yfRG664uMHmtZ65sfS/KGpDpdEDCTuPGMpIxLgnPyYYbD/aMJj0yaB4Dw7of8FRqWWYfPNgn7xn5ymIUmWYfTV6yzJR9UbF6Ilu24nN6fMIHtxwzbb8Xf9ICuG/rb+JDoeAb59IZ73VXOZwzAHzk5HSdBaGSUUggrOk9MypGEsEbyLxT0GqxlM7zZmUxNpPcfSB/r9coGznl6GE1H8CBRg4MMhzrgKiZE/GaLelPZKzuLs3q70DgX7QqOGuwIDAQAB";
	var productIds ="premium_1,premium_3,coins_360,coins_720";
	var existing_purchases = [];
	var product_info = {};
	setTimeout(function(){
			merchantSetup();
		},200);
	function merchantSetup() {
		window.iap.setUp(androidApplicationLicenseKey);
		window.iap.requestStoreListing(productIds, function (result){
			console.log(result);
		for (var i = 0 ; i < result.length; ++i){
			var p = result[i];
			var price = p["price"];
			var priceTotal = price.replace(/[^0-9.,]/g,'');
			var priceCurrency = price.replace(/[0-9-,]/g,'');
			var merchantSub = {
				"title": p["title"],
				"price": priceTotal,
				"currency": priceCurrency,
				"description":p["description"]
			};
			merchant[p["productId"]] = merchantSub;
		}
		},
		function (error){
			console.log(error);
		});
	}
	//Satın Alma Fonksiyonu
	function merchantPurcase(productId) {
		//purchase product id, put purchase product id info into server.
		window.iap.purchaseProduct(productId, function (result){
			inAppPurchase('merchant',result);
		},
		function (error){
				if(error!=='userCancelled'){
					console.log(error);
				}
		});
	}
	
	function purchaseProduct(productId) {
		//purchase product id, put purchase product id info into server.
		window.iap.purchaseProduct(productId, function (result){
			alert("purchaseProduct");
		}, 
		function (error){
			alert("error: "+error);
		});
	}
	
	//satın aldıktan sonra kullanıldığının iletilmesi
	function consumeProduct(productId) {
		//consume product id, throw away purchase product id info from server.
		window.iap.consumeProduct(productId, function (result){
			//console.log('consume success');
		}, 
		function (error){
		//console.log("consume error: "+error);
		});	
	}
	
	//satın alımları kontrol etmek
	function restorePurchases() {
		//get user's purchased product ids which purchased before and not cunsumed.
			window.iap.restorePurchases(function (result){
				for (var i = 0 ; i < result.length; ++i){
					inAppPurchase(result[i])
				}
			}, 
			function (error){
				console.log(error);
			});
	}
	
	function hasProduct(productId){
		return existing_purchases.indexOf(productId) !== -1;
	}
	
	//satın alımları backend kontrol sayfası
		function inAppPurchase(type,result){
			$.ajax({
				url: serverUrl+'/google',
				type: 'POST',
				dataType: 'jsonp',
				data: result,
				timeout: 60000,
				cache: false,
				beforeSend: function(xhr, settings){
					loader('show');
				},
				complete: function(xhr, textStatus) {
					loader('hide');
				},
				success: function(data, textStatus, xhr) {
					if(data.type=='success'){
						alert('başarılı');
						if(data.iap=='coins'){
							consumeProduct(result.productId);
						}
					}else if(data.type=='error'){
						alert('hata');
					}
				},
				error: function(xhr, textStatus, errorThrown) {
					console.log(xhr);
				}
			});
	}
	//satın alma linki
	$(document).on('click','.buy',function(){
		var id = $(this).attr("id");
		merchantPurcase(id);
	});
	$(document).on("click",".buyCheck", function(e){
			restorePurchases();
		});
	
	
});