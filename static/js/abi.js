const abi=[
	{
		"constant": true,
		"inputs": [
			{
				"name": "proof",
				"type": "bytes32"
			}
		],
		"name": "hasProof",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "proof",
				"type": "bytes32"
			}
		],
		"name": "notarise",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]