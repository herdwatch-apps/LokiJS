// More tests to spec/indexed-db.html
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
describe('LokiIndexedAdapter', function () {
  it('initializes Loki properly', function() {
    var adapter = new LokiIndexedAdapter('tests');
    var db = new loki('test.db', { adapter: adapter });
    var coll = db.addCollection('coll');

    expect(coll.name).toBe('coll');
    expect(adapter.app).toBe('tests');
    expect(adapter.catalog).toBe(null);
  })
  function checkDatabaseCopyIntegrity(source, copy) {
    source.collections.forEach(function(sourceCol, i) {
      var copyCol = copy.collections[i];
      expect(copyCol.name).toBe(sourceCol.name);
      expect(copyCol.data.length).toBe(sourceCol.data.length);

      copyCol.data.every(function(copyEl, elIndex) {
        expect(JSON.stringify(copyEl)).toBe(JSON.stringify(source.collections[i].data[elIndex]))
      })
    })
  }
  it('checkDatabaseCopyIntegrity works', function() {
    var adapter = new LokiIndexedAdapter('tests');
    var db = new loki('test.db', { adapter: adapter });
    var col1 = db.addCollection('test_collection');

    var doc1 = { foo: '1' };
    var doc2 = { foo: '2' };
    var doc3 = { foo: '3' };
    col1.insert([doc1, doc2, doc3]);
    doc2.bar = 'true';
    col1.update(doc2);
    col1.remove(doc3);

    // none of these should throw
    checkDatabaseCopyIntegrity(db, db);
    checkDatabaseCopyIntegrity(db, db.copy());
    checkDatabaseCopyIntegrity(db, JSON.parse(db.serialize()));

  })
  it('basically works', function(done) {
    var adapter = new LokiIndexedAdapter('tests');
    var db = new loki('test.db', { adapter: adapter });
    var col1 = db.addCollection('test_collection');

    col1.insert({ customId: 0, val: 'hello' });
    col1.insert({ customId: 1, val: 'hello1' });
    var h2 = col1.insert({ customId: 2, val: 'hello2' });
    var h3 = col1.insert({ customId: 3, val: 'hello3' });
    var h4 = col1.insert({ customId: 4, val: 'hello4' });
    var h5 = col1.insert({ customId: 5, val: 'hello5' });

    h2.val = 'UPDATED';
    col1.update(h2);

    h3.val = 'UPDATED';
    col1.update(h3);
    h3.val2 = 'added!';
    col1.update(h3);

    col1.remove(h4);

    var h6 = col1.insert({ customId: 6, val: 'hello6' });

    db.saveDatabase(function (e) {
      expect(e).toBe(null);

      var adapter2 = new LokiIndexedAdapter('tests');
      var db2 = new loki('test.db', { adapter: adapter2 });

      db2.loadDatabase({}, function (e) {
        expect(e).toBe(null);

        checkDatabaseCopyIntegrity(db, db2);
        done()
      });
    });
  })
  it('error on save', function(done) {
    // indexedDB.deleteDatabase('LokiCatalog');
    var adapter = new LokiIndexedAdapter('tests');
    var db = new loki('test.db', { adapter: adapter, autosave: true, autosaveInterval: 10 });
    var col1 = db.addCollection('test_collection');

    col1.insert({ customId: 0, val: 'hello' });
    col1.insert({ customId: 1, val: 'hello1' });

    adapter.getCatalogSummary(() => {
      adapter.simulateErrorMessage = 'DOMException: Connection to Indexed Database server lost. Refresh the page to try again';
      db.saveDatabase(function (result) {
        expect(result.success).toBe(false);
        expect(result.error.message).toBe(adapter.simulateErrorMessage);
        done();
      });
    });





    // db.persistenceAdapter.catalog.__proto__.setAppKey = (app, key, val, callback) => {
    //   var openRequest = indexedDB.open('LokiCatalog', 1);
    //   openRequest.onsuccess = function (event) {
    //     var rawDb = event.target.result;
    //     var transaction = rawDb.transaction(['LokiAKV'], 'readonly');
    //     var store = transaction.objectStore('LokiAKV');
    //     var index = store.index('appkey');
    //     var appkey = app + ',' + key;
    //     var request = index.get(appkey);
    //
    //     request.onsuccess = function (e) {
    //       var res = e.target.result;
    //
    //       if (res === null || res === undefined) {
    //         res = {
    //           app: app,
    //           key: key,
    //           appkey: appkey,
    //           val: val,
    //         };
    //       } else {
    //         res.val = val;
    //       }
    //
    //       var requestPut = store.put(res);
    //
    //       requestPut.onsuccess = requestPut.onerror = (function (usercallback) {
    //         return function (e) {
    //           usercallback({success: false, error: requestPut.error});
    //         };
    //       })(callback);
    //
    //     };
    //
    //   };
    // }


  })
})
