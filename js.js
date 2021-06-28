function checkReferer () {
	chrome.storage.sync.get("isInvited", function (isInvited) {
		if (!isInvited.isInvited) {
			chrome.storage.sync.get("token", function (storage) {
				$.ajax({
					url: "https://apps.smit.studio/morgenBlock/user/referer",
					method: "get",
					headers: {
						'Authorization': 'Bearer ' + storage.token,
					},
					dataType: "json",
					success: (function (res) {
						if (res.result) {
							chrome.storage.sync.set({ isInvited: true }, function () {
								$("#default").slideUp(200)
								$("#withref").slideDown(200)
								unlockPro();
							});
						}
					})
				})
			});
		}
	});
}

function unlockPro () {
	chrome.storage.sync.set({ blockList: ['моргенштерн','morgenstern','morgenshtern','алишер тагирович', 'алишер валеев','бузова','бузовой','бузову'] }, function () { });
}

function buttonsStatus () {
	chrome.storage.sync.get("enable", function (storage) {
		// console.log(storage);
		
		if (!storage.hasOwnProperty('enable') || storage.enable) {
			//$("#disableBlockWrapper").hide()
			
			//$("#enableBlockWrapper").show()
			$("#enableBlockWrapper").hide()

			$("#disableBlockWrapper").show()
		} else {
			$("#disableBlockWrapper").hide()
			$("#enableBlockWrapper").show()
		}
	})
}

function localizeHtmlPage() {
	document.querySelectorAll('[data-locale]').forEach(elem => {
		if (elem.dataset.localetype) {
			switch (elem.dataset.localetype) {
				case "placeholder":
					elem.setAttribute("placeholder", chrome.i18n.getMessage(elem.dataset.locale))
					break;

				case "value":
					elem.value = chrome.i18n.getMessage(elem.dataset.locale)
					break;
			}
		} else {
			elem.innerText = chrome.i18n.getMessage(elem.dataset.locale)
		}
	})
}

$(document).ready(function () {
	$("#close").click(function () {
		window.close();
	})

	$("#ref-form").submit(function (e) {
		chrome.storage.sync.get("token", function (storage) {

			$.ajax({
				url: "https://apps.smit.studio/morgenBlock/user/setInvite",
				method: "post",
				data: { refcode: $("#input-refcode").val() },
				headers: {
					'Authorization': 'Bearer ' + storage.token,
				},
				dataType: "json",
				success: (function (res) {
					if (!res.result) {
						//alert('Код недействителен')
					} else {
						chrome.storage.sync.set({ isInvited: true }, function () {
							$("#default").slideUp(200)
							$("#withref").slideDown(200)
							unlockPro();
						});
					}
				})
			})
		});

		e.preventDefault()
	})


	$("#enableBlock").click(function () {
		chrome.storage.sync.set({ enable: true }, function () { });
		buttonsStatus()
	})
	
	$("#disableBlock").click(function () {
		chrome.storage.sync.set({ enable: false }, function () { });
		buttonsStatus()
	})

	chrome.storage.sync.get("isInvited", function (res) {
		if (res.isInvited) {
			$("#withref").slideDown(200)
		} else {
			$("#default").slideDown(200)
		}
	});

	buttonsStatus();

	localizeHtmlPage();

	checkReferer();

});
chrome.storage.sync.get("refcode", function (res) {
	$(".refcode").html(res.refcode)
});
chrome.storage.sync.get("token", function (res) {
	//console.log(res.token)
});