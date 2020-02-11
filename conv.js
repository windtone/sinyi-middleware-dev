exports.checkUserLocation = content => {
	return (
		!(content.queryResult && content.queryResult.queryText) &&
		content.originalDetectIntentRequest.payload.inputs[0].intent === 'actions.intent.PERMISSION' &&
		content.originalDetectIntentRequest.payload.device
	)
}

exports.getUserLocation = content => {
	let location = content.originalDetectIntentRequest.payload.device.location

	if (location) return location

	throw new ValueNotFoundException(
		'Name parameter not found. make sure you have requested for this permission using ask_permission(NAME)'
	)
}

exports.fallbackCancelGPS = content => {
	return (
		content.originalDetectIntentRequest.payload.inputs[0].intent === 'action.intent.PERMISSION' &&
		content.originalDetectIntentRequest.payload.inputs[0].rawInputs[0].query === '不用了'
	)
}

exports.askPermission = (permissions, context) => {
	if (permissions)
		return {
			payload: {
				google: {
					expectUserResponse: true,
					richResponse: {
						items: [
							{
								simpleResponse: {
									textToSpeech: 'placeholder',
								},
							},
						],
					},
					systemIntent: {
						intent: 'actions.intent.PERMISSION',
						data: {
							'@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
							optContext: context,
							permissions: permissions,
						},
					},
				},
			},
		}

	throw new ValueMissingException('at least one permission is required')
}

function ValueNotFoundException(message) {
	this.message = message
	this.name = 'ValueNotFoundException'
}

function ValueMissingException(message) {
	this.message = message
	this.name = 'ValueMissingException'
}
