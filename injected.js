$(document).ready(function () {
	// console.log(chrome.i18n.getMessage("locale"));
	
	chrome.storage.sync.get("lastListUpdate", function (storage) {
		
		if (!storage.lastListUpdate || (storage.lastListUpdate + 60 * 5 * 1000) < (+new Date())) {
			$.ajax({
				url: "https://apps.smit.studio/morgenBlock/memes/" + chrome.i18n.getMessage("locale"),
				method: "get",
				dataType: "json",
				success: (function (res) {
					//console.log(res);
					
					if (res.result) {
						chrome.storage.sync.set({ memesList: res.data, lastListUpdate: (+new Date()) }, function () {
							//console.log("list updated");
						});
					}
				})
			})
		}
	})
	if (!~document.location.href.indexOf("//docs.google.com/") && !~document.location.href.indexOf("//onedrive.live.com/")) {
		setInterval(() => {
			blockThemALL()
		}, 3000);
		blockThemALL()
	}
	

})

function findNotOnceWord (node) {
	while (!~(node.textContent || '').indexOf(' ')) {
		node = node.parentNode
	}

	return node
}

function blockThemALL () {
	chrome.storage.sync.get("enable", function (storageEnable) {
		if (!storageEnable.hasOwnProperty('enable') || storageEnable.enable) {
			chrome.storage.sync.get("blockList", function (storage) {
				let wordsBlock = storage.blockList
				
				chrome.storage.sync.get("memesList", function (memesListStorage) {
					var memesList = memesListStorage.memesList			
			
					$('*', 'body')
						.andSelf()
						.not('iframe, script, style, input, textarea')
						.contents()
						.filter(function () {
							return this.nodeType === 3;
						})
						.filter(function () {
							let t = this.nodeValue.toLowerCase()
							let isContainsWord = false
							

							// console.log(t);

							for (let index = 0; index < wordsBlock.length; index++) {
								const wordBlock = wordsBlock[index];

								// console.log(wordBlock.toLowerCase());
								// console.log(~t.indexOf(wordBlock.toLowerCase()));

								if (~t.indexOf(wordBlock.toLowerCase())) {
									isContainsWord = true
									
									break
								}
							}
							return isContainsWord
						})
						.each(function (i, v) {
							// console.log("v.textContent", v.textContent);
							// console.log("v.parentNode.innerText", v.parentNode.innerText);
							
							if (v.textContent !== v.parentNode.innerText) {
								// console.log("v.textContent !== v.parentNode.innerText");
								v.parentNode.innerText = memesList[Math.floor(Math.random() * memesList.length)]
							} else {

								if (~v.textContent.indexOf(' ')) {
									v.textContent = memesList[Math.floor(Math.random() * memesList.length)]
									// console.log("has space");
									
								} else {
									// console.log("hasnt space");
									try {
										// console.log("v.parentNode.parentNode.innerText", v.parentNode.parentNode.innerText);
										// console.log("v.parentNode.parentNode.innerText", v.parentNode.parentNode.innerText.trim());
										if (~v.parentNode.parentNode.innerText.indexOf(' ')) {
											// console.log("has space 2");
											v.parentNode.parentNode.innerText = memesList[Math.floor(Math.random() * memesList.length)]
										} else {
											// console.log("hasnt space 2");
											v.textContent = memesList[Math.floor(Math.random() * memesList.length)]
										}
									} catch (e) {
										//console.log(e);
									}
								}
							}
						});
				})
			})
		}
	})
}