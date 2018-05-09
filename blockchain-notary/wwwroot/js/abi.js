var abi = [
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
            {
                name: "",
                type: "bytes32"
            }],
        payable: false,
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "hash",
        outputs: [
            {
                name: "",
                type: "bytes32"
            }],
        payable: false,
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "owner",
        outputs: [
            {
                name: "",
                type: "address"
            }],
        payable: false,
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "size",
        outputs: [
            {
                name: "", type: "uint256"
            }],
        payable: false,
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "timestamp",
        outputs: [
            {
                name: "", type: "uint256"
            }], payable: false, type: "function"
    }, { constant: true, inputs: [], name: "file_timestamp", outputs: [{ name: "", type: "uint256" }], payable: false, type: "function" }, { constant: true, inputs: [], name: "mime_type", outputs: [{ name: "", type: "bytes32" }], payable: false, type: "function" }, { inputs: [{ name: "_hash", type: "bytes32" }, { name: "_name", type: "bytes32" }, { name: "_mime_type", type: "bytes32" }, { name: "_size", type: "uint256" }, { name: "_file_timestamp", type: "uint256" }], payable: true, type: "constructor" }];