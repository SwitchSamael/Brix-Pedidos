
export async function getTableFromServer() {
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

export async function getIntelbrasTableFromServer() {
    return await fetch("http://192.168.100.20:9999/table/intelbras/get", {
        method: "get",
        headers: { "Content-Type": "text/plain" }
    })
        .then(async (response) => {
            const json = await response.json();
            return ([response.status, json]);
        })
        .then(data => {
            const errorCode = data[0];
            const json = data[1];

            if (errorCode !== 204) {
                return json;
            };
        });
};


export function sendIntelbrasTableToServer(jsonString) {
    fetch("http://192.168.100.20:9999/table/intelbras/post", {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: jsonString
    });
};

export async function processEditTable(jsonString) {
    return await fetch("http://192.168.100.20:9999/table/editTable/process", {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: jsonString
    }).then(response => response.json());
};

export function getNextSerialNumber() {
    return new Promise(resolve => {
        fetch("http://192.168.100.20:9999/contract/nextSerialNumber",
            { method: "get" })
            .then(response => {
                resolve(response.json());
            });
    });
};

export function sendContractToServer(jsonString) {
    fetch("http://192.168.100.20:9999/contract/post", {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: jsonString
    });
};