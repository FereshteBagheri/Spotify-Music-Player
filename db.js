var db;
function createDB() {
    var request = indexedDB.open("data", 1);
    request.addEventListener("error", function (err) {
        console.log("indexedDB err: ", err);
    });
    request.addEventListener("success", function () {
        db = request.result;
    });
    request.addEventListener("upgradeneeded", function () {
        db = request.result;
        db.createObjectStore("songs");
    });
}
function putInDB(element, key, store) {
    var openReq = indexedDB.open("data");
    openReq.addEventListener("success", function () {
        db = openReq.result;
        var transaction = db.transaction(store, "readwrite");
        var objStore = transaction.objectStore(store);
        var req = objStore.openCursor(key);
        req.onsuccess = function (e) {
            var ee = e.target;
            var cursor = ee.result;
            if (cursor) {
                cursor.update(element);
            }
            else {
                var temp = JSON.parse(JSON.stringify(element));
                var request = objStore.add(temp, key);
                request.onerror = function (err) { return console.log(err); };
                transaction.oncomplete = function () { return db.close; };
            }
        };
    });
}
