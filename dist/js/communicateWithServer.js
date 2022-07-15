
async function getTableFromServer() {
    let tableJson = await fetch("http://192.168.100.20:9999/file/get", {
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

            if(errorCode !== 404){
                return json;
            };
        });

        return tableJson;
};


function sendTableToServer(json) {
    fetch("http://192.168.100.20:9999/file/post", {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    });
};