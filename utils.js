exports.replayTalk = text => {
	return {
		platform: 'ACTIONS_ON_GOOGLE',
		simpleResponses: {
			simpleResponses: [
				{
					textToSpeech: text,
				},
			],
		},
	}
}

exports.baseCard = (title, subtitle, img, linkurl) => {
	return {
		platform: 'ACTIONS_ON_GOOGLE',
		basicCard: {
			title: title,
			subtitle: subtitle,
			formattedText: subtitle,
			image: {
				imageUri: img,
				accessibilityText: '666',
			},
			buttons: [
				{
					title: '查看更多',
					openUriAction: {
						uri: linkurl,
					},
				},
			],
		},
	}
}

exports.byebye = () => {
	return {
		platform: 'ACTIONS_ON_GOOGLE',
		basicCard: {
			title: '昕力資訊',
			subtitle: '',
			formattedText: '再見，歡迎你下次到來',
			image: {
				imageUri: 'https://imgur.com/W0dgU0E.jpg',
				accessibilityText: '666',
			},
			buttons: [
				{
					title: '圖片鏈結',
					openUriAction: {
						uri: 'https://www.thinkpower.com.tw/',
					},
				},
			],
		},
	}
}

//  列表清單卡(完成) 有內容的
exports.urlListCard = (xTitle, cards) => {
	let rep = { items: [] }

	// 多牌卡這編寫的有問題
	let mCount = 0

	let mTitle = '' // 建案名稱

	cards.forEach(card => {
		let mText = '' // 文案全部
		let mPattern = '' // 格局
		let mAreaS = '' // 坪數
		let mPrice = '' // 價格
		let mPark = '' // 車位

		card.cTexts.forEach(item => {
			if (item.cLabel === '物件名稱') {
				mTitle = item.cText
			} else {
				let mObject = item.cText
				// if (typeof mObject === 'number') {
				//   mObject = `${mObject}萬`
				// }
				if (typeof mObject === 'boolean') {
					mPark = mObject ? '有車位' : '沒車位'
				}
				if (item.cLabel === '格局') {
					mPattern = mObject
				}
				if (item.cLabel === '建坪') {
					mAreaS = `${mObject}坪`
				}
				if (item.cLabel === '價格') {
					mPrice = `$${mObject}萬`
				}
			}
		})

		mText = `${mPattern} - ${mAreaS}\n${mPrice}\n${mPark}`

		rep.items.push({
			title: mTitle || '',
			description: mText,
			image: {
				imageUri: card.cImageData.cImageUrl,
				accessibilityText: '顯示異常',
			},
			openUriAction: {
				url: card.curl,
			},
		})

		mCount++
	})

	console.log(rep.items)
	return {
		platform: 'ACTIONS_ON_GOOGLE',
		browseCarouselCard: {
			items: rep.items,
		},
	}
}

// 列表清單卡(完成) 有內容的
exports.listCard = (xTitle, cards) => {
	let rep = { items: [] }
	// 多牌卡這編寫的有問題
	let mCount = 0

	let mTitle = '' // 建案名稱

	cards.forEach(card => {
		let mText = '' // 文案全部
		card.cTexts.forEach(item => {
			if (item.cLabel === '物件名稱') {
				mTitle = item.cText
			} else {
				let mObject = item.cText
				if (typeof mObject === 'number') {
					mObject = `$${mObject}萬`
				}
				if (typeof mObject === 'boolean') {
					mObject = mObject ? '有車位' : '沒車位'
				}
				mText += `${item.cLabel}:${mObject}\n`
			}
		})

		rep.items.push({
			info: {
				key: `${mCount + 1}`,
			},
			title: mTitle || '',
			description: mText,
			image: {
				// 公司產品後面沒圖因此這塊用不到
				imageUri: card.cImageData.cImageUrl,
				accessibilityText: '66',
			},
		})
		mCount++
	})

	return {
		platform: 'ACTIONS_ON_GOOGLE',
		listSelect: {
			title: xTitle,
			items: rep['items'],
		},
	}
}
// 列表卡(完成) 只有標題
exports.titleList = (xTitle, cards) => {
	let rep = { items: [] }
	// 多牌卡這編寫的有問題
	let mCount = 0

	cards.forEach(card => {
		card.cLinkList.forEach(item => {
			rep.items.push({
				info: {
					key: `${mCount + 1}`,
				},
				title: item.clText,
				description: item.clAlt,
				image: {
					// 公司產品後面沒圖因此這塊用不到
					imageUri: card.cImageData ? card.cImageData.cImageUrl : '',
					accessibilityText: '66',
				},
			})
		})
		mCount++
	})

	return {
		platform: 'ACTIONS_ON_GOOGLE',
		listSelect: {
			title: xTitle,
			items: rep.items,
		},
	}
}
// 標籤模式(改好了)
exports.tagCard = xItem => {
	let rep = { suggestions: [] }
	let linkOut = undefined
	console.log(xItem)
	xItem.forEach(item => {
		if (item.url) {
			linkOut = {
				platform: 'ACTIONS_ON_GOOGLE',
				linkOutSuggestion: {
					destinationName: item.title,
					uri: item.url,
				},
			}
		} else {
			rep.suggestions.push({
				title: item.title,
			})
		}
	})

	// return {
	//     "platform": "ACTIONS_ON_GOOGLE",
	//     "suggestions": rep
	// }

	let suggestions = {
		platform: 'ACTIONS_ON_GOOGLE',
		suggestions: rep,
	}

	let list = []
	list.push(suggestions)
	if (linkOut) list.push(linkOut)
	console.log('list')
	console.log(list)
	return list
}

