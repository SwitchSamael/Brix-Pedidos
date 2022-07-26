
async function getTableFromServer() {
    return await fetch("http://192.168.100.20:9999/file/get", {
        method: "get",
        headers: { "Content-Type": "text/plain" }
    })
        .then(async (response) => {
            const json = await response.json();
            return ([response.status, json])
        })
        .then(data => {
            const errorCode = data[0];
            const json = data[1];

            if (errorCode !== 204) {
                return json;
            };
        });
};

async function getIntelbrasHTMLTable() {
    return await fetch("http://192.168.100.20:9999/table/get/intelbrasHTML", {
        method: "get",
    })
        .then(async (response) => await response.text())
};

async function getTableTestFromServer() {
    return await fetch("http://192.168.100.20:9999/file/getTest", {
        method: "get",
        headers: { "Content-Type": "text/plain" }
    })
        .then(async (response) => {
            const json = await response.json();
            return ([response.status, json])
        })
        .then(data => {
            const errorCode = data[0];
            const json = data[1];

            if (errorCode !== 204) {
                return json;
            };
        });
};


function sendTableToServer(jsonString) {
    fetch("http://192.168.100.20:9999/file/post", {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: jsonString
    });
};

async function processTable(jsonString) {
    return await fetch("http://192.168.100.20:9999/file/process", {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: jsonString
    }).then(response => response.json());
};

function sendTransactionToServer(jsonString) {
    fetch("http://192.168.100.20:9999/document/post", {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: jsonString
    });
};