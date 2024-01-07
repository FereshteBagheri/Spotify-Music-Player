let db: IDBDatabase;

function createDB() {
  const request = indexedDB.open("data", 1);

  request.addEventListener("error", (err) => {
    console.log("indexedDB err: ", err);
  });

  request.addEventListener("success", () => {
    db = request.result;
  });

  request.addEventListener("upgradeneeded", () => {
    db = request.result;
    db.createObjectStore("songs");
  });
}

function putInDB(element: object, key: number, store: string) {
  const openReq = indexedDB.open("data");
  openReq.addEventListener("success", () => {
    db = openReq.result;
    const transaction = db.transaction(store, "readwrite");
    const objStore = transaction.objectStore(store);
    const req = objStore.openCursor(key);
    req.onsuccess = function (e) {
      const ee = <IDBRequest>e.target;
      var cursor = ee.result;
      if (cursor) {
        cursor.update(element);
      } else {
        const temp = JSON.parse(JSON.stringify(element));
        const request = objStore.add(temp, key);
        request.onerror = (err) => console.log(err);
        transaction.oncomplete = () => db.close;
      }
    };
  });
}