exports.tagList = xItem => {
	let rep = []
	xItem.forEach(item => {
		rep.push(item.title)
	})
	return rep
}

// 輪播卡(完成)
exports.rollCard = (xType, cards) => {
	if (xType === '88') {
		return {
			platform: 'ACTIONS_ON_GOOGLE',
			carouselSelect: {
				items: [
					{
						info: {
							key: '01',
						},
						title: '01',
						description: '01',
						image: {
							imageUri: 'https://imgur.com/2SWRqQE.jpg',
							accessibilityText: '111',
						},
					},
				],
			},
		}
	} else {
		let rep = { items: [] }
		let index = 0
		cards.forEach(card => {
			card.cTexts.forEach(item => {
				rep.items.push({
					info: {
						key: `${index + 1}`,
					},
					title: item.cLabel,
					description: item.cText,
					image: {
						// "imageUri": "https://imgur.com/YbW33i5",
						// "accessibilityText": "66"
					},
				})
				index++
			})
		})

		return {
			platform: 'ACTIONS_ON_GOOGLE',
			carouselSelect: {
				items: rep.items,
			},
		}
	}
}
// 標籤超連結
exports.tagUrlCard = (xItem, xUrl) => {
	return {
		platform: 'ACTIONS_ON_GOOGLE',
		linkOutSuggestion: {
			destinationName: xItem,
			uri: xUrl,
		},
	}
}

exports.telButton = xItem => {
	return {
		platform: 'ACTIONS_ON_GOOGLE',
		basicCard: {
			title: xItem.title,
			subtitle: xItem.title,
			formattedText: '',
			image: {
				imageUri: '',
				accessibilityText: '顯示異常',
			},
			buttons: [
				{
					title: xItem.title,
					openUriAction: {
						uri: xItem.url,
						androidApp: {
							packageName: 'com.android.phone',
						},
						versions: [],
					},
				},
			],
		},
	}
}

//  圖表
exports.tableCard = () => {
	return {
		platform: 'ACTIONS_ON_GOOGLE',
		tableCard: {
			title: '浣熊',
			image: {
				imageUri: 'https://i.imgur.com/qWt0MZS.jpg',
				accessibility_text: '蛤',
			},
			columnProperties: [
				{
					horizontalAlignment: 'LEADING',
				},
				{
					horizontalAlignment: 'CENTER',
				},
				{
					horizontalAlignment: 'TRAILING',
				},
			],
			rows: [
				{
					cells: [
						{
							text: '001',
						},
						{
							text: '002',
						},
						{
							text: '003',
						},
					],
				},
				{
					cells: [
						{
							text: '004',
						},
						{
							text: '005',
						},
						{
							text: '006',
						},
					],
				},
				{
					cells: [
						{
							text: '007',
						},
						{
							text: '008',
						},
						{
							text: '009',
						},
					],
				},
			],
		},
	}
}

exports.mediaCard = () => {
	return {
		inputPrompt: {
			richInitialPrompt: {
				items: [
					{
						simpleResponse: {
							textToSpeech: '請用完整的問法再說一次好嗎？拜託拜託',
						},
					},
					{
						mediaResponse: {
							mediaType: 'AUDIO',
							mediaObjects: [
								{
									name: '測試影片',
									description: '......',
									largeImage: {
										url: 'https://imgur.com/qWt0MZS',
										accessibilityText: '666',
									},
									contentUrl: 'https://www.youtube.com/watch?v=amLM8pxaSx0',
								},
							],
						},
					},
				],
			},
		},
	}
}

exports.browseCarouselCard = (rep, item) => {
	// let rep = { items: [] }
	return rep.items.push({
		openUriAction: {
			url: item.url,
		},
		title: item.text,
		image: {
			imageUri: 'https://tpu.thinkpower.com.tw/tpu/images/new/logo.png',
			accessibilityText: '666',
		},
	})
}

exports.pushBrowseCarouselCard = rep => {
	return {
		platform: 'ACTIONS_ON_GOOGLE',
		browseCarouselCard: {
			items: rep.items,
		},
	}

	// return {
	//   platform: 'ACTIONS_ON_GOOGLE',
	//   browseCarouselCard: {
	//     items: [
	//       {
	//         openUriAction: {
	//           url: 'https://tpu.thinkpower.com.tw/tpu/'
	//         },
	//         title: '昕力大學',
	//         image: {
	//           imageUri: 'https://tpu.thinkpower.com.tw/tpu/images/new/logo.png',
	//           accessibilityText: '666'
	//         }
	//       },
	//       {
	//         openUriAction: {
	//           url: 'https://www.thinkpower.com.tw/'
	//         },
	//         title: '昕力資訊',
	//         image: {
	//           imageUri: 'https://tpu.thinkpower.com.tw/tpu/images/new/logo.png',
	//           accessibilityText: '7777'
	//         }
	//       }
	//     ]
	//   }
	// }
}
