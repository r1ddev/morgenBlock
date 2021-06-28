$.get(chrome.extension.getURL('injected.js'),
	function (data) {
		var script = document.createElement("script");
		script.setAttribute("type", "text/javascript");
		script.innerHTML = data;
		document.getElementsByTagName("head")[0].appendChild(script);
		document.getElementsByTagName("body")[0].setAttribute("onLoad", "injected_main();");
	}
);

chrome.runtime.onInstalled.addListener(function (details) {
	if (details.reason == "install") {
		chrome.storage.sync.set({ blockList: ['моргенштерн','morgenstern','morgenshtern','алишер тагирович', 'алишер валеев'] }, function () { });
		$.ajax({
			url: "https://apps.smit.studio/morgenBlock/user",
			method: "post",
			dataType: "json",
			success: (function (res) {
				chrome.storage.sync.set({ token: res.token, refcode: res.ref_code }, function () { });
			})
		})

	} else if (details.reason == "update") { }
});